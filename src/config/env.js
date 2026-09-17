import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  BOT_NAME: z.string().default('Thunder XMD V2'),
  BOT_PREFIX: z.string().min(1).default('/'),
  OWNER_NUMBER: z.string().min(5),
  OWNER_NAME: z.string().default('Lenny Muriuki'),
  PORT: z.coerce.number().int().positive().default(3000),
  HOST: z.string().default('127.0.0.1'),
  PUBLIC_URL: z.string().url().default('http://127.0.0.1:3000'),
  SESSION_DIRECTORY: z.string().default('./data/sessions'),
  DATABASE_PATH: z.string().default('./data/thunder.sqlite'),
  LOG_LEVEL: z.string().default('info'),
  DASHBOARD_USERNAME: z.string().default('admin'),
  DASHBOARD_PASSWORD: z.string().min(12),
  AI_PROVIDER: z.string().default('none'),
  AI_API_KEY: z.string().optional().default(''),
  AI_MODEL: z.string().optional().default(''),
  MAX_MEDIA_MB: z.coerce.number().positive().default(20),
  COMMAND_COOLDOWN_MS: z.coerce.number().int().nonnegative().default(1500)
});

export const env = schema.parse(process.env);
