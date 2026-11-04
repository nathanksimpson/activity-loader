// End-to-end browser checks against the local harness.
//   node tests/dev-server.mjs 8787 & node tests/mock-gemini.mjs &
//   node tests/browser-check.mjs [outDir]
import { launch } from './cdp.mjs';

const base = 'http://localhost:8787';
const out = process.argv[2] || '/tmp/claude-0';
let fails = 0;
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const A = await launch(9333);
const p = A.page;
try {
  // 1. Signed out: sign-in screen, app never starts
  await p.goto(base + '/');
  await p.waitFor("document.querySelector('.signin-card')");
  ok(await p.eval("!!document.querySelector('a.signin-google[href^=\"/auth/google\"]')"), 'signed-out visitor sees Google sign-in');
  await p.screenshot(out + '/01-signin.png');
  await p.screenshot(out + '/01-signin-phone.png', 390, 800);

  // 2. Legacy data saved in this browser before accounts existed
  await p.eval(`localStorage.setItem('activityLoader.breakdowns.v1', JSON.stringify({ 'write-right-1': { units: [{ title: 'Unit 1', vocabulary: [['apple','사과'],['banana','바나나'],['grape','포도'],['melon','멜론'],['peach','복숭아'],['lemon','레몬'],['cherry','체리'],['orange','오렌지'],['pear','배']].map(([en, ko]) => ({ en, ko })), grammar: ['This is a ...'] }] } }))`);

  // 3. Sign in (dev login) — the copy-old-data prompt is accepted
  p.answerDialogs(true);
  await p.goto(base + '/auth/dev?email=owner@academy.test&name=Kim%20Teacher');
  await p.waitFor("document.querySelector('.account-bar') && document.getElementById('gen-book')?.options.length > 0");
  await p.waitFor("document.querySelector('.sync-status')?.dataset.state === 'saved'");
  ok(p.dialogs.some((d) => d.includes('saved from before you signed in')), 'offered to copy data saved before sign-in');
  const srv = await p.eval("fetch('/api/data',{headers:{'X-Workspace':ActivitySync.getWorkspace().id}}).then(r=>r.json())");
  ok(srv.items.some((i) => i.key === 'activityLoader.breakdowns.v1' && i.item === 'write-right-1'), 'old browser data uploaded to the account');
  ok(await p.eval("document.querySelector('.ws-select').selectedOptions[0].text === 'My workspace'"), 'workspace switcher shows solo workspace');
  ok(await p.eval("document.querySelector('.ai-usage').textContent") === 'AI 0 / 3', 'AI usage shown');

  // 4. Included AI is the default provider and hides key/model fields
  ok(await p.eval("document.getElementById('gen-ai-provider').value") === 'site', 'Included AI selected by default');
  ok(await p.eval("document.getElementById('gen-api-key').closest('.field').hidden && document.getElementById('gen-ai-model').closest('.field').hidden"), 'key and model fields hidden for Included AI');
  await p.eval("document.getElementById('gen-ai-provider').value='openai'; document.getElementById('gen-ai-provider').dispatchEvent(new Event('change'))");
  ok(await p.eval("!document.getElementById('gen-api-key').closest('.field').hidden"), 'key field returns for own-key providers');
  await p.eval("document.getElementById('gen-ai-provider').value='site'; document.getElementById('gen-ai-provider').dispatchEvent(new Event('change'))");
  ok(await p.eval("localStorage.getItem('activityLoader.aiSettings.v1')") != null, 'AI settings stay in this browser');

  // 5. Included AI call through the app's AI client
  const aiRes = await p.eval("ActivityAI.generateJson({ provider: 'site', prompt: 'Analyze unit', imageParts: [{ inline_data: { mime_type: 'image/jpeg', data: 'AAAA' } }] })");
  ok(aiRes.ok === true && aiRes.images === 1, 'Included AI answers through the server');
  ok(await p.eval("document.querySelector('.ai-usage').textContent") === 'AI 1 / 3', 'usage counter updates');

  // 6. Generate a game from the saved breakdown; it lands in Loader and on the server
  await p.eval("ActivityDomain.saveBreakdown('write-right-1', { units: [{ title: 'Unit 1: Fruit', grammar: ['This is a ...'], vocabulary: [['apple','사과'],['banana','바나나'],['grape','포도'],['melon','멜론'],['peach','복숭아'],['lemon','레몬'],['cherry','체리'],['orange','오렌지'],['pear','배']].map(([en, ko]) => ({ en, ko })) }] })");
  await p.eval("document.getElementById('tab-generate').click()");
  await p.eval(`(() => {
    document.getElementById('gen-book').value = 'write-right-1';
    document.getElementById('gen-book').dispatchEvent(new Event('change'));
    document.querySelectorAll('.gen-activity-check').forEach(c => { c.checked = c.value === 'vocabulary'; });
    document.getElementById('generate-btn').click();
  })()`);
  await p.waitFor("Object.keys(JSON.parse(localStorage.getItem('activityLoader.generatedPacks.v1')||'{}')).length > 0", 12000);
  await p.waitFor("document.querySelector('.sync-status').dataset.state === 'saved'");
  const packs = await p.eval("fetch('/api/data',{headers:{'X-Workspace':ActivitySync.getWorkspace().id}}).then(r=>r.json()).then(d=>d.items.filter(i=>i.key==='activityLoader.generatedPacks.v1').map(i=>[i.item, i.value.length]))");
  ok(packs.length === 1 && packs[0][1] > 5000, 'generated game saved to the account (' + (packs[0] || []).join(' ') + ' chars)');

  // 7. Reload in a fresh browser profile: same data comes back from the server
  const B = await launch(9334);
  const q = B.page;
  await q.goto(base + '/auth/dev?email=owner@academy.test');
  await q.waitFor("document.querySelector('.account-bar') && document.getElementById('gen-book')?.options.length > 0");
  ok(await q.eval("!!JSON.parse(localStorage.getItem('activityLoader.generatedPacks.v1')||'{}')") &&
     await q.eval("Object.keys(JSON.parse(localStorage.getItem('activityLoader.generatedPacks.v1')||'{}')).length") === 1, 'second device loads the saved game');
  ok(!q.dialogs.length, 'no copy prompt on a clean device');
  ok(await q.eval("ActivityDomain.hasBreakdown('write-right-1')"), 'second device sees the breakdown');
  B.proc.kill();

  // 8. Make a team in the dialog, invite a teacher
  await p.eval("[...document.querySelectorAll('.account-bar button')].find(b => b.textContent === 'Teams').click()");
  await p.waitFor("document.querySelector('.sync-dialog .inline-form')");
  await p.screenshot(out + '/02-teams-dialog.png');
  await p.eval("document.querySelector('.sync-dialog .inline-form input').value = 'Simson Academy'; document.querySelector('.sync-dialog .inline-form').requestSubmit()");
  await sleep(500);
  await p.waitFor("document.querySelector('.ws-select')?.selectedOptions[0]?.text === 'Simson Academy (team)'");
  ok(true, 'new team created and opened');
  ok(await p.eval("Object.keys(JSON.parse(localStorage.getItem('activityLoader.generatedPacks.v1')||'{}')).length") === 0, 'team starts empty (solo games not shown)');
  await p.eval("ActivityDomain.saveBreakdown('write-now-1', { units: [{ title: 'Unit 1', vocabulary: [{ en: 'mom', ko: '엄마' }] }] })");
  await p.waitFor("document.querySelector('.sync-status').dataset.state === 'saved'");
  await p.eval("[...document.querySelectorAll('.account-bar button')].find(b => b.textContent === 'Team').click()");
  await p.waitFor("[...document.querySelectorAll('.sync-dialog button')].some(b => b.textContent === 'Make invite link')");
  await p.eval("[...document.querySelectorAll('.sync-dialog button')].find(b => b.textContent === 'Make invite link').click()");
  await p.waitFor("document.querySelector('.invite-box input')");
  const invite = await p.eval("document.querySelector('.invite-box input').value");
  ok(/\/invite\/[0-9a-f]+$/.test(invite), 'invite link shown');
  await p.screenshot(out + '/03-team-dialog.png');
  await p.eval("document.querySelector('.sync-dialog').close()");

  // 9. Teacher opens the invite, signs in, joins, sees the team's book
  const C = await launch(9335);
  const t = C.page;
  await t.goto(invite);
  ok(await t.eval("document.body.textContent.includes('Sign in with Google to join')"), 'invite asks a signed-out teacher to sign in');
  await t.goto(base + '/auth/dev?email=teacher@academy.test&return=' + encodeURIComponent(new URL(invite).pathname));
  await t.waitFor("document.querySelector('form button')");
  await t.eval("document.querySelector('form button').click()");
  await t.waitFor("document.querySelector('.ws-select')?.selectedOptions[0]?.text === 'Simson Academy (team)'");
  ok(await t.eval("ActivityDomain.hasBreakdown('write-now-1')"), 'teacher sees the team breakdown');

  // 10. Both edit different books at once; both edits survive
  await t.eval("ActivityDomain.saveBreakdown('early-writers-1', { units: [{ title: 'Unit 1', vocabulary: [{ en: 'me', ko: '나' }] }] })");
  await p.eval("ActivityDomain.saveBreakdown('write-now-2', { units: [{ title: 'Unit 1', vocabulary: [{ en: 'picnic', ko: '소풍' }] }] })");
  await t.waitFor("document.querySelector('.sync-status').dataset.state === 'saved'");
  await p.waitFor("document.querySelector('.sync-status').dataset.state === 'saved'");
  // owner comes back to the tab: pulls teammate's change
  await p.eval("document.dispatchEvent(new Event('visibilitychange'))");
  await p.waitFor("ActivityDomain.hasBreakdown('early-writers-1')");
  ok(true, 'owner receives teammate change on tab focus');
  await t.eval("document.dispatchEvent(new Event('visibilitychange'))");
  await t.waitFor("ActivityDomain.hasBreakdown('write-now-2')");
  ok(true, 'teacher receives owner change on tab focus');

  // 11. Both edit the SAME book overlay (catalog list) at once: merged, nothing lost
  await t.eval(`ActivityLoaderCatalog.upsertActivity({ id: 'test-a', bookId: 'write-now-1', type: 'vocabulary', title: 'Teacher game', entryHtml: 'x.html' })`);
  await p.eval(`ActivityLoaderCatalog.upsertActivity({ id: 'test-b', bookId: 'write-now-1', type: 'charades', title: 'Owner game', entryHtml: 'y.html' })`);
  await t.waitFor("document.querySelector('.sync-status').dataset.state === 'saved'");
  await p.waitFor("document.querySelector('.sync-status').dataset.state === 'saved'");
  await sleep(300);
  await t.eval("document.dispatchEvent(new Event('visibilitychange'))");
  await p.eval("document.dispatchEvent(new Event('visibilitychange'))");
  await sleep(1200);
  const ids = async (pg) => pg.eval("(JSON.parse(localStorage.getItem('activityLoader.catalogOverlay.v1')||'{}').activitiesAdded||[]).map(a=>a.id).sort().join(',')");
  const both = await ids(p);
  ok(both.includes('test-a') && both.includes('test-b'), 'simultaneous edits to the same list are merged (' + both + ')');
  ok(await ids(t) === both, 'both browsers agree after merge');

  // 12. Shared AI limit: teacher uses the team allowance
  await t.eval("ActivityAI.generateJson({ provider: 'site', prompt: 'x' })");
  await t.eval("ActivityAI.generateJson({ provider: 'site', prompt: 'x' })");
  await t.eval("ActivityAI.generateJson({ provider: 'site', prompt: 'x' })");
  let msg = '';
  try { await t.eval("ActivityAI.generateJson({ provider: 'site', prompt: 'x' })"); } catch (e) { msg = e.message; }
  ok(/used all 3 included AI requests/.test(msg) && /your own key/.test(msg), 'monthly limit message points to own key');
  ok(await t.eval("document.querySelector('.ai-usage').dataset.full") === '1', 'usage chip turns red at the limit');
  await t.screenshot(out + '/04-member-loader.png');
  await t.screenshot(out + '/04-member-phone.png', 390, 900);
  C.proc.kill();

  // 13. Admin card for the site owner
  await p.goto(base + '/auth/dev?email=nathanksimpson@gmail.com');
  await p.waitFor("document.querySelector('.account-bar') && document.getElementById('gen-book')?.options.length > 0");
  await p.eval("[...document.querySelectorAll('.account-bar button')].find(b => b.textContent === 'Admin').click()");
  await p.waitFor("document.querySelectorAll('.admin-table tbody tr').length >= 3");
  ok(true, 'admin sees all workspaces');
  await p.screenshot(out + '/05-admin.png');

  const errs = p.logs.filter((l) => /^(error|EXCEPTION)/.test(l));
  ok(!errs.length, 'no page errors' + (errs.length ? ': ' + errs.join(' | ') : ''));
} catch (e) {
  console.log('FAIL ' + e.message);
  try { console.log('generate-status: ' + await p.eval("document.getElementById('generate-status')?.textContent")); } catch (x) { /* page gone */ }
  console.log(p.logs.slice(-10).join('\n'));
  fails++;
} finally {
  A.proc.kill();
}
console.log(fails ? fails + ' FAILED' : 'ALL PASSED');
process.exit(fails ? 1 : 0);
