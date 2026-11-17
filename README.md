# Do2Nite

A Next.js app for discovering local events.

## Requirements

- Node.js 22 or later

## Getting started

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Production build

```bash
npm run build
npm start
```

## Event data

The app loads events from a Google Sheet and falls back to sample events if the sheet cannot be read. You can configure the sheet and default location with environment variables; see `src/app/sheets.ts` for the supported names and defaults. Keep API keys in your local environment and out of source control.
