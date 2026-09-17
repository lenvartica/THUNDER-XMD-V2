# Architecture

`src/index.js` starts the HTTP server and WhatsApp connection. `connection/whatsapp.js` owns the Baileys socket and reconnect lifecycle. `handlers/messages.js` normalizes incoming messages and builds the execution context. `commands/registry.js` registers commands and enforces command-level permissions. `database/db.js` initializes SQLite persistence. `services/` contains external integrations and media processing. `web/server.js` provides the dashboard and health endpoints.
