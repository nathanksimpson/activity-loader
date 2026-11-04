/**
 * Activity Loader service Worker.
 *
 * Static files come from the assets binding. This Worker answers:
 *   /auth/*   Google sign-in, sign-out (and a local-only dev sign-in)
 *   /invite/* team invite links
 *   /api/*    account, workspaces, saved data sync, included AI, admin
 *
 * Secrets / vars (Cloudflare dashboard → Worker → Settings → Variables):
 *   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET   Google OAuth web client
 *   GEMINI_API_KEY                           key used for "Included AI"
 *   SITE_AI_MODEL       optional, default gemini-2.5-flash
 *   AI_MONTHLY_LIMIT    optional, default 50 AI requests per workspace per month
 *   ADMIN_EMAILS        comma-separated emails that see the Admin card
 *   DEV_LOGIN           "1" enables /auth/dev, and only on localhost
 *   GEMINI_API_BASE     local tests only: point Included AI at a mock server
 */

const SESSION_COOKIE = 'al_session';
const STATE_COOKIE = 'al_oauth_state';
const SESSION_DAYS = 30;
const INVITE_DAYS = 14;
const DEFAULT_AI_LIMIT = 50;
const DEFAULT_SITE_MODEL = 'gemini-2.5-flash';
const MAX_ITEM_BYTES = 1800000; // D1 rows top out near 2 MB
const SYNCED_KEYS = new Set([
  'activityLoader.curriculaOverlay.v1',
  'activityLoader.breakdowns.v1',
  'activityLoader.booksAdded.v1',
  'activityLoader.activityStyles.v1',
  'activityLoader.catalogOverlay.v1',
  'activityLoader.generatedPacks.v1',
  'activityLoader.importedTemplates.v1'
]);

class HttpError extends Error {
  constructor(status, message, extra) {
    super(message);
    this.status = status;
    this.extra = extra || {};
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    try {
      if (path.startsWith('/api/')) return await handleApi(request, env, url);
      if (path.startsWith('/auth/')) return await handleAuth(request, env, url);
      if (path.startsWith('/invite/')) return await handleInvite(request, env, url);
      return env.ASSETS.fetch(request);
    } catch (err) {
      if (err instanceof HttpError) {
        if (path.startsWith('/api/')) return json(Object.assign({ error: err.message }, err.extra), err.status);
        return htmlPage('Activity Loader', '<p>' + escapeHtml(err.message) + '</p><p><a href="/">Back to Activity Loader</a></p>', err.status);
      }
      console.error(err);
      if (path.startsWith('/api/')) return json({ error: 'Something went wrong on the server.' }, 500);
      return htmlPage('Activity Loader', '<p>Something went wrong. Please try again.</p><p><a href="/">Back</a></p>', 500);
    }
  }
};

/* ---------------- helpers ---------------- */

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function htmlPage(title, body, status) {
  const page = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>' + escapeHtml(title) + '</title><link rel="stylesheet" href="/css/app.css"></head>' +
    '<body><main class="simple-page"><div class="form-card"><h1 class="section-title">' + escapeHtml(title) + '</h1>' + body + '</div></main></body></html>';
  return new Response(page, { status: status || 200, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}

function redirect(location, cookies) {
  const headers = new Headers({ Location: location, 'Cache-Control': 'no-store' });
  (cookies || []).forEach((c) => headers.append('Set-Cookie', c));
  return new Response(null, { status: 302, headers });
}

function now() { return Date.now(); }

function randomToken(bytes) {
  const buf = new Uint8Array(bytes || 32);
  crypto.getRandomValues(buf);
  return [...buf].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function newId(prefix) { return prefix + '_' + randomToken(12); }

async function sha256(text) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function readCookie(request, name) {
  const header = request.headers.get('Cookie') || '';
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    if (part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return '';
}

function isLocalHost(url) {
  return url.hostname === 'localhost' || url.hostname === '127.0.0.1';
}

function cookie(name, value, url, maxAgeSec) {
  const secure = url.protocol === 'https:' ? '; Secure' : '';
  return name + '=' + encodeURIComponent(value) + '; Path=/; HttpOnly; SameSite=Lax' + secure + '; Max-Age=' + maxAgeSec;
}

function koreaMonth() {
  const d = new Date(Date.now() + 9 * 3600 * 1000);
  return d.toISOString().slice(0, 7);
}

function adminEmails(env) {
  return String(env.ADMIN_EMAILS || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
}

function isAdmin(env, user) {
  return !!user && adminEmails(env).includes(String(user.email).toLowerCase());
}

function siteLimit(env) {
  const n = Number(env.AI_MONTHLY_LIMIT);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : DEFAULT_AI_LIMIT;
}

async function readBody(request) {
  try { return await request.json(); } catch (e) { throw new HttpError(400, 'Request body must be JSON.'); }
}

function safeReturnPath(raw) {
  const s = String(raw || '/');
  return s.startsWith('/') && !s.startsWith('//') ? s : '/';
}

/* ---------------- sessions & users ---------------- */

async function currentUser(request, env) {
  const token = readCookie(request, SESSION_COOKIE);
  if (!token) return null;
  const hash = await sha256(token);
  const row = await env.DB.prepare(
    'SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ?'
  ).bind(hash, now()).first();
  return row || null;
}

async function requireUser(request, env) {
  const user = await currentUser(request, env);
  if (!user) throw new HttpError(401, 'Please sign in.', { signin: true });
  return user;
}

async function startSession(env, userId, url) {
  const token = randomToken(32);
  const t = now();
  await env.DB.prepare('INSERT INTO sessions (token_hash, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)')
    .bind(await sha256(token), userId, t, t + SESSION_DAYS * 86400000).run();
  return cookie(SESSION_COOKIE, token, url, SESSION_DAYS * 86400);
}

/** Find or create the user; a new user also gets their own solo workspace. */
async function upsertUser(env, profile) {
  const email = String(profile.email || '').trim().toLowerCase();
  if (!email) throw new HttpError(400, 'Google did not share an email address.');
  const t = now();
  let user = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
  if (user) {
    await env.DB.prepare('UPDATE users SET name = ?, picture = ?, last_seen = ? WHERE id = ?')
      .bind(profile.name || user.name, profile.picture || user.picture, t, user.id).run();
    return Object.assign(user, { name: profile.name || user.name, picture: profile.picture || user.picture });
  }
  const id = newId('u');
  const wsId = newId('ws');
  const name = String(profile.name || email.split('@')[0]).slice(0, 80);
  await env.DB.batch([
    env.DB.prepare('INSERT INTO users (id, email, name, picture, created_at, last_seen) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(id, email, name, profile.picture || '', t, t),
    env.DB.prepare("INSERT INTO workspaces (id, name, kind, owner_id, ai_mode, created_at) VALUES (?, ?, 'solo', ?, 'included', ?)")
      .bind(wsId, 'My workspace', id, t),
    env.DB.prepare("INSERT INTO members (workspace_id, user_id, role, joined_at) VALUES (?, ?, 'owner', ?)")
      .bind(wsId, id, t)
  ]);
  return { id, email, name, picture: profile.picture || '' };
}

/* ---------------- /auth ---------------- */

async function handleAuth(request, env, url) {
  const path = url.pathname;

  if (path === '/auth/google') {
    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
      throw new HttpError(503, 'Google sign-in is not set up on this site yet (missing GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET).');
    }
    const state = randomToken(16);
    const back = safeReturnPath(url.searchParams.get('return'));
    const google = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    google.searchParams.set('client_id', env.GOOGLE_CLIENT_ID);
    google.searchParams.set('redirect_uri', url.origin + '/auth/google/callback');
    google.searchParams.set('response_type', 'code');
    google.searchParams.set('scope', 'openid email profile');
    google.searchParams.set('state', state);
    google.searchParams.set('prompt', 'select_account');
    return redirect(google.toString(), [cookie(STATE_COOKIE, state + '|' + back, url, 600)]);
  }

  if (path === '/auth/google/callback') {
    const saved = readCookie(request, STATE_COOKIE);
    const [state, back] = saved.split('|');
    if (url.searchParams.get('error')) return redirect('/', [cookie(STATE_COOKIE, '', url, 0)]);
    if (!state || state !== url.searchParams.get('state')) {
      throw new HttpError(400, 'Sign-in expired or came from another tab. Please try again.');
    }
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: url.searchParams.get('code') || '',
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: url.origin + '/auth/google/callback',
        grant_type: 'authorization_code'
      })
    });
    if (!res.ok) throw new HttpError(400, 'Google sign-in failed. Please try again.');
    const tokens = await res.json();
    // The ID token came straight from Google's token endpoint over TLS, so its
    // claims can be read without re-checking the signature (Google's guidance).
    const claims = decodeJwtPayload(tokens.id_token);
    const validIss = claims.iss === 'https://accounts.google.com' || claims.iss === 'accounts.google.com';
    if (!validIss || claims.aud !== env.GOOGLE_CLIENT_ID || !claims.email_verified) {
      throw new HttpError(400, 'Google could not confirm this account.');
    }
    const user = await upsertUser(env, claims);
    const sessionCookie = await startSession(env, user.id, url);
    return redirect(safeReturnPath(back), [sessionCookie, cookie(STATE_COOKIE, '', url, 0)]);
  }

  if (path === '/auth/dev') {
    if (env.DEV_LOGIN !== '1' || !isLocalHost(url)) throw new HttpError(404, 'Not found.');
    const email = url.searchParams.get('email') || 'teacher@example.com';
    const user = await upsertUser(env, { email, name: url.searchParams.get('name') || email.split('@')[0] });
    return redirect(safeReturnPath(url.searchParams.get('return')), [await startSession(env, user.id, url)]);
  }

  if (path === '/auth/logout') {
    const token = readCookie(request, SESSION_COOKIE);
    if (token) await env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await sha256(token)).run();
    return redirect('/', [cookie(SESSION_COOKIE, '', url, 0)]);
  }

  throw new HttpError(404, 'Not found.');
}

function decodeJwtPayload(jwt) {
  const part = String(jwt || '').split('.')[1];
  if (!part) throw new HttpError(400, 'Google sign-in returned no ID token.');
  const b64 = part.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((part.length + 3) % 4);
  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

/* ---------------- /invite ---------------- */

async function handleInvite(request, env, url) {
  const token = url.pathname.slice('/invite/'.length);
  const invite = await env.DB.prepare(
    'SELECT i.*, w.name AS ws_name FROM invites i JOIN workspaces w ON w.id = i.workspace_id WHERE i.token = ?'
  ).bind(token).first();
  if (!invite || invite.used_at || invite.expires_at < now()) {
    return htmlPage('Invite link', '<p>This invite link has expired or was already used. Ask your team owner for a new one.</p><p><a href="/">Open Activity Loader</a></p>', 410);
  }
  const user = await currentUser(request, env);
  if (!user) {
    return htmlPage('Join ' + invite.ws_name,
      '<p>You have been invited to the team <strong>' + escapeHtml(invite.ws_name) + '</strong> on Activity Loader.</p>' +
      '<p><a class="btn btn-primary" href="/auth/google?return=' + encodeURIComponent(url.pathname) + '">Sign in with Google to join</a></p>');
  }
  if (request.method === 'POST') {
    const t = now();
    await env.DB.batch([
      env.DB.prepare("INSERT OR IGNORE INTO members (workspace_id, user_id, role, joined_at) VALUES (?, ?, 'member', ?)")
        .bind(invite.workspace_id, user.id, t),
      env.DB.prepare('UPDATE invites SET used_by = ?, used_at = ? WHERE token = ?').bind(user.id, t, token)
    ]);
    return redirect('/?workspace=' + encodeURIComponent(invite.workspace_id));
  }
  return htmlPage('Join ' + invite.ws_name,
    '<p>Signed in as <strong>' + escapeHtml(user.email) + '</strong>.</p>' +
    '<p>Join the team <strong>' + escapeHtml(invite.ws_name) + '</strong>? Its books and games will appear in your workspace list.</p>' +
    '<form method="post"><button class="btn btn-primary" type="submit">Join team</button> <a class="btn" href="/">Not now</a></form>');
}

/* ---------------- /api ---------------- */

async function handleApi(request, env, url) {
  const path = url.pathname;
  const method = request.method;

  if (path === '/api/health') return json({ ok: true });

  const user = await requireUser(request, env);

  if (path === '/api/me' && method === 'GET') return json(await mePayload(env, user));

  if (path === '/api/workspaces' && method === 'POST') {
    const body = await readBody(request);
    const name = String(body.name || '').trim().slice(0, 80);
    if (!name) throw new HttpError(400, 'Give the team a name.');
    const id = newId('ws');
    const t = now();
    await env.DB.batch([
      env.DB.prepare("INSERT INTO workspaces (id, name, kind, owner_id, ai_mode, created_at) VALUES (?, ?, 'team', ?, 'included', ?)")
        .bind(id, name, user.id, t),
      env.DB.prepare("INSERT INTO members (workspace_id, user_id, role, joined_at) VALUES (?, ?, 'owner', ?)").bind(id, user.id, t)
    ]);
    return json({ id });
  }

  let m = path.match(/^\/api\/workspaces\/([^/]+)(\/.*)?$/);
  if (m) return handleWorkspace(request, env, user, decodeURIComponent(m[1]), m[2] || '', method);

  if (path === '/api/data') {
    const ws = await requireWorkspace(request, env, user);
    if (method === 'GET') return getData(env, ws, url);
    if (method === 'POST') return postData(request, env, ws, user);
  }

  if (path === '/api/ai' && method === 'POST') {
    const ws = await requireWorkspace(request, env, user);
    return runIncludedAi(request, env, ws);
  }

  if (path.startsWith('/api/admin/')) {
    if (!isAdmin(env, user)) throw new HttpError(403, 'Admins only.');
    return handleAdmin(request, env, url, method);
  }

  throw new HttpError(404, 'Not found.');
}

async function workspaceUsage(env, wsId) {
  const row = await env.DB.prepare('SELECT calls FROM ai_usage WHERE workspace_id = ? AND month = ?').bind(wsId, koreaMonth()).first();
  return row ? row.calls : 0;
}

function describeWorkspace(env, row, used) {
  return {
    id: row.id,
    name: row.name,
    kind: row.kind,
    role: row.role,
    aiMode: row.ai_mode,
    aiLimit: row.ai_monthly_limit == null ? siteLimit(env) : row.ai_monthly_limit,
    aiUsed: used,
    siteAiReady: !!env.GEMINI_API_KEY
  };
}

async function mePayload(env, user) {
  const rows = await env.DB.prepare(
    'SELECT w.*, m.role FROM members m JOIN workspaces w ON w.id = m.workspace_id WHERE m.user_id = ? ORDER BY w.kind DESC, w.created_at'
  ).bind(user.id).all();
  const workspaces = [];
  for (const row of rows.results) workspaces.push(describeWorkspace(env, row, await workspaceUsage(env, row.id)));
  return {
    user: { id: user.id, email: user.email, name: user.name, picture: user.picture, admin: isAdmin(env, user) },
    workspaces,
    month: koreaMonth()
  };
}

async function membership(env, user, wsId) {
  return env.DB.prepare(
    'SELECT w.*, m.role FROM members m JOIN workspaces w ON w.id = m.workspace_id WHERE m.user_id = ? AND w.id = ?'
  ).bind(user.id, wsId).first();
}

async function requireWorkspace(request, env, user) {
  const wsId = request.headers.get('X-Workspace') || '';
  const ws = wsId ? await membership(env, user, wsId) : null;
  if (!ws) throw new HttpError(403, 'You are not a member of that workspace.', { workspace: true });
  return ws;
}

async function handleWorkspace(request, env, user, wsId, sub, method) {
  const ws = await membership(env, user, wsId);
  if (!ws) throw new HttpError(403, 'You are not a member of that workspace.');
  const owner = ws.role === 'owner';
  let m;

  if (sub === '' && method === 'PATCH') {
    if (!owner) throw new HttpError(403, 'Only the owner can rename this workspace.');
    const body = await readBody(request);
    const updates = [];
    const binds = [];
    if (body.name != null) {
      const name = String(body.name).trim().slice(0, 80);
      if (!name) throw new HttpError(400, 'Name cannot be empty.');
      updates.push('name = ?'); binds.push(name);
    }
    // AI mode and limits are plan settings, changed only from the Admin card.
    if (updates.length) await env.DB.prepare('UPDATE workspaces SET ' + updates.join(', ') + ' WHERE id = ?').bind(...binds, wsId).run();
    return json({ ok: true });
  }

  if (sub === '' && method === 'DELETE') {
    if (!owner || ws.kind !== 'team') throw new HttpError(403, 'Only the owner can delete a team.');
    await env.DB.prepare('DELETE FROM workspaces WHERE id = ?').bind(wsId).run();
    return json({ ok: true });
  }

  if (sub === '/members' && method === 'GET') {
    const rows = await env.DB.prepare(
      'SELECT u.id, u.email, u.name, m.role, m.joined_at FROM members m JOIN users u ON u.id = m.user_id WHERE m.workspace_id = ? ORDER BY m.role DESC, m.joined_at'
    ).bind(wsId).all();
    const invites = owner ? (await env.DB.prepare(
      'SELECT token, created_at, expires_at FROM invites WHERE workspace_id = ? AND used_at IS NULL AND expires_at > ? ORDER BY created_at DESC'
    ).bind(wsId, now()).all()).results : [];
    return json({ members: rows.results, invites, canManage: owner && ws.kind === 'team' });
  }

  if (sub === '/invites' && method === 'POST') {
    if (!owner || ws.kind !== 'team') throw new HttpError(403, 'Only a team owner can invite people.');
    const token = randomToken(18);
    const t = now();
    await env.DB.prepare('INSERT INTO invites (token, workspace_id, created_by, created_at, expires_at) VALUES (?, ?, ?, ?, ?)')
      .bind(token, wsId, user.id, t, t + INVITE_DAYS * 86400000).run();
    return json({ token, path: '/invite/' + token, expiresAt: t + INVITE_DAYS * 86400000 });
  }

  m = sub.match(/^\/invites\/([^/]+)$/);
  if (m && method === 'DELETE') {
    if (!owner) throw new HttpError(403, 'Only the owner can cancel invites.');
    await env.DB.prepare('DELETE FROM invites WHERE token = ? AND workspace_id = ?').bind(m[1], wsId).run();
    return json({ ok: true });
  }

  m = sub.match(/^\/members\/([^/]+)$/);
  if (m && method === 'DELETE') {
    const target = decodeURIComponent(m[1]);
    const leaving = target === user.id;
    if (!leaving && !owner) throw new HttpError(403, 'Only the owner can remove people.');
    if (ws.kind !== 'team') throw new HttpError(400, 'Your own workspace has no other members.');
    if (target === ws.owner_id) throw new HttpError(400, 'The owner cannot leave. Delete the team instead.');
    await env.DB.prepare('DELETE FROM members WHERE workspace_id = ? AND user_id = ?').bind(wsId, target).run();
    return json({ ok: true });
  }

  throw new HttpError(404, 'Not found.');
}

/* ---------------- data sync ---------------- */

async function getData(env, ws, url) {
  const since = Number(url.searchParams.get('since') || 0);
  const rows = since > 0
    ? await env.DB.prepare('SELECT key, item, value, version, updated_at FROM workspace_data WHERE workspace_id = ? AND updated_at >= ?').bind(ws.id, since).all()
    : await env.DB.prepare('SELECT key, item, value, version, updated_at FROM workspace_data WHERE workspace_id = ? AND value IS NOT NULL').bind(ws.id).all();
  return json({ items: rows.results, serverTime: now() });
}

/**
 * Body: { changes: [{ key, item, value (string|null), base (version the client last saw, 0 = new) }] }
 * Each change is applied only if the row is still at `base`; otherwise the
 * current row comes back in `conflicts` so the browser can merge and retry.
 */
async function postData(request, env, ws, user) {
  const body = await readBody(request);
  const changes = Array.isArray(body.changes) ? body.changes : [];
  if (changes.length > 500) throw new HttpError(400, 'Too many changes in one request.');
  const applied = [];
  const conflicts = [];
  for (const ch of changes) {
    const key = String(ch.key || '');
    const item = String(ch.item == null ? '' : ch.item);
    if (!SYNCED_KEYS.has(key) || item.length > 300) throw new HttpError(400, 'Unknown data key.');
    const value = ch.value == null ? null : String(ch.value);
    if (value != null && value.length > MAX_ITEM_BYTES) {
      throw new HttpError(413, 'One saved item is too large to store (' + Math.round(value.length / 1024) + ' KB).', { key, item });
    }
    const base = Number(ch.base) || 0;
    const t = now();
    let res;
    if (base === 0) {
      res = await env.DB.prepare(
        'INSERT INTO workspace_data (workspace_id, key, item, value, version, updated_by, updated_at) VALUES (?, ?, ?, ?, 1, ?, ?) ' +
        'ON CONFLICT (workspace_id, key, item) DO UPDATE SET value = excluded.value, version = workspace_data.version + 1, updated_by = excluded.updated_by, updated_at = excluded.updated_at ' +
        'WHERE workspace_data.value IS NULL'
      ).bind(ws.id, key, item, value, user.id, t).run();
    } else {
      res = await env.DB.prepare(
        'UPDATE workspace_data SET value = ?, version = version + 1, updated_by = ?, updated_at = ? WHERE workspace_id = ? AND key = ? AND item = ? AND version = ?'
      ).bind(value, user.id, t, ws.id, key, item, base).run();
    }
    const row = await env.DB.prepare('SELECT key, item, value, version, updated_at FROM workspace_data WHERE workspace_id = ? AND key = ? AND item = ?')
      .bind(ws.id, key, item).first();
    if (res.meta.changes > 0) applied.push({ key, item, version: row.version, updated_at: row.updated_at });
    else if (row) conflicts.push(row);
    else if (value == null) applied.push({ key, item, version: 0 });
    else conflicts.push({ key, item, value: null, version: 0 });
  }
  return json({ applied, conflicts, serverTime: now() });
}

/* ---------------- included AI ---------------- */

async function runIncludedAi(request, env, ws) {
  if (ws.ai_mode !== 'included') throw new HttpError(403, 'This workspace uses its own AI keys. Choose another provider and paste a key.');
  if (!env.GEMINI_API_KEY) throw new HttpError(503, 'Included AI is not set up on this site yet.');
  const body = await readBody(request);
  const prompt = String(body.prompt || '');
  if (!prompt) throw new HttpError(400, 'Empty prompt.');
  const parts = [{ text: prompt }];
  for (const p of Array.isArray(body.parts) ? body.parts : []) {
    if (p && p.inline_data && p.inline_data.data && p.inline_data.mime_type) {
      parts.push({ inline_data: { mime_type: String(p.inline_data.mime_type), data: String(p.inline_data.data) } });
    } else if (p && typeof p.text === 'string') {
      parts.push({ text: p.text });
    }
  }

  const limit = ws.ai_monthly_limit == null ? siteLimit(env) : ws.ai_monthly_limit;
  const month = koreaMonth();
  await env.DB.prepare('INSERT OR IGNORE INTO ai_usage (workspace_id, month, calls) VALUES (?, ?, 0)').bind(ws.id, month).run();
  const reserved = await env.DB.prepare('UPDATE ai_usage SET calls = calls + 1 WHERE workspace_id = ? AND month = ? AND calls < ?')
    .bind(ws.id, month, limit).run();
  if (!reserved.meta.changes) {
    throw new HttpError(429, 'This workspace has used all ' + limit + ' included AI requests for this month.', { limitReached: true, limit });
  }

  const model = env.SITE_AI_MODEL || DEFAULT_SITE_MODEL;
  const temperature = Number.isFinite(Number(body.temperature)) ? Number(body.temperature) : 0.2;
  let text = '';
  try {
    const base = env.GEMINI_API_BASE || 'https://generativelanguage.googleapis.com'; // override only for local tests
    const res = await fetch(base + '/v1beta/models/' + encodeURIComponent(model) + ':generateContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
      body: JSON.stringify({ contents: [{ role: 'user', parts }], generationConfig: { temperature } })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = (data && data.error && data.error.message) || ('AI request failed (' + res.status + ').');
      throw new HttpError(res.status === 400 || res.status === 413 ? 400 : 502, msg);
    }
    const cand = data.candidates && data.candidates[0];
    text = cand && cand.content && Array.isArray(cand.content.parts)
      ? cand.content.parts.map((p) => p.text || '').join('')
      : '';
    if (!text) throw new HttpError(502, 'The AI returned an empty answer. Try again.');
  } catch (err) {
    // Failed calls don't count against the month.
    await env.DB.prepare('UPDATE ai_usage SET calls = MAX(calls - 1, 0) WHERE workspace_id = ? AND month = ?').bind(ws.id, month).run();
    throw err;
  }
  const used = await workspaceUsage(env, ws.id);
  return json({ text, used, limit, model });
}

/* ---------------- admin ---------------- */

async function handleAdmin(request, env, url, method) {
  if (url.pathname === '/api/admin/workspaces' && method === 'GET') {
    const rows = await env.DB.prepare(
      'SELECT w.id, w.name, w.kind, w.ai_mode, w.ai_monthly_limit, w.created_at, u.email AS owner_email, ' +
      '(SELECT COUNT(*) FROM members m WHERE m.workspace_id = w.id) AS members, ' +
      '(SELECT calls FROM ai_usage a WHERE a.workspace_id = w.id AND a.month = ?) AS ai_used ' +
      'FROM workspaces w JOIN users u ON u.id = w.owner_id ORDER BY w.created_at DESC'
    ).bind(koreaMonth()).all();
    return json({ workspaces: rows.results, defaultLimit: siteLimit(env), month: koreaMonth() });
  }
  const m2 = url.pathname.match(/^\/api\/admin\/workspaces\/([^/]+)$/);
  if (m2 && method === 'PATCH') {
    const body = await readBody(request);
    const updates = [];
    const binds = [];
    if (body.aiMode != null) {
      if (!['included', 'byok'].includes(body.aiMode)) throw new HttpError(400, 'Unknown AI mode.');
      updates.push('ai_mode = ?'); binds.push(body.aiMode);
    }
    if ('aiLimit' in body) {
      const n = body.aiLimit === null || body.aiLimit === '' ? null : Math.max(0, Math.floor(Number(body.aiLimit)));
      if (n !== null && !Number.isFinite(n)) throw new HttpError(400, 'Limit must be a number.');
      updates.push('ai_monthly_limit = ?'); binds.push(n);
    }
    if (!updates.length) throw new HttpError(400, 'Nothing to change.');
    await env.DB.prepare('UPDATE workspaces SET ' + updates.join(', ') + ' WHERE id = ?').bind(...binds, decodeURIComponent(m2[1])).run();
    return json({ ok: true });
  }
  throw new HttpError(404, 'Not found.');
}
