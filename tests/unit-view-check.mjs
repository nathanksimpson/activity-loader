// Browser checks for the unit view (grammar + vocab per unit) and the wrong-book guard.
//   node tests/unit-view-check.mjs [screenshot-folder]   (tests/dev-server.mjs must be running)
import { launch } from './cdp.mjs';
const base = 'http://localhost:8787';
const out = process.argv[2] || '/tmp/claude-0';
let fails = 0;
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const login = await fetch(base + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'admin', password: 'admin-pass' }) });
const adminCookie = login.headers.getSetCookie()[0].split(';')[0];
await fetch(base + '/api/admin/users', { method: 'POST', headers: { Cookie: adminCookie, 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'lee', password: 'lee-pass', role: 'teacher' }) });

const A = await launch(9541);
const p = A.page;
await p.goto(base + '/');
await p.eval('window.__errors = []; window.addEventListener("error", e => window.__errors.push(String(e.message)))');
await p.waitFor("!document.getElementById('login-gate').hidden || (window.ActivityAuth && ActivityAuth.isLoggedIn())", 15000);
if (!(await p.eval("window.ActivityAuth && ActivityAuth.isLoggedIn()"))) await p.eval("document.getElementById('login-username').value='lee'; document.getElementById('login-password').value='lee-pass'; document.getElementById('login-form').requestSubmit()");
await p.waitFor("document.getElementById('login-gate').hidden && document.getElementById('gen-book')?.options.length > 0", 15000);
await p.eval("document.getElementById('onboarding-wizard').hidden = true");

const bd = {
  title: 'The Best Writing Starter 3',
  units: [
    { title: 'Unit 1: My Pet', grammar: [{ point: 'He/She + has + noun', example: 'She has a cat.' }], vocabulary: [{ en: 'cat', ko: '고양이' }, { en: 'fur', ko: '털' }] },
    { title: 'Unit 2: Jobs', grammar: [{ point: 'want to be + job', example: 'I want to be a vet.' }], vocabulary: [{ en: 'vet', ko: '수의사' }] }
  ]
};
await p.eval('ActivityDomain.saveBreakdownWithLibrary("best-writing-starter-1", ' + JSON.stringify(bd) + ').then(() => { window.__saved = 1; })');
await p.waitFor('window.__saved === 1', 8000);
const stored = await p.eval('ActivityDomain.getBreakdown("best-writing-starter-1")');
ok(stored.title === 'The Best Writing Starter 1', 'saved title follows the book card (' + stored.title + ')');
ok(stored.detectedTitle === 'The Best Writing Starter 3', 'title read off the pages is kept as detectedTitle');

await p.eval("document.getElementById('tab-curriculum').click()");
await sleep(400);
const warnText = await p.eval("[...document.querySelectorAll('.unit-warn')].map(e => e.textContent).join(' | ')");
ok(/Starter 3/.test(warnText), 'curriculum card warns about the wrong book');

// Generate is blocked while the list looks like another book.
await p.eval(`ActivityGenerate.generate({ bookId: 'best-writing-starter-1', activityId: 'jumpingOx', cefr: 'A1', mode: 'builtin' })
  .then(() => { window.__gen = 'ok'; }, (e) => { window.__gen = e.message; })`);
await p.waitFor('window.__gen', 8000);
ok(/looks like it came from The Best Writing Starter 3/.test(await p.eval('window.__gen')), 'generate refuses a wrong-book list');

// Open the unit view from the card.
await p.eval("[...document.querySelectorAll('.unit-open-btn')].find(b => b.closest('.card').querySelector('h3').textContent === 'The Best Writing Starter 1').click()");
await sleep(300);
ok(await p.eval("document.querySelector('.unit-dialog').open"), 'unit view opens');
ok(await p.eval("!document.querySelector('.unit-mismatch').hidden"), 'unit view shows the wrong-book note');
ok((await p.eval("document.querySelectorAll('.unit-select option').length")) === 2, 'unit picker lists both units');
ok((await p.eval("document.querySelectorAll('.unit-rows-vocab .unit-row').length")) === 2, 'unit 1 shows its 2 words');
await p.screenshot(out + '/unit-view.png', 1100, 820);

// Add a word, switch unit, confirm right book, save.
await p.eval("[...document.querySelectorAll('.unit-add')].find(b => b.textContent === '+ Add word').click()");
await p.eval("(() => { const i = [...document.querySelectorAll('.unit-rows-vocab .unit-en')].pop(); i.value = 'tail'; i.dispatchEvent(new Event('input')); })()");
await p.eval("document.querySelector('.unit-next').click()");
ok((await p.eval("document.querySelector('.unit-select').value")) === '1', 'next arrow moves to unit 2');
await p.eval("document.querySelector('.unit-right-book').click()");
ok(await p.eval("document.querySelector('.unit-mismatch').hidden"), 'confirming the book clears the note');
await p.eval("document.querySelector('.unit-save').click()");
await p.waitFor("/Saved/.test(document.querySelector('.unit-note').textContent)", 8000);
const after = await p.eval('ActivityDomain.getBreakdown("best-writing-starter-1")');
ok(after.units[0].vocabulary.map((w) => w.en).join(',') === 'cat,fur,tail', 'edited word saved (' + after.units[0].vocabulary.map((w) => w.en) + ')');
ok(!ActivityMismatch(after), 'saved list no longer flagged');
function ActivityMismatch(b) { return b.detectedTitle && b.detectedTitle !== 'The Best Writing Starter 1'; }
const server = await p.eval("fetch('/api/me/library', { credentials: 'include' }).then(r => r.json()).then(d => window.__lib = d)");
await p.waitFor('window.__lib', 8000);
const lib = await p.eval('window.__lib');
const sb = lib.breakdowns && lib.breakdowns['best-writing-starter-1'];
ok(sb && sb.units[0].vocabulary.length === 3, 'edit reached the cloud library');
await p.eval("document.querySelector('.unit-close').click()");
ok(!(await p.eval("document.querySelector('.unit-dialog').open")), 'unit view closes');

// Generate tab button.
await p.eval("document.getElementById('tab-generate').click(); const b = document.getElementById('gen-book'); b.value = 'best-writing-starter-1'; b.dispatchEvent(new Event('change'))");
await sleep(300);
ok(!(await p.eval("document.getElementById('gen-units-btn').hidden")), 'Generate tab shows the unit button');
await p.eval("document.getElementById('gen-units-btn').click()");
await sleep(300);
ok(await p.eval("document.querySelector('.unit-dialog').open"), 'unit view opens from Generate');
await p.eval("document.querySelector('.unit-dialog').close()");
ok((await p.eval('window.__errors.length')) === 0, 'no script errors ' + (await p.eval('window.__errors.join(" | ")')));

A.proc.kill();
console.log(fails ? fails + ' FAILED' : 'ALL PASSED');
process.exit(fails ? 1 : 0);
