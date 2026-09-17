import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import sharp from 'sharp';
import { env } from '../config/env.js';

export async function imageToWebp(input) {
  const stat = await fs.stat(input);
  if (stat.size > env.MAX_MEDIA_MB * 1024 * 1024) throw new Error('Media exceeds the configured size limit.');
  const output = path.join(os.tmpdir(), `thunder-${Date.now()}.webp`);
  await sharp(input).resize({ width: 512, height: 512, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toFile(output);
  return output;
}
