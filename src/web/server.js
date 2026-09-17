import express from 'express';
import helmet from 'helmet';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from '../config/env.js';
import { state } from '../core/state.js';
import { dashboardAuth } from '../middleware/auth.js';

const root = path.dirname(fileURLToPath(import.meta.url));
export function createServer() {
  const app = express();
  app.use(helmet());
  app.use(express.json({ limit: '100kb' }));
  app.use(express.static(path.resolve(root, '../../public')));
  app.get('/api/health', (req, res) => res.json({ ok: true, name: env.BOT_NAME, version: '2.0.0', connection: state.connection, uptime: Date.now() - state.startedAt }));
  app.use('/api/admin', dashboardAuth);
  app.get('/api/admin/state', (req, res) => res.json({ ...state, qr: state.qr ? '[available]' : null }));
  return app;
}
