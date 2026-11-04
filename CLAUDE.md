# Working on Activity Loader

See README.md for how the app works, the live site setup, and local testing.

## Shape

- The app is plain HTML/JS. Its saved data lives in `localStorage` keys starting `activityLoader.`.
- On the live site, `js/sync.js` loads the signed-in workspace's data into those keys before the app starts and sends every change to the server (`src/worker.js`, D1). The rest of the app does not know about accounts.
- Synced keys are listed in BOTH `js/sync.js` (`SYNCED_KEYS`) and `src/worker.js` (`SYNCED_KEYS`). A new saved key must be added to both, or it stays in one browser.
- API keys (`activityLoader.geminiKey`, `activityLoader.aiSettings.v1`) and UI prefs are never synced.
- Each synced key is stored one top-level entry per row, with a version. Conflicting edits are merged in the browser (`merge3` in sync.js).
- "Included AI" is the `site` provider in `js/domain.js`; `js/ai.js` sends it to `/api/ai`, which uses the server's `GEMINI_API_KEY` and the workspace's monthly limit.
- Opening `index.html` from disk or via `node serve.js` must keep working offline with no accounts.

## Rules

- Staging first (`staging` branch, `--env staging`), then production (`main`).
- Back up the live database before any change to it.
- Database changes go in `schema.sql` **and** a new `migrations/000N_*.sql`.
- Run `node tests/api-check.mjs` and `node tests/browser-check.mjs` against `tests/dev-server.mjs` before pushing.
- Plan settings (AI mode, limits) change only from the Admin card, never by workspace owners.
- Layouts must work at phone width (390px) with no horizontal scroll.
