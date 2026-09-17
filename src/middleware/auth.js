import crypto from 'node:crypto';
import { env } from '../config/env.js';

export function dashboardAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const expected = `Basic ${Buffer.from(`${env.DASHBOARD_USERNAME}:${env.DASHBOARD_PASSWORD}`).toString('base64')}`;
  const valid = header.length === expected.length && crypto.timingSafeEqual(Buffer.from(header), Buffer.from(expected));
  if (!valid) { res.setHeader('WWW-Authenticate', 'Basic realm="Thunder XMD V2"'); return res.status(401).send('Authentication required'); }
  next();
}
