import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { env } from '../config/env.js';

fs.mkdirSync(path.dirname(env.DATABASE_PATH), { recursive: true });
export const db = new Database(env.DATABASE_PATH);
db.pragma('journal_mode = WAL');
db.exec(`
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS users (jid TEXT PRIMARY KEY, role TEXT NOT NULL DEFAULT 'user', created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS groups (jid TEXT PRIMARY KEY, settings TEXT NOT NULL DEFAULT '{}', updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS usage (command TEXT PRIMARY KEY, count INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS audit_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, action TEXT NOT NULL, actor TEXT, details TEXT, created_at TEXT NOT NULL);
`);

export function getSetting(key, fallback = null) {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
  return row ? row.value : fallback;
}

export function setSetting(key, value) {
  db.prepare('INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run(key, String(value));
}

export function incrementUsage(command) {
  db.prepare('INSERT INTO usage(command,count) VALUES(?,1) ON CONFLICT(command) DO UPDATE SET count=count+1').run(command);
}

export function audit(action, actor, details = {}) {
  db.prepare('INSERT INTO audit_logs(action,actor,details,created_at) VALUES(?,?,?,?,?)').run(action, actor || null, JSON.stringify(details), new Date().toISOString());
}
