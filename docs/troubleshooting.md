# Troubleshooting

## Bot does not start

Check Node.js version, run `npm install`, and verify `.env` values.

## Authentication problems

Stop the bot, verify the session directory is writable, and reconnect the authorized WhatsApp account. Do not share session files.

## Dashboard unavailable

Confirm the process is running and that `HOST` and `PORT` are reachable locally.

## AI unavailable

Set a supported provider and valid API key, or leave AI disabled with `AI_PROVIDER=none`.
