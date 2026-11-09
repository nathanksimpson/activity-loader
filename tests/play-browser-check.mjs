// Browser checks for online play + share links (tests/dev-server.mjs must be running).
import { launch } from './cdp.mjs';
const base = 'http://localhost:8787';
const out = process.argv[2] || '/tmp/claude-0';
let fails = 0;
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// teacher account
const login = await fetch(base + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'admin', password: 'admin-pass' }) });
const adminCookie = login.headers.getSetCookie()[0].split(';')[0];
await fetch(base + '/api/admin/users', { method: 'POST', headers: { Cookie: adminCookie, 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'park', password: 'park-pass', role: 'teacher' }) });

const A = await launch(9433);
const p = A.page;
try {
  await p.goto(base + '/');
  await p.waitFor("!document.getElementById('login-gate').hidden");
  ok(true, 'login screen shows');
  await p.eval("document.getElementById('login-username').value='park'; document.getElementById('login-password').value='park-pass'; document.getElementById('login-form').requestSubmit()");
  await p.waitFor("document.getElementById('login-gate').hidden && document.getElementById('gen-book')?.options.length > 0", 15000);
  ok(true, 'teacher logs in, app starts');

  // a saved word list for one book
  await p.eval("ActivityDomain.saveBreakdown('write-now-1', { units: [{ title: 'Unit 1: Fruit', grammar: ['This is a ...'], vocabulary: [['apple','사과'],['banana','바나나'],['grape','포도'],['melon','멜론'],['peach','복숭아'],['lemon','레몬'],['cherry','체리'],['orange','오렌지'],['pear','배']].map(([en, ko]) => ({ en, ko })) }] })");
  await p.eval("document.getElementById('tab-generate').click()");
  await p.waitFor("!document.getElementById('gen-online-field').hidden");
  ok(await p.eval("document.getElementById('gen-folder-field').hidden && !document.getElementById('gen-also-download').checked"), 'online by default: download off, folder picker hidden');
  await p.eval("document.getElementById('gen-also-download').click()");
  ok(await p.eval("!document.getElementById('gen-folder-field').hidden"), 'ticking "also save files" shows the folder picker');
  await p.eval("document.getElementById('gen-also-download').click()");

  await p.eval(`(() => {
    const b = document.getElementById('gen-book'); b.value = 'write-now-1'; b.dispatchEvent(new Event('change'));
    document.querySelectorAll('.gen-activity-check').forEach(c => { c.checked = c.value === 'vocabulary' || c.value === 'teamMatch'; });
    document.getElementById('generate-btn').click();
  })()`);
  await p.waitFor("document.querySelectorAll('#gen-online-results li').length === 2", 20000);
  const status = await p.eval("document.getElementById('generate-status').textContent");
  ok(/Saved 2 game\(s\) to your account/.test(status), 'status says games saved online: "' + status + '"');
  ok(await p.eval("document.querySelectorAll('#gen-online-results button').length") === 4, 'each new game has Play online + Share link');
  await p.screenshot(out + '/p1-generate-results.png');

  // Play online opens /play/<id>
  const playUrls = [];
  await p.eval("window.__opened = []; window.open = (u) => { window.__opened.push(u); return null; }");
  await p.eval("[...document.querySelectorAll('#gen-online-results button')].find(b => b.textContent === 'Play online').click()");
  const opened = await p.eval('window.__opened[0]');
  ok(/^http:\/\/localhost:8787\/play\/res_[0-9a-f]+$/.test(opened), 'Play online opens the game address');
  playUrls.push(opened);

  // Share dialog creates a link
  await p.eval("[...document.querySelectorAll('#gen-online-results button')].find(b => b.textContent === 'Share link').click()");
  await p.waitFor("document.querySelector('.share-dialog')?.open && /\\/s\\//.test(document.querySelector('.share-url').value)");
  const shareUrl = await p.eval("document.querySelector('.share-url').value");
  ok(/^http:\/\/localhost:8787\/s\/[A-Za-z0-9_-]+$/.test(shareUrl), 'share dialog shows a student link');
  await p.screenshot(out + '/p2-share-dialog.png');
  await p.screenshot(out + '/p2-share-dialog-phone.png', 390, 800);
  await p.eval("document.querySelector('.share-dialog').close()");

  // Loader card has Play online + Share link · on
  await p.eval("document.getElementById('tab-loader').click()");
  await p.eval("(() => { const l = document.getElementById('level-select'); const b = document.getElementById('book-select'); const book = ActivityLoaderCatalog.getBook('write-now-1'); if (book && book.levelId) { l.value = book.levelId; l.dispatchEvent(new Event('change')); } b.value = 'write-now-1'; b.dispatchEvent(new Event('change')); })()");
  await p.waitFor("[...document.querySelectorAll('#activity-grid button')].some(b => b.textContent === 'Play online')");
  ok(await p.eval("[...document.querySelectorAll('#activity-grid button')].some(b => b.textContent === 'Share link · on')"), 'Loader shows Play online and the link is on');
  await p.screenshot(out + '/p3-loader.png');

  // The game really runs at the student link, in a fresh browser with no login
  const B = await launch(9434);
  const s = B.page;
  await s.goto(shareUrl);
  await sleep(800);
  const runs = await s.eval("document.body.innerText.length > 50 && !/Log in|turned off/.test(document.body.innerText)");
  ok(runs, 'student link opens the game without logging in');
  ok(await s.eval("(() => { try { localStorage.setItem('x','1'); return localStorage.getItem('x') === '1'; } catch (e) { return false; } })()"), 'games can still use storage inside the sandbox');
  ok(await s.eval("fetch('/api/auth/me').then(() => 'reached').catch(() => 'blocked')") === 'blocked', 'game cannot call the site API');
  await s.screenshot(out + '/p4-student-view.png');
  await s.screenshot(out + '/p4-student-phone.png', 390, 800);
  const errs = s.logs.filter((l) => /^EXCEPTION/.test(l));
  ok(!errs.length, 'game has no script errors' + (errs.length ? ': ' + errs.join(' | ') : ''));

  // Owner play page also works in its own tab
  await p.goto(playUrls[0]);
  ok(await p.eval("document.body.innerText.length > 50 && !/Log in to play|not found/i.test(document.body.innerText)"), 'owner play page opens the game');

  // Turn off link
  await p.goto(base + '/');
  await p.waitFor("document.getElementById('gen-book')?.options.length > 0", 15000);
  await p.eval("document.getElementById('tab-loader').click()");
  await p.eval("(() => { const l = document.getElementById('level-select'); const b = document.getElementById('book-select'); const book = ActivityLoaderCatalog.getBook('write-now-1'); if (book && book.levelId) { l.value = book.levelId; l.dispatchEvent(new Event('change')); } b.value = 'write-now-1'; b.dispatchEvent(new Event('change')); })()");
  await p.waitFor("[...document.querySelectorAll('#activity-grid button')].some(b => b.textContent === 'Share link · on')", 15000);
  p.answerDialogs(true);
  await p.eval("[...document.querySelectorAll('#activity-grid button')].find(b => b.textContent === 'Share link · on').click()");
  await p.waitFor("document.querySelector('.share-dialog')?.open && !document.querySelector('.share-off').hidden");
  await p.eval("document.querySelector('.share-off').click()");
  await p.waitFor("!document.querySelector('.share-on').hidden");
  await s.goto(shareUrl);
  ok(await s.eval("/turned off/.test(document.body.innerText)"), 'after Turn off, the student link stops working');
  B.proc.kill();

  const appErrs = p.logs.filter((l) => /^(EXCEPTION)/.test(l));
  ok(!appErrs.length, 'no app errors' + (appErrs.length ? ': ' + appErrs.join(' | ') : ''));
} catch (e) {
  console.log('FAIL ' + e.message);
  console.log(p.logs.slice(-8).join('\n'));
  fails++;
} finally {
  A.proc.kill();
}
console.log(fails ? fails + ' FAILED' : 'ALL PASSED');
process.exit(fails ? 1 : 0);
