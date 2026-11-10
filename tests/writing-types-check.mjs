// Browser checks for the writing-practice activity types (tests/dev-server.mjs must be running).
//   node tests/writing-types-check.mjs [screenshot-folder]
// Covers: Sentence Scramble, Gap Fill, Writing Card Spinner — built from a saved breakdown (no AI key)
// and from the built-in The Best Writing Starter 2 packs.
import { launch } from './cdp.mjs';
const base = 'http://localhost:8787';
const out = process.argv[2] || '/tmp/claude-0';
let fails = 0;
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = ['sentenceScramble', 'gapFill', 'writingCards'];

const login = await fetch(base + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'admin', password: 'admin-pass' }) });
const adminCookie = login.headers.getSetCookie()[0].split(';')[0];
await fetch(base + '/api/admin/users', { method: 'POST', headers: { Cookie: adminCookie, 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'kim', password: 'kim-pass', role: 'teacher' }) });

const A = await launch(9533);
const p = A.page;

async function generateFor(bookId) {
  await p.eval(`(() => {
    const b = document.getElementById('gen-book'); b.value = ${JSON.stringify(bookId)}; b.dispatchEvent(new Event('change'));
    document.getElementById('gen-api-key').value = '';
    document.querySelectorAll('.gen-activity-check').forEach(c => { c.checked = ${JSON.stringify(TYPES)}.includes(c.value); });
    document.getElementById('generate-btn').click();
  })()`);
  await p.waitFor("document.querySelectorAll('#gen-online-results li').length === 3 && !document.getElementById('generate-btn').disabled", 30000);
  const status = await p.eval("document.getElementById('generate-status').textContent");
  ok(/Saved 3 game\(s\) to your account/.test(status), bookId + ': three games saved — "' + status + '"');
  await p.eval("window.__opened = []; window.open = (u) => { window.__opened.push(u); return null; }");
  await p.eval("[...document.querySelectorAll('#gen-online-results button')].filter(b => b.textContent === 'Play online').forEach(b => b.click())");
  return p.eval('window.__opened.slice()');
}

async function checkGames(urls, label, expectText) {
  const names = ['scramble', 'gapfill', 'cards'];
  for (let i = 0; i < urls.length; i++) {
    await p.goto(urls[i]);
    await sleep(1500);
    const frame = "(document.querySelector('iframe') ? document.querySelector('iframe').contentDocument : document)";
    const text = await p.eval(frame + '.body.innerText');
    ok(text.length > 80 && !/not found|Log in to play/i.test(text), label + ' ' + names[i] + ' opens');
    if (i === 0) {
      const chips = await p.eval(frame + ".querySelectorAll('.chip').length");
      ok(chips >= 2, label + ' scramble shows word tiles (' + chips + ')');
      await p.eval(frame + ".getElementById('revealBtn').click()");
      await sleep(400);
      ok(await p.eval(frame + ".getElementById('tray').classList.contains('solved')"), label + ' scramble Reveal solves the sentence');
    }
    if (i === 1) {
      const blanks = await p.eval(frame + ".querySelectorAll('.blank').length");
      ok(blanks >= 1, label + ' gap fill shows blanks (' + blanks + ')');
      await p.eval(frame + ".querySelector('.blank').click()");
      ok(await p.eval(frame + ".querySelector('.blank').classList.contains('open')"), label + ' gap fill blank reveals on click');
    }
    if (i === 2) {
      await sleep(1500);
      const filled = await p.eval(frame + ".querySelectorAll('.blank:not(.empty)').length");
      ok(filled >= 1, label + ' card spinner fills blanks (' + filled + ')');
    }
    if (expectText && i === 0) ok(/Starter 2/.test(text), label + ' uses the built-in pack title');
    await p.screenshot(out + '/w-' + label + '-' + names[i] + '.png');
  }
}

try {
  await p.goto(base + '/');
  await p.waitFor("!document.getElementById('login-gate').hidden");
  await p.eval("document.getElementById('login-username').value='kim'; document.getElementById('login-password').value='kim-pass'; document.getElementById('login-form').requestSubmit()");
  await p.waitFor("document.getElementById('login-gate').hidden && document.getElementById('gen-book')?.options.length > 0", 15000);
  ok(await p.eval("ActivityDomain.getGeneratableTypes().filter(t => ['sentenceScramble','gapFill','writingCards'].includes(t.id)).length") === 3, 'three new types are generatable by default');

  // 1) No AI key: built from the saved breakdown's grammar examples
  await p.eval(`ActivityDomain.saveBreakdown('write-now-1', { units: [
    { title: 'Unit 1: My Room', grammar: [{ point: 'There is / There are', example: 'There is a bed in my room. / There are two lamps on the desk.' }, { point: 'in / on', example: 'My cat is on the bed.' }],
      vocabulary: [['bed','침대'],['lamp','램프'],['desk','책상'],['cat','고양이']].map(([en, ko]) => ({ en, ko })) },
    { title: 'Unit 2: My Day', grammar: [{ point: 'Simple present', example: 'I get up at 7 o\\'clock. I eat breakfast with my mom.' }],
      vocabulary: [['get up','일어나다'],['breakfast','아침']].map(([en, ko]) => ({ en, ko })) }
  ] })`);
  await p.eval("document.getElementById('tab-generate').click()");
  await sleep(300);
  ok(await p.eval("[...document.querySelectorAll('.gen-activity-check')].map(c => c.value).join(',')").then((v) => TYPES.every((t) => v.includes(t))), 'Generate tab lists the new types');
  const urls1 = await generateFor('write-now-1');
  ok(urls1.length === 3, 'breakdown: three Play online links');

  // 2) Built-in packs for The Best Writing Starter 2 (book added in the browser)
  await p.goto(base + '/');
  await p.waitFor("document.getElementById('gen-book')?.options.length > 0", 15000);
  await p.eval(`(() => { ActivityDomain.addBook({ title: 'The Best Writing Starter 2', levelIds: ['Blue'] });
    ActivityDomain.saveBreakdown('the-best-writing-starter-2', { units: [{ title: 'Unit 01: Fun at the Playground', grammar: [], vocabulary: [['slide','미끄럼틀'],['swing','그네']].map(([en, ko]) => ({ en, ko })) }] }); })()`);
  await p.goto(base + '/');
  await p.waitFor("document.getElementById('gen-book')?.options.length > 0", 15000);
  await p.eval("document.getElementById('tab-generate').click()");
  await sleep(300);
  const urls2 = await generateFor('the-best-writing-starter-2');

  await checkGames(urls1, 'breakdown', false);
  await checkGames(urls2, 'builtin', true);

  const appErrs = p.logs.filter((l) => /^EXCEPTION/.test(l));
  ok(!appErrs.length, 'no script errors' + (appErrs.length ? ': ' + appErrs.join(' | ') : ''));
} catch (e) {
  console.log('FAIL ' + e.message);
  console.log(p.logs.slice(-10).join('\n'));
  fails++;
} finally {
  A.proc.kill();
}
console.log(fails ? fails + ' FAILED' : 'ALL PASSED');
process.exit(fails ? 1 : 0);
