# Activity Loader

Four parts, in this order:

1. **Activity** — the game type (Jumping OX, Jeopardy, Vocab…). Same rules for every book.
2. **Curriculum** — the book (units, grammar, vocabulary, **CEFR**). Upload a PDF or photos to analyze.
3. **Generate** — mix 1 + 2 into a playable HTML file.
4. **Loader** — in class: Level → Book → Activity → Open.

## How to open (beginner)

**For playing built-in games**

1. Open this folder.
2. Double-click **`index.html`**.
3. Click **4. Loader**.
4. Leave **Green** selected.
5. Try Write Now 1 or Early Writers 1.

**For Analyze (PDF / photos) and Gemini**

Gemini is blocked if you double-click `index.html`. Use the local server:

**Easiest way**

1. Double-click **`start-app.bat`**
2. Wait for the terminal window to print the address
3. Your browser should open automatically
4. Keep the terminal window open while you use the app

**Manual way**

1. Open a terminal in this folder.
2. Run: `node serve.js`
3. Look in the terminal for the printed address, for example **http://localhost:8080** or **http://localhost:8081**
4. Keep the terminal window open while you use the app.

## Add a book or a level (Curriculum tab)

The Rainbow levels (Red, Green, Blue…) and a few books are already built in. You do **not** need to edit JSON files.

**Add a book** (example: Write Now 3)

1. Click **2. Curriculum**.
2. Under **Add a book**, type the title.
3. Pick the class level (Green, Blue, or one you added).
4. Pick a starting CEFR (you can change it later on the book card).
5. Click **Add book**. A new card appears.
6. On that card: upload PDF / photos → **Analyze** → **Save breakdown**.
7. Click **3. Generate** and make the games.
8. Click **4. Loader**, pick that level, then that book.

**Add a level** (only if it is not already in Loader)

1. Still on **2. Curriculum**, use **Add a level**.
2. Type the name exactly as you want it on the chip (example: `Gold`).
3. Choose Elementary or Middle school, pick a color, click **Add level**.
4. Then **Add a book** and choose that new level.

Added books and levels stay in **this browser** on this computer. They are not written into the project files. A **Remove** button appears only on items you added (not on built-in Rainbow books).

Write Right 1 and The Best Writing Starter 1 are already in the list — Analyze those cards instead of adding them again.

## Analyze a book (Curriculum tab)

1. Choose an AI provider and model, then paste that provider's API key (kept only in this browser).
2. Pick a book card (example: Write Right 1).
3. Upload a PDF or photos of unit pages. The app **keeps the words** and shrinks the file (text extract, or small page photos) before sending. A whole unit or whole-book PDF is OK — wait for the status line, then Analyze.
4. After you pick a PDF, read the status line (pages of text vs scanned page photos). Optional: **Download text** to paste into ChatGPT’s website.
5. Optional note: `this is Units 1–2`.
6. Click **Analyze**. A progress bar appears on the card showing the current stage (Reading PDF, Shrinking photos, Analyzing with AI) and fills as pages are processed. When the total is unknown the bar pulses to show the app is still working.
7. Click **Save breakdown**. Later pages: Analyze again, then **Add more pages**.

The PDF is not saved. Only the word and grammar list stays in this browser.

### What "Save breakdown" is for

The saved breakdown is a list of units, grammar points, and vocabulary extracted from your book. Different activity types use it differently:

| Activity | Needs saved breakdown? | Where content comes from |
|---|---|---|
| Vocabulary, Team Match, Charades | **Yes — required** | Uses the breakdown's word list directly (no AI call) |
| Quiz-Quiz-Trade, Fan-N-Pick, Find Someone Who, Showdown, RallyCoach | **Yes — required** | Uses the breakdown's word list directly (no AI call, print-first) |
| Jumping OX / Jeopardy (built-in) | No | Pre-made JSON packs in `content/` |
| Jumping OX / Jeopardy (AI mode) | Optional but recommended | AI prompt includes the full breakdown if saved; otherwise uses unit titles only |

## Generate games

1. Click **3. Generate**.
2. Tick games, or **All activities**.
3. Pick the book you just saved.
4. Content source:
   - **Built-in pack** — Write Now / Early Writers Jumping OX (and Write Now 1 Jeopardy). No internet.
   - **AI API** — builds Jumping OX / Jeopardy from your saved breakdown.
5. Vocabulary, Team Match, Charades, Quiz-Quiz-Trade, Fan-N-Pick, Find Someone Who, Showdown, and RallyCoach always use the saved word list (no second API call). The Kagan activities are print-first: open the file, pick a unit, then click **Print**.
6. Click **Generate**. Files download. **Open last result** to try one. Put downloaded HTML in the `activities/...` folder if you want Loader to open it from disk later.

The Generate tab shows a hint below the book selector telling you how many units and words are saved, and which activity types will use them.

## AI notes

- You can choose **Gemini** or **OpenAI**, plus a model for that provider.
- The app stores each provider's API key only in this browser.
- **Gemini** and **OpenAI** can both Analyze PDFs: the app extracts printed text first. Scanned books are sent as compressed page photos instead.

## Import an existing activity as a template

Use this when you already have an HTML activity and want the app to strip out the content and reuse the shell later.

1. Open **4. Loader**.
2. Open **Register an HTML file by hand**.
3. In **Import activity as template**, choose the existing `.html` file.
4. Pick the book for the sample import.
5. Click **Inspect HTML**.
6. If confidence is low, first set your AI provider/model on the app, then click **Use AI helper**.
7. Check the detected schema and target activity type.
8. Click **Save imported template**.

First version limits:
- It only imports files that can map into the current schemas:
  - `unitQuestions`
  - `unitClues`
  - `vocabByUnit`
- It saves the imported template in this browser.
- It also registers one sample activity right away so you can test it in Loader.

## Backup this browser

Books, levels, word lists, generated packs, imported templates, and settings live in **this browser**, not in the project folder. To copy them to a file:

1. Open **4. Loader**.
2. On the **Backup this browser** card, click **Download backup**.
3. Keep the JSON file somewhere safe. It can include API keys.

To put a backup back into this browser:

1. On the same card, click **Restore backup**.
2. Pick that JSON file.
3. Confirm. Matching items in this browser are overwritten.

## CEFR

Edit it on the **Curriculum** tab for each book. Generate copies that value, and you can override it for one build.

## Folder map

```text
templates/           Activity shells (no API)
content/{book}/      Curriculum packs (JSON)
activities/{level}/  Playable HTML for Loader
data/                catalogs
serve.js             Local folder server (needed for Gemini)
```

To bake HTML from built-in packs again: `node bake.js`  
To refresh offline template copies: `node embed.js`

## Online play and share links (live site)

When you're logged in on the live site, **Generate** saves each game to your account instead of downloading it. Saving HTML files to the computer is optional (tick **Also save HTML files to this computer**).

- **Play online** opens the game at its own address (`/play/…`). Only you can open it, while logged in.
- **Share link** makes a public student link (`/s/…`). Anyone with it can play in a browser without an account, on a computer, tablet or phone. **Turn off link** stops it straight away; making a new one gives a different address.
- Regenerating a game keeps the same play address and share link, so links you've already sent show the new version.
- Games run sandboxed, away from the site, so they can't see anyone's login. Inside a shared game, anything the game remembers (Charades pictures, Jeopardy edits) lasts only until the tab is closed.

## Server code and deploying

`worker/` is the Cloudflare Worker: logins, roles, groups and profiles, each account's library (D1 `activity-loader-db` + KV `activity-loader-library`), and online play (`worker/play.js`). `wrangler.jsonc` has the bindings.

Deploy from this folder:

```text
npx wrangler d1 migrations apply activity-loader-db --remote   (only when migrations/ has something new)
npx wrangler deploy
```

Or connect the repo in Cloudflare (Workers → activity-loader → Settings → Builds) with branch `main` and deploy command `npx wrangler deploy`.

### Testing locally

```text
node tests/dev-server.mjs 8787         (the site on http://localhost:8787; admin / admin-pass)
node tests/play-api-check.mjs          (server checks)
node tests/play-browser-check.mjs      (browser checks; needs Google Chrome)
```
