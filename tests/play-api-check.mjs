// API checks for online play + share links against tests/dev-server.mjs.
const base = process.argv[2] || 'http://localhost:8787';
let fails = 0;
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };

async function login(username, password) {
  const r = await fetch(base + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
  const c = r.headers.getSetCookie().find((x) => x.startsWith('al_session='));
  return c ? c.split(';')[0] : null;
}
const call = (cookie) => async (path, method = 'GET', body) => {
  const r = await fetch(base + path, { method, redirect: 'manual', headers: { ...(cookie ? { Cookie: cookie } : {}), 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  const text = await r.text();
  let data; try { data = JSON.parse(text); } catch { data = text; }
  return { status: r.status, data, headers: r.headers };
};

const admin = await login('admin', 'admin-pass');
ok(!!admin, 'admin logs in');
const A = call(admin);
await A('/api/admin/users', 'POST', { username: 'kim', password: 'kim-pass', role: 'teacher' });
await A('/api/admin/users', 'POST', { username: 'lee', password: 'lee-pass', role: 'teacher' });
const kim = call(await login('kim', 'kim-pass'));
const lee = call(await login('lee', 'lee-pass'));
const anon = call(null);

const game = '<!doctype html><html><head><title>Fruit</title></head><body><h1 id="t">Fruit game</h1>' +
  '<script>localStorage.setItem("score","3");document.getElementById("t").dataset.score=localStorage.getItem("score");</script></body></html>';
let r = await kim('/api/me/generated/write-now-1/vocabulary', 'PUT', { title: 'Write Now 1 Vocabulary', html: game });
ok(r.status === 200 && /^\/play\/res_/.test(r.data.playPath), 'saving a game returns its play address');
const id = r.data.resourceId;

r = await kim('/play/' + id);
ok(r.status === 200 && r.data.includes('Fruit game'), 'owner plays the game online');
ok(/sandbox allow-scripts/.test(r.headers.get('content-security-policy')) && !/allow-same-origin/.test(r.headers.get('content-security-policy')), 'game is sandboxed away from the site');
ok(r.data.indexOf("defineProperty(window,n") > -1 && r.data.indexOf('<head>') < r.data.indexOf('defineProperty'), 'storage shim injected inside <head>');
ok(r.headers.get('x-robots-tag')?.includes('noindex'), 'not indexed by search engines');

r = await lee('/play/' + id);
ok(r.status === 404, "another teacher can't open it");
r = await anon('/play/' + id);
ok(r.status === 401 && r.data.includes('Log in to play'), 'logged-out visitor is asked to log in');

r = await kim('/api/me/library');
let meta = r.data.generatedMeta['write-now-1:vocabulary'];
ok(meta && meta.playPath === '/play/' + id && meta.sharePath === null, 'library lists play address, no share link yet');

r = await lee('/api/me/share/' + id, 'POST');
ok(r.status === 404, "another teacher can't share it");
r = await kim('/api/me/share/' + id, 'POST');
ok(r.status === 200 && /^\/s\/[A-Za-z0-9_-]{20,}$/.test(r.data.sharePath) && r.data.created, 'owner makes a share link');
const share = r.data.sharePath;
r = await kim('/api/me/share/' + id, 'POST');
ok(r.data.sharePath === share && !r.data.created, 'making it again returns the same link');

r = await anon(share);
ok(r.status === 200 && r.data.includes('Fruit game') && /sandbox/.test(r.headers.get('content-security-policy')), 'anyone with the link can play (sandboxed)');
r = await kim('/api/me/library');
ok(r.data.generatedMeta['write-now-1:vocabulary'].sharePath === share, 'library shows the share link');

// regenerating keeps the same address and link
await kim('/api/me/generated/write-now-1/vocabulary', 'PUT', { title: 'Write Now 1 Vocabulary v2', html: game.replace('Fruit game', 'Fruit game v2') });
r = await anon(share);
ok(r.data.includes('Fruit game v2'), 'share link shows the regenerated game');

r = await kim('/api/me/share/' + id, 'DELETE');
ok(r.status === 200, 'owner turns the link off');
r = await anon(share);
ok(r.status === 404 && r.data.includes('turned off'), 'turned-off link stops working');
r = await anon('/s/not-a-real-token');
ok(r.status === 404, 'made-up link fails');
r = await kim('/api/me/share/' + id, 'POST');
ok(r.data.sharePath !== share, 'a new link is different from the old one');

// existing features still work
r = await kim('/api/me/breakdowns/write-now-1', 'PUT', { units: [{ title: 'Unit 1' }] });
ok(r.status === 200, 'breakdowns still save');
r = await A('/api/admin/users');
ok(r.status === 200 && r.data.users.length === 3, 'admin user list still works');
r = await kim('/api/admin/users');
ok(r.status === 403, 'teacher blocked from admin');
r = await anon('/api/me/share/' + id, 'POST');
ok(r.status === 401, 'share API needs login');

console.log(fails ? fails + ' FAILED' : 'ALL PASSED');
process.exit(fails ? 1 : 0);
