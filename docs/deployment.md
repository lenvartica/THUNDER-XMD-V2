# Deployment

For persistent WhatsApp connections, use a VPS, dedicated Linux machine, Windows machine, or Termux environment that can keep Node.js running.

1. Install Node.js 20+.
2. Clone the repository.
3. Run `npm install`.
4. Create `.env`.
5. Keep `data/sessions` private and backed up securely.
6. Run `npm start`.

Do not deploy the authenticated session directory to static hosting. Static platforms are not suitable for a persistent WhatsApp socket unless a separate persistent worker is provided.
