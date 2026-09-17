import fs from 'node:fs';
import path from 'node:path';
import makeWASocket, { DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import QRCode from 'qrcode';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { state } from '../core/state.js';
import { handleMessage } from '../handlers/messages.js';

let socket;
let reconnectTimer;

export async function connectWhatsApp() {
  fs.mkdirSync(path.resolve(env.SESSION_DIRECTORY), { recursive: true });
  const { state: authState, saveCreds } = await useMultiFileAuthState(env.SESSION_DIRECTORY);
  const { version } = await fetchLatestBaileysVersion();
  state.connection = 'connecting';
  socket = makeWASocket({ version, auth: authState, printQRInTerminal: false, browser: ['Thunder XMD V2', 'Chrome', '2.0.0'], markOnlineOnConnect: false, syncFullHistory: false });
  socket.ev.on('creds.update', saveCreds);
  socket.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) { state.qr = await QRCode.toDataURL(qr); state.connection = 'waiting_for_authentication'; }
    if (connection === 'open') { state.connection = 'connected'; state.qr = null; state.reconnectAttempts = 0; logger.info('WhatsApp connected'); }
    if (connection === 'close' && !state.shuttingDown) {
      state.connection = 'disconnected';
      const code = lastDisconnect?.error?.output?.statusCode;
      if (code !== DisconnectReason.loggedOut) scheduleReconnect();
      else logger.warn('WhatsApp session logged out');
    }
  });
  socket.ev.on('messages.upsert', async ({ messages }) => { for (const message of messages) await handleMessage(socket, message); });
  return socket;
}

function scheduleReconnect() {
  if (reconnectTimer || state.shuttingDown) return;
  state.reconnectAttempts += 1;
  const delay = Math.min(60000, 2000 * 2 ** Math.min(state.reconnectAttempts, 5));
  state.connection = 'reconnecting';
  reconnectTimer = setTimeout(async () => { reconnectTimer = null; try { await connectWhatsApp(); } catch (error) { logger.error({ error }, 'Reconnect failed'); scheduleReconnect(); } }, delay);
}

export function getSocket() { return socket; }
export async function disconnectWhatsApp() { if (reconnectTimer) clearTimeout(reconnectTimer); if (socket) await socket.logout(); }
