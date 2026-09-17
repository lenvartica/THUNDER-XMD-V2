import { commands, executeCommand, parseCommand } from '../commands/registry.js';
import { env } from '../config/env.js';
import { state } from '../core/state.js';
import { logger } from '../utils/logger.js';
import { normalizeNumber } from '../utils/text.js';

const cooldowns = new Map();

export async function handleMessage(socket, message) {
  try {
    if (!message.message || message.key.fromMe) return;
    const jid = message.key.remoteJid;
    const text = message.message.conversation || message.message.extendedTextMessage?.text || '';
    const parsed = parseCommand(text);
    if (!parsed) return;
    const sender = message.key.participant || jid;
    const isGroup = jid.endsWith('@g.us');
    const owner = normalizeNumber(env.OWNER_NUMBER);
    const isOwner = normalizeNumber(sender) === owner || normalizeNumber(jid) === owner;
    const now = Date.now();
    const previous = cooldowns.get(sender) || 0;
    if (now - previous < env.COMMAND_COOLDOWN_MS) return;
    cooldowns.set(sender, now);
    const metadata = isGroup ? await socket.groupMetadata(jid) : null;
    const isGroupAdmin = Boolean(metadata?.participants?.find((p) => p.id === sender && ['admin', 'superadmin'].includes(p.admin)));
    const reply = async (content, mentions = []) => socket.sendMessage(jid, { text: content, mentions });
    await executeCommand({ socket, message, parsed, jid, sender, isGroup, isOwner, isGroupAdmin, metadata, reply, state, commands, restart: () => process.kill(process.pid, 'SIGTERM') });
  } catch (error) { logger.error({ error }, 'Message handler failed'); }
}
