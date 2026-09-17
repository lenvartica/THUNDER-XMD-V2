import { env } from '../config/env.js';
import { formatDuration } from '../utils/text.js';
import { incrementUsage } from '../database/db.js';

export const commands = new Map();

export function register(command) {
  commands.set(command.name, command);
  for (const alias of command.aliases || []) commands.set(alias, command);
}

export function commandList() {
  return [...new Set([...commands.values()])];
}

export function parseCommand(text) {
  const value = String(text || '').trim();
  if (!value.startsWith(env.BOT_PREFIX)) return null;
  const tokens = value.slice(env.BOT_PREFIX.length).trim().split(/\s+/);
  const name = (tokens.shift() || '').toLowerCase();
  return { name, args: tokens, raw: value };
}

export async function executeCommand(ctx) {
  const command = commands.get(ctx.parsed.name);
  if (!command) return false;
  incrementUsage(command.name);
  if (command.ownerOnly && !ctx.isOwner) return ctx.reply('This command is restricted to the bot owner.');
  if (command.groupOnly && !ctx.isGroup) return ctx.reply('This command can only be used in groups.');
  if (command.adminOnly && !ctx.isGroupAdmin) return ctx.reply('Group-admin permission is required.');
  await command.execute(ctx);
  return true;
}

register({ name: 'ping', aliases: [], category: 'General', description: 'Check bot response time.', execute: async ({ reply }) => reply('⚡ Thunder XMD V2 is online.') });
register({ name: 'runtime', aliases: [], category: 'General', description: 'Show bot uptime.', execute: async ({ reply, state }) => reply(`⏱️ Runtime: ${formatDuration(Date.now() - state.startedAt)}`) });
register({ name: 'status', aliases: [], category: 'General', description: 'Show connection status.', execute: async ({ reply, state }) => reply(`📡 Connection: ${state.connection}\n🔁 Reconnect attempts: ${state.reconnectAttempts}`) });
register({ name: 'owner', aliases: [], category: 'Information', description: 'Show owner information.', execute: async ({ reply }) => reply(`👤 Owner: ${env.OWNER_NAME}\n📞 Number: ${env.OWNER_NUMBER}`) });
register({ name: 'about', aliases: [], category: 'Information', description: 'Show bot information.', execute: async ({ reply }) => reply(`⚡ ${env.BOT_NAME}\nVersion: 2.0.0\nBy: Decan Techs`) });
register({ name: 'help', aliases: ['menu'], category: 'General', description: 'Show available commands.', execute: async ({ reply }) => { const grouped = {}; for (const item of commandList()) (grouped[item.category] ||= []).push(`${env.BOT_PREFIX}${item.name} — ${item.description}`); return reply(Object.entries(grouped).map(([key, values]) => `*${key}*\n${values.join('\n')}`).join('\n\n')); } });
register({ name: 'settings', aliases: [], category: 'Settings', description: 'Show safe bot settings.', ownerOnly: true, execute: async ({ reply }) => reply(`Prefix: ${env.BOT_PREFIX}\nAI provider: ${env.AI_PROVIDER}\nMedia limit: ${env.MAX_MEDIA_MB} MB`) });
register({ name: 'restart', aliases: [], category: 'Owner', description: 'Request a controlled restart.', ownerOnly: true, execute: async ({ reply, restart }) => { await reply('♻️ Restart requested.'); restart(); } });
register({ name: 'groupinfo', aliases: [], category: 'Groups', description: 'Show group information.', groupOnly: true, execute: async ({ reply, metadata }) => reply(`👥 ${metadata?.subject || 'Group'}\nParticipants: ${metadata?.participants?.length || 0}`) });
register({ name: 'tagall', aliases: [], category: 'Groups', description: 'Mention group members with admin permission.', groupOnly: true, adminOnly: true, execute: async ({ reply, metadata }) => { const mentions = (metadata?.participants || []).map((p) => p.id); await reply(`📢 ${mentions.map((id) => `@${id.split('@')[0]}`).join(' ')}`, mentions); } });
