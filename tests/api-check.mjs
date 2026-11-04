// API checks against the local harness (node tests/dev-server.mjs). Exits non-zero on failure.
const base = process.argv[2] || 'http://localhost:8787';
let fails = 0;
const ok = (cond, msg) => { console.log((cond ? 'PASS ' : 'FAIL ') + msg); if (!cond) fails++; };

async function login(email) {
  const r = await fetch(base + '/auth/dev?email=' + encodeURIComponent(email), { redirect: 'manual' });
  const c = r.headers.getSetCookie().find((x) => x.startsWith('al_session='));
  return c.split(';')[0];
}
function client(cookie, ws) {
  return async (path, method = 'GET', body) => {
    const r = await fetch(base + path, { method, redirect: 'manual', headers: { Cookie: cookie, 'Content-Type': 'application/json', ...(ws.id ? { 'X-Workspace': ws.id } : {}) }, body: body ? JSON.stringify(body) : undefined });
    const text = await r.text();
    let data; try { data = JSON.parse(text); } catch { data = text; }
    return { status: r.status, data };
  };
}

const owner = await login('owner@academy.test');
const ownerWs = {};
const A = client(owner, ownerWs);
const me = (await A('/api/me')).data;
ok(me.workspaces.length === 1 && me.workspaces[0].kind === 'solo', 'new user gets a solo workspace');
ownerWs.id = me.workspaces[0].id;

// data: create, read, version conflict
const K = 'activityLoader.breakdowns.v1';
let r = await A('/api/data', 'POST', { changes: [{ key: K, item: 'book-a', value: '{"units":[1]}', base: 0 }] });
ok(r.data.applied.length === 1 && r.data.applied[0].version === 1, 'create item');
r = await A('/api/data', 'POST', { changes: [{ key: K, item: 'book-a', value: '{"units":[1,2]}', base: 0 }] });
ok(r.data.conflicts.length === 1 && r.data.conflicts[0].version === 1, 'second create of same item is a conflict');
r = await A('/api/data', 'POST', { changes: [{ key: K, item: 'book-a', value: '{"units":[1,2]}', base: 1 }] });
ok(r.data.applied[0]?.version === 2, 'update with right base');
r = await A('/api/data', 'POST', { changes: [{ key: 'activityLoader.geminiKey', item: '', value: 'x', base: 0 }] });
ok(r.status === 400, 'API keys can never be synced');
r = await A('/api/data', 'POST', { changes: [{ key: K, item: 'book-a', value: null, base: 2 }] });
ok(r.data.applied[0]?.version === 3, 'delete leaves a tombstone');
r = await A('/api/data');
ok(r.data.items.length === 0, 'full load skips deleted items');
r = await A('/api/data?since=1');
ok(r.data.items.length === 1 && r.data.items[0].value === null, 'incremental load reports the delete');
r = await A('/api/data', 'POST', { changes: [{ key: K, item: 'book-a', value: '{"again":1}', base: 0 }] });
ok(r.data.applied[0]?.version === 4, 'item can be re-created after delete');

// teams + invites
r = await A('/api/workspaces', 'POST', { name: 'Simson Academy' });
const team = { id: r.data.id };
const AT = client(owner, team);
r = await AT('/api/data', 'POST', { changes: [{ key: K, item: 'team-book', value: '{"t":1}', base: 0 }] });
ok(r.data.applied.length === 1, 'save into team workspace');

const teacher = await login('teacher@academy.test');
const T = client(teacher, team);
r = await T('/api/data');
ok(r.status === 403, 'non-member cannot read team data');
r = await AT('/api/workspaces/' + team.id + '/invites', 'POST');
const invitePath = r.data.path;
ok(/^\/invite\//.test(invitePath), 'owner makes invite link');
r = await fetch(base + invitePath, { headers: { Cookie: teacher } });
ok((await r.text()).includes('Join team'), 'invite page offers to join');
r = await fetch(base + invitePath, { method: 'POST', headers: { Cookie: teacher }, redirect: 'manual' });
ok(r.status === 302, 'teacher joins');
r = await fetch(base + invitePath, { headers: { Cookie: teacher } });
ok(r.status === 410, 'invite works only once');
r = await T('/api/data');
ok(r.status === 200 && r.data.items.some((i) => i.item === 'team-book'), 'member sees team data');
r = await T('/api/workspaces/' + team.id + '/invites', 'POST');
ok(r.status === 403, 'member cannot invite');
r = await T('/api/workspaces/' + team.id, 'DELETE');
ok(r.status === 403, 'member cannot delete team');
r = await T('/api/admin/workspaces');
ok(r.status === 403, 'non-admin blocked from admin');
const mem = (await AT('/api/workspaces/' + team.id + '/members')).data;
ok(mem.members.length === 2 && mem.canManage, 'owner lists 2 members');

// included AI with a limit of 3 (from .dev.vars)
for (let i = 1; i <= 3; i++) {
  r = await AT('/api/ai', 'POST', { prompt: 'Hello ' + i, parts: [{ inline_data: { mime_type: 'image/jpeg', data: 'AAAA' } }] });
  ok(r.status === 200 && r.data.used === i && /"images":1/.test(r.data.text), 'AI call ' + i + ' counted');
}
r = await T('/api/ai', 'POST', { prompt: 'one more' });
ok(r.status === 429 && r.data.limitReached, 'limit is shared by the team and enforced');
r = await A('/api/ai', 'POST', { prompt: 'solo' });
ok(r.status === 200 && r.data.used === 1, 'solo workspace has its own allowance');

// admin (nathanksimpson@gmail.com is in ADMIN_EMAILS)
const admin = await login('nathanksimpson@gmail.com');
const AD = client(admin, {});
r = await AD('/api/admin/workspaces');
ok(r.status === 200 && r.data.workspaces.length >= 3, 'admin sees all workspaces');
r = await AD('/api/admin/workspaces/' + team.id, 'PATCH', { aiMode: 'byok' });
ok(r.status === 200, 'admin switches team to own-key plan');
r = await AT('/api/ai', 'POST', { prompt: 'x' });
ok(r.status === 403, 'own-key workspace cannot use included AI');
r = await AD('/api/admin/workspaces/' + team.id, 'PATCH', { aiMode: 'included', aiLimit: 10 });
r = await AT('/api/ai', 'POST', { prompt: 'x' });
ok(r.status === 200 && r.data.limit === 10, 'admin raises the limit');
r = await AT('/api/workspaces/' + team.id, 'PATCH', { aiMode: 'byok', name: 'Simson' });
const meNow = (await AT('/api/me')).data.workspaces.find((w) => w.id === team.id);
ok(meNow.name === 'Simson' && meNow.aiMode === 'included', 'owner can rename but not change plan');

// leaving / removal
r = await T('/api/workspaces/' + team.id + '/members/' + mem.members.find((m) => m.role === 'member').id, 'DELETE');
ok(r.status === 200, 'member leaves team');
r = await T('/api/data');
ok(r.status === 403, 'former member loses access');

// sign-out kills the session
await fetch(base + '/auth/logout', { headers: { Cookie: teacher }, redirect: 'manual' });
r = await T('/api/me');
ok(r.status === 401, 'signed-out session rejected');
r = await fetch(base + '/auth/dev?email=x@y.z', { headers: { Host: 'example.com' }, redirect: 'manual' });

console.log(fails ? fails + ' FAILED' : 'ALL PASSED');
process.exit(fails ? 1 : 0);
