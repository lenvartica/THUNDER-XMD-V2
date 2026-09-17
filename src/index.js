import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { state } from './core/state.js';
import { connectWhatsApp } from './connection/whatsapp.js';
import { createServer } from './web/server.js';

const app = createServer();
const server = app.listen(env.PORT, env.HOST, () => logger.info(`Dashboard listening on ${env.HOST}:${env.PORT}`));

connectWhatsApp().catch((error) => { state.connection = 'authentication_failed'; logger.error({ error }, 'Initial WhatsApp connection failed'); });

async function shutdown(signal) {
  if (state.shuttingDown) return;
  state.shuttingDown = true;
  logger.info({ signal }, 'Shutting down');
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000).unref();
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('uncaughtException', (error) => logger.error({ error }, 'Uncaught exception'));
process.on('unhandledRejection', (error) => logger.error({ error }, 'Unhandled rejection'));
