# Thunder XMD V2

Thunder XMD V2 is a Node.js WhatsApp automation bot created by **Lenny Muriuki** under **Decan Techs**.

## Included

- Baileys WhatsApp connection with persisted authentication state
- QR authentication state exposed only through protected application logic
- Modular command registry and permission checks
- SQLite persistence for settings, users, groups, usage and audit logs
- Express dashboard with security headers
- AI service layer with provider configuration
- Image conversion service using Sharp
- Reconnect backoff and graceful shutdown
- Tests, lint configuration, build check and GitHub Actions

## Requirements

- Node.js 20 or newer
- A WhatsApp account you are authorized to connect
- Optional: FFmpeg for future audio/video handlers

## Installation

```bash
npm install
cp .env.example .env
```

Edit `.env` and set a strong `DASHBOARD_PASSWORD` and your own `OWNER_NUMBER`.

## Run

```bash
npm start
```

Open `http://127.0.0.1:3000` for the dashboard. The bot authentication state is handled by the WhatsApp connection module.

## Development

```bash
npm run dev
npm test
npm run lint
npm run build
```

## Security

- Never commit `.env` or `data/sessions`.
- Use only accounts and groups where you have authorization.
- Do not mass-message users or bypass platform restrictions.
- Keep the dashboard private or place it behind HTTPS and an additional access layer.
- Rotate credentials if they are exposed.

## Current command set

`/help`, `/menu`, `/ping`, `/runtime`, `/status`, `/owner`, `/about`, `/settings`, `/restart`, `/groupinfo`, `/tagall`.

Commands requiring group or owner privileges enforce those checks in the handler.

## License

MIT. See `LICENSE`.
