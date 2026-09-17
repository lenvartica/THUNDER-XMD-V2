export const state = {
  startedAt: Date.now(),
  connection: 'disconnected',
  qr: null,
  reconnectAttempts: 0,
  shuttingDown: false
};
