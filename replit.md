# MUSACHI-BOT

## Overview
A WhatsApp bot built with Node.js and Baileys library. This is a console-based application that connects to WhatsApp and provides various interactive features including games, economy system, and group management.

## Project Structure
```
/
├── index.js          # Main entry point - bot initialization and WhatsApp connection
├── handler.js        # Message handler for incoming WhatsApp messages
├── settings.js       # Bot configuration settings
├── lib/
│   └── database.js   # Database operations (JSON file-based)
├── plugins/          # Bot plugins (games, commands, etc.)
├── sessions/         # WhatsApp session data (auth credentials)
└── tmp/              # Temporary files
```

## Technology Stack
- **Runtime**: Node.js 20+
- **WhatsApp Library**: @whiskeysockets/baileys v6.7.x
- **Database**: JSON file-based (database.json)

## Running the Bot
The bot runs as a console application via the "Musachi Bot" workflow.

### First-time Setup
1. Start the workflow
2. Enter your WhatsApp phone number (with country code, e.g., 21653305767)
3. A pairing code will be displayed
4. Open WhatsApp on your phone > Settings > Linked Devices > Link a Device
5. Enter the pairing code

## Known Issues
- Several plugins use ES module syntax while the project is set to CommonJS
- Only 1 plugin (example-dice.js) loads successfully; others fail with import/export errors
- This is a limitation of the original project design, not Replit-specific

## Recent Changes
- 2026-01-24: Converted lib/database.js from ES modules to CommonJS
- 2026-01-24: Fixed Baileys API compatibility (removed deprecated makeInMemoryStore)
- 2026-01-24: Installed dependencies with --legacy-peer-deps for version compatibility
