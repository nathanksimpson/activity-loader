// Activity Loader Worker: accounts, per-user library, profiles/groups admin,
// and online play links for generated games (worker/play.js).
//
// Bindings (wrangler.jsonc): DB (D1), LIBRARY (KV), ASSETS (static files).
// Secrets: ADMIN_USERNAME, ADMIN_PASSWORD — used once to create the first
// super admin when the database has none.

import {
  PERMS,
  ASSIGNABLE_ROLES,
  normalizeRole,
  permissionsForRole,
  hasPerm,
  publicUserShape
} from './permissions.js';
import { handlePlay, handleShareApi } from './play.js';

const COOKIE_NAME = 'al_session';
const SESSION_DAYS = 30;
const PBKDF2_ITERATIONS = 1e5;
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'same-origin',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Credentials': 'true'
};

export function jsonResponse(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: Object.assign({ 'Content-Type': 'application/json; charset=utf-8' }, CORS_HEADERS, extraHeaders)
  });
}

export function errorResponse(message, status) {
  return jsonResponse({ ok: false, error: message }, status);
}

export function nowMs() {
  return Date.now();
}

function newId(prefix) {
  return prefix + '_' + crypto.randomUUID().replace(/-/g, '');
}

function bytesToB64(bytes) {
  let s = '';
  bytes.forEach((b) => {
    s += String.fromCharCode(b);
  });
  return btoa(s);
}

function b64ToBytes(b64) {
  const s = atob(b64);
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}

async function hashPassword(password, saltBytes) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(String(password)), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltBytes, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  return bytesToB64(new Uint8Array(bits));
}

async function createPasswordHash(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await hashPassword(password, salt);
  return 'pbkdf2$' + PBKDF2_ITERATIONS + '$' + bytesToB64(salt) + '$' + hash;
}

async function verifyPassword(password, stored) {
  const parts = String(stored || '').split('$');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false;
  const iterations = Number(parts[1]);
  if (!iterations) return false;
  const salt = b64ToBytes(parts[2]);
  const expected = parts[3];
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(String(password)), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, keyMaterial, 256);
  return bytesToB64(new Uint8Array(bits)) === expected;
}

function parseCookies(header) {
  const out = {};
  String(header || '').split(';').forEach((part) => {
    const idx = part.indexOf('=');
    if (idx < 0) return;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  });
  return out;
}

function sessionCookie(token, maxAgeSec) {
  return [
    COOKIE_NAME + '=' + encodeURIComponent(token),
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
    'Max-Age=' + String(maxAgeSec)
  ].join('; ');
}

export async function readJson(kv, key, fallback) {
  try {
    const raw = await kv.get(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed == null ? fallback : parsed;
  } catch (e) {
    return fallback;
  }
}

async function writeJson(kv, key, value) {
  await kv.put(key, JSON.stringify(value));
}

function overlayPatchFromBreakdown(breakdown) {
  if (!breakdown || !Array.isArray(breakdown.units)) return null;
  const patch = {
    units: breakdown.units.map((u) => String(u.title || '').trim()).filter(Boolean)
  };
  if (breakdown.cefr) patch.cefr = breakdown.cefr;
  return patch;
}

function userBreakdownKey(userId, bookId) {
  return 'user/' + userId + '/breakdowns/' + bookId;
}

function userOverlayKey(userId) {
  return 'user/' + userId + '/curriculaOverlay';
}

function userGeneratedKey(userId, bookId, activityId) {
  return 'user/' + userId + '/generated/' + bookId + ':' + activityId;
}

function resourceKvKey(resourceId) {
  return 'resource/' + resourceId;
}

function userPrefsKey(userId) {
  return 'user/' + userId + '/prefs';
}

function slugify(value) {
  return (
    String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 64) || 'profile'
  );
}

export function httpError(message, status) {
  const err = new Error(message);
  err.status = status;
  return err;
}

async function ensureAdminBootstrap(env) {
  if (!env.DB) return;
  const existing = await env.DB.prepare("SELECT id FROM users WHERE role IN ('admin', 'super_admin') LIMIT 1").first();
  if (existing) return;
  const username = String(env.ADMIN_USERNAME || '').trim();
  const password = String(env.ADMIN_PASSWORD || '').trim();
  if (!username || !password) return;
  const id = newId('usr');
  const hash = await createPasswordHash(password);
  await env.DB.prepare('INSERT INTO users (id, username, password_hash, role, active, created_at) VALUES (?, ?, ?, ?, 1, ?)')
    .bind(id, username, hash, 'super_admin', nowMs())
    .run();
}

async function listUserProfiles(env, userId, role) {
  if (hasPerm({ role, permissions: permissionsForRole(role) }, PERMS.VIEW_ALL_PROFILES)) {
    const all = await env.DB.prepare('SELECT id, name, slug FROM profiles ORDER BY name COLLATE NOCASE').all();
    return (all.results || []).map((p) => ({ id: p.id, name: p.name, slug: p.slug, accessLevel: 'editor' }));
  }
  const direct = await env.DB.prepare(
    `SELECT p.id, p.name, p.slug, pm.access_level AS access_level
     FROM profile_members pm
     JOIN profiles p ON p.id = pm.profile_id
     WHERE pm.user_id = ?`
  ).bind(userId).all();
  const viaGroup = await env.DB.prepare(
    `SELECT p.id, p.name, p.slug, pg.access_level AS access_level
     FROM group_members gm
     JOIN profile_groups pg ON pg.group_id = gm.group_id
     JOIN profiles p ON p.id = pg.profile_id
     WHERE gm.user_id = ?`
  ).bind(userId).all();
  const map = {};
  function add(row) {
    if (!row || !row.id) return;
    const level = row.access_level === 'editor' ? 'editor' : 'viewer';
    if (!map[row.id] || (level === 'editor' && map[row.id].accessLevel !== 'editor')) {
      map[row.id] = { id: row.id, name: row.name, slug: row.slug, accessLevel: level };
    }
  }
  (direct.results || []).forEach(add);
  (viaGroup.results || []).forEach(add);
  return Object.keys(map)
    .map((k) => map[k])
    .sort((a, b) => a.name.localeCompare(b.name));
}

async function userCanAccessProfile(env, user, profileId) {
  if (!profileId) return false;
  if (hasPerm(user, PERMS.VIEW_ALL_PROFILES)) return true;
  const profiles = user.profiles || (await listUserProfiles(env, user.id, user.role));
  return profiles.some((p) => p.id === profileId);
}

async function userProfileAccessLevel(env, user, profileId) {
  if (hasPerm(user, PERMS.VIEW_ALL_PROFILES)) return 'editor';
  const profiles = user.profiles || (await listUserProfiles(env, user.id, user.role));
  const hit = profiles.find((p) => p.id === profileId);
  return hit ? hit.accessLevel : null;
}

async function readUserPrefs(env, userId) {
  return readJson(env.LIBRARY, userPrefsKey(userId), {});
}

async function writeUserPrefs(env, userId, prefs) {
  await writeJson(env.LIBRARY, userPrefsKey(userId), prefs || {});
}

function resolveActiveProfileId(profiles, preferredId) {
  const list = Array.isArray(profiles) ? profiles : [];
  if (!list.length) return null;
  if (preferredId && list.some((p) => p.id === preferredId)) return preferredId;
  return list[0].id;
}

async function enrichSessionUser(env, row) {
  const role = normalizeRole(row.role);
  const profiles = await listUserProfiles(env, row.id, role);
  const user = publicUserShape(row, profiles);
  const prefs = await readUserPrefs(env, row.id);
  user.activeProfileId = resolveActiveProfileId(profiles, prefs.activeProfileId || null);
  if (user.activeProfileId && prefs.activeProfileId !== user.activeProfileId) {
    prefs.activeProfileId = user.activeProfileId;
    await writeUserPrefs(env, row.id, prefs);
  }
  return user;
}

export async function getSessionUser(request, env) {
  if (!env.DB) return null;
  await ensureAdminBootstrap(env);
  const cookies = parseCookies(request.headers.get('Cookie'));
  const token = cookies[COOKIE_NAME];
  if (!token) return null;
  const row = await env.DB.prepare(
    `SELECT s.token, s.expires_at, u.id, u.username, u.role, u.active
     FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.token = ?`
  ).bind(token).first();
  if (!row) return null;
  if (Number(row.expires_at) < nowMs()) {
    await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
    return null;
  }
  if (row.active === 0) return null;
  const user = await enrichSessionUser(env, row);
  return { token: row.token, user };
}

export function requireUser(session) {
  if (!session || !session.user) throw httpError('Please log in.', 401);
  if (session.user.active === false) throw httpError('Account deactivated.', 403);
  return session.user;
}

function requirePerm(session, perm) {
  const user = requireUser(session);
  if (!hasPerm(user, perm)) throw httpError('Not allowed.', 403);
  return user;
}

export async function readBody(request) {
  try {
    return await request.json();
  } catch (e) {
    throw httpError('Invalid JSON body.', 400);
  }
}

async function loadUserBreakdowns(env, userId) {
  const list = await env.DB.prepare(
    `SELECT id, book_id, title, forked_from_id, kv_key, updated_at
     FROM resources WHERE owner_user_id = ? AND type = 'breakdown'`
  ).bind(userId).all();
  const breakdowns = {};
  const meta = {};
  for (const row of list.results || []) {
    if (!row.book_id) continue;
    const payload = await readJson(env.LIBRARY, row.kv_key, null);
    if (payload) {
      breakdowns[row.book_id] = payload;
      meta[row.book_id] = {
        resourceId: row.id,
        title: row.title,
        forkedFromId: row.forked_from_id || null,
        updatedAt: row.updated_at,
        owned: true,
        readOnly: false
      };
    }
  }
  const overlay = await readJson(env.LIBRARY, userOverlayKey(userId), {});
  return { breakdowns, curriculaOverlay: overlay, meta };
}

async function loadUserGenerated(env, userId) {
  const list = await env.DB.prepare(
    `SELECT r.id, r.book_id, r.activity_id, r.title, r.forked_from_id, r.kv_key, r.updated_at,
            (SELECT s.token FROM share_links s WHERE s.resource_id = r.id AND s.revoked_at IS NULL
             ORDER BY s.created_at DESC LIMIT 1) AS share_token
     FROM resources r WHERE r.owner_user_id = ? AND r.type = 'generated_activity'`
  ).bind(userId).all();
  const packs = {};
  const meta = {};
  for (const row of list.results || []) {
    if (!row.book_id || !row.activity_id) continue;
    const key = row.book_id + ':' + row.activity_id;
    const payload = await readJson(env.LIBRARY, row.kv_key, null);
    if (payload) {
      packs[key] = payload;
      meta[key] = {
        resourceId: row.id,
        title: row.title,
        forkedFromId: row.forked_from_id || null,
        updatedAt: row.updated_at,
        owned: true,
        readOnly: false,
        playPath: '/play/' + row.id,
        sharePath: row.share_token ? '/s/' + row.share_token : null
      };
    }
  }
  return { packs, meta };
}

async function listAccessibleProfilePacks(env, user) {
  let profileIds;
  if (hasPerm(user, PERMS.VIEW_ALL_PROFILES)) {
    const all = await env.DB.prepare('SELECT id FROM profiles').all();
    profileIds = (all.results || []).map((r) => r.id);
  } else {
    profileIds = (user.profiles || []).map((p) => p.id);
  }
  if (!profileIds.length) return [];
  const packs = [];
  for (const profileId of profileIds) {
    const list = await env.DB.prepare(
      `SELECT r.id, r.title, r.school_id AS profile_id, r.forked_from_id, r.updated_at, r.created_at, p.name AS profile_name
       FROM resources r
       LEFT JOIN profiles p ON p.id = r.school_id
       WHERE r.type = 'profile_pack' AND r.school_id = ?
       ORDER BY r.updated_at DESC`
    ).bind(profileId).all();
    (list.results || []).forEach((row) => {
      packs.push({
        id: row.id,
        title: row.title,
        profileId: row.profile_id,
        profileName: row.profile_name || null,
        forkedFromId: row.forked_from_id || null,
        updatedAt: row.updated_at,
        createdAt: row.created_at,
        readOnly: true,
        canFork: true
      });
    });
  }
  return packs;
}

async function upsertBreakdownResource(env, user, bookId, breakdown) {
  const existing = await env.DB.prepare(
    `SELECT id, kv_key FROM resources
     WHERE owner_user_id = ? AND type = 'breakdown' AND book_id = ?`
  ).bind(user.id, bookId).first();
  const title = String((breakdown && breakdown.title) || bookId);
  const ts = nowMs();
  let resourceId;
  let kvKey;
  if (existing) {
    resourceId = existing.id;
    kvKey = existing.kv_key;
    await env.DB.prepare('UPDATE resources SET title = ?, updated_at = ? WHERE id = ?').bind(title, ts, resourceId).run();
  } else {
    resourceId = newId('res');
    kvKey = userBreakdownKey(user.id, bookId);
    await env.DB.prepare(
      `INSERT INTO resources
       (id, type, owner_user_id, school_id, title, book_id, activity_id, forked_from_id, kv_key, created_at, updated_at)
       VALUES (?, 'breakdown', ?, NULL, ?, ?, NULL, NULL, ?, ?, ?)`
    ).bind(resourceId, user.id, title, bookId, kvKey, ts, ts).run();
  }
  await writeJson(env.LIBRARY, kvKey, breakdown);
  const patch = overlayPatchFromBreakdown(breakdown);
  if (patch) {
    const overlay = await readJson(env.LIBRARY, userOverlayKey(user.id), {});
    overlay[bookId] = Object.assign({}, overlay[bookId], patch);
    await writeJson(env.LIBRARY, userOverlayKey(user.id), overlay);
  }
  return { resourceId, bookId };
}

async function upsertGeneratedResource(env, user, bookId, activityId, payload) {
  const existing = await env.DB.prepare(
    `SELECT id, kv_key FROM resources
     WHERE owner_user_id = ? AND type = 'generated_activity' AND book_id = ? AND activity_id = ?`
  ).bind(user.id, bookId, activityId).first();
  const title = String((payload && payload.title) || bookId + ' / ' + activityId);
  const ts = nowMs();
  let resourceId;
  let kvKey;
  if (existing) {
    resourceId = existing.id;
    kvKey = existing.kv_key;
    await env.DB.prepare('UPDATE resources SET title = ?, updated_at = ? WHERE id = ?').bind(title, ts, resourceId).run();
  } else {
    resourceId = newId('res');
    kvKey = userGeneratedKey(user.id, bookId, activityId);
    await env.DB.prepare(
      `INSERT INTO resources
       (id, type, owner_user_id, school_id, title, book_id, activity_id, forked_from_id, kv_key, created_at, updated_at)
       VALUES (?, 'generated_activity', ?, NULL, ?, ?, ?, NULL, ?, ?, ?)`
    ).bind(resourceId, user.id, title, bookId, activityId, kvKey, ts, ts).run();
  }
  await writeJson(env.LIBRARY, kvKey, payload);
  return { resourceId, bookId, activityId, playPath: '/play/' + resourceId };
}

export async function getResource(env, id) {
  return env.DB.prepare(
    `SELECT id, type, owner_user_id, school_id, title, book_id, activity_id, forked_from_id, kv_key, created_at, updated_at
     FROM resources WHERE id = ?`
  ).bind(id).first();
}

function canReadResource(user, row, envAccessOk) {
  if (!row) return false;
  if (row.owner_user_id && row.owner_user_id === user.id) return true;
  if ((row.type === 'profile_pack' || row.type === 'school_pack') && envAccessOk) return true;
  return false;
}

async function forkResource(env, user, sourceId, titleOverride) {
  const source = await getResource(env, sourceId);
  if (!source) throw httpError('Resource not found.', 404);
  const isPack = source.type === 'profile_pack' || source.type === 'school_pack';
  let accessOk = false;
  if (isPack) {
    accessOk = await userCanAccessProfile(env, user, source.school_id);
  }
  if (!canReadResource(user, source, accessOk)) {
    throw httpError('You cannot access this resource.', 403);
  }
  const payload = await readJson(env.LIBRARY, source.kv_key, null);
  if (!payload) throw httpError('Resource data missing.', 404);
  const ts = nowMs();
  const newResourceId = newId('res');
  const title = String(titleOverride || source.title + ' (fork)').trim();
  if (isPack) {
    const breakdowns = payload.breakdowns && typeof payload.breakdowns === 'object' ? payload.breakdowns : {};
    const overlay = payload.curriculaOverlay && typeof payload.curriculaOverlay === 'object' ? payload.curriculaOverlay : {};
    const bookIds = Object.keys(breakdowns);
    const created = [];
    for (const bookId of bookIds) {
      const bd = breakdowns[bookId];
      if (!bd || typeof bd !== 'object') continue;
      const result = await upsertBreakdownResource(
        env,
        user,
        bookId,
        Object.assign({}, bd, { savedAt: ts, source: 'fork:' + sourceId })
      );
      await env.DB.prepare('UPDATE resources SET forked_from_id = ? WHERE id = ?').bind(sourceId, result.resourceId).run();
      created.push(result);
    }
    if (Object.keys(overlay).length) {
      const current = await readJson(env.LIBRARY, userOverlayKey(user.id), {});
      Object.keys(overlay).forEach((bookId) => {
        current[bookId] = Object.assign({}, current[bookId], overlay[bookId]);
      });
      await writeJson(env.LIBRARY, userOverlayKey(user.id), current);
    }
    const packKv = resourceKvKey(newResourceId);
    await writeJson(env.LIBRARY, packKv, { kind: 'profile_pack_fork', from: sourceId, bookIds, forkedAt: ts });
    await env.DB.prepare(
      `INSERT INTO resources
       (id, type, owner_user_id, school_id, title, book_id, activity_id, forked_from_id, kv_key, created_at, updated_at)
       VALUES (?, 'curricula', ?, NULL, ?, NULL, NULL, ?, ?, ?, ?)`
    ).bind(newResourceId, user.id, title, sourceId, packKv, ts, ts).run();
    return { resourceId: newResourceId, type: 'profile_pack_fork', createdBreakdowns: created.length };
  }
  const targetType = source.type;
  let kvKey;
  if (targetType === 'breakdown' && source.book_id) {
    kvKey = userBreakdownKey(user.id, source.book_id);
  } else if (targetType === 'generated_activity' && source.book_id && source.activity_id) {
    kvKey = userGeneratedKey(user.id, source.book_id, source.activity_id);
  } else {
    kvKey = resourceKvKey(newResourceId);
  }
  if (targetType === 'breakdown' && source.book_id) {
    const existing = await env.DB.prepare(
      `SELECT id FROM resources WHERE owner_user_id = ? AND type = 'breakdown' AND book_id = ?`
    ).bind(user.id, source.book_id).first();
    if (existing) await env.DB.prepare('DELETE FROM resources WHERE id = ?').bind(existing.id).run();
  }
  if (targetType === 'generated_activity' && source.book_id && source.activity_id) {
    const existing = await env.DB.prepare(
      `SELECT id FROM resources
       WHERE owner_user_id = ? AND type = 'generated_activity' AND book_id = ? AND activity_id = ?`
    ).bind(user.id, source.book_id, source.activity_id).first();
    if (existing) await env.DB.prepare('DELETE FROM resources WHERE id = ?').bind(existing.id).run();
  }
  const forkedPayload = Object.assign({}, payload, { savedAt: ts, source: 'fork:' + sourceId });
  await writeJson(env.LIBRARY, kvKey, forkedPayload);
  await env.DB.prepare(
    `INSERT INTO resources
     (id, type, owner_user_id, school_id, title, book_id, activity_id, forked_from_id, kv_key, created_at, updated_at)
     VALUES (?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    newResourceId,
    targetType,
    user.id,
    title,
    source.book_id || null,
    source.activity_id || null,
    sourceId,
    kvKey,
    ts,
    ts
  ).run();
  if (targetType === 'breakdown' && source.book_id) {
    const patch = overlayPatchFromBreakdown(forkedPayload);
    if (patch) {
      const overlay = await readJson(env.LIBRARY, userOverlayKey(user.id), {});
      overlay[source.book_id] = Object.assign({}, overlay[source.book_id], patch);
      await writeJson(env.LIBRARY, userOverlayKey(user.id), overlay);
    }
  }
  return { resourceId: newResourceId, type: targetType, bookId: source.book_id, activityId: source.activity_id };
}

async function handleApi(request, env, url) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (!env.LIBRARY) return errorResponse('Library storage is not configured.', 503);
  if (!env.DB) return errorResponse('Database is not configured.', 503);
  await ensureAdminBootstrap(env);
  const path = url.pathname;
  const session = await getSessionUser(request, env);

  if (request.method === 'GET' && path === '/api/health') {
    const adminCount = await env.DB.prepare(
      "SELECT COUNT(*) AS c FROM users WHERE role IN ('admin', 'super_admin') AND active = 1"
    ).first();
    return jsonResponse({
      ok: true,
      library: true,
      auth: true,
      profiles: true,
      playLinks: true,
      loggedIn: !!(session && session.user),
      adminReady: Number(adminCount && adminCount.c) > 0
    });
  }

  if (request.method === 'POST' && path === '/api/auth/login') {
    const body = await readBody(request);
    const username = String(body.username || '').trim();
    const password = String(body.password || '');
    if (!username || !password) return errorResponse('Username and password required.', 400);
    const row = await env.DB.prepare(
      'SELECT id, username, password_hash, role, active FROM users WHERE username = ? COLLATE NOCASE'
    ).bind(username).first();
    if (!row || !(await verifyPassword(password, row.password_hash))) {
      return errorResponse('Wrong username or password.', 401);
    }
    if (row.active === 0) return errorResponse('Account deactivated.', 403);
    const token = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');
    const expires = nowMs() + SESSION_DAYS * 24 * 60 * 60 * 1e3;
    await env.DB.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)').bind(token, row.id, expires).run();
    const user = await enrichSessionUser(env, row);
    return jsonResponse({ ok: true, user }, 200, { 'Set-Cookie': sessionCookie(token, SESSION_DAYS * 24 * 60 * 60) });
  }

  if (request.method === 'POST' && path === '/api/auth/logout') {
    if (session && session.token) {
      await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(session.token).run();
    }
    return jsonResponse({ ok: true }, 200, { 'Set-Cookie': sessionCookie('', 0) });
  }

  if (request.method === 'GET' && path === '/api/auth/me') {
    if (!session || !session.user) return errorResponse('Not logged in.', 401);
    return jsonResponse({ ok: true, user: session.user, assignableRoles: ASSIGNABLE_ROLES });
  }

  if (request.method === 'PUT' && path === '/api/me/active-profile') {
    const user = requireUser(session);
    const body = await readBody(request);
    const profileId = body.profileId == null ? null : String(body.profileId).trim();
    if (!profileId) return errorResponse('profileId required.', 400);
    if (!(await userCanAccessProfile(env, user, profileId))) {
      return errorResponse('You cannot open that profile.', 403);
    }
    const prefs = await readUserPrefs(env, user.id);
    prefs.activeProfileId = profileId;
    await writeUserPrefs(env, user.id, prefs);
    user.activeProfileId = profileId;
    return jsonResponse({ ok: true, activeProfileId: profileId, user });
  }

  const meProfileMatch = path.match(/^\/api\/me\/profiles\/([^/]+)$/);
  if (meProfileMatch && request.method === 'PATCH') {
    const user = requireUser(session);
    const id = decodeURIComponent(meProfileMatch[1]);
    const level = await userProfileAccessLevel(env, user, id);
    const canEdit = level === 'editor' || hasPerm(user, PERMS.MANAGE_PROFILE_ACCESS);
    if (!canEdit) return errorResponse('Not allowed to edit this profile.', 403);
    const existing = await env.DB.prepare('SELECT id, name, slug FROM profiles WHERE id = ?').bind(id).first();
    if (!existing) return errorResponse('Profile not found.', 404);
    const body = await readBody(request);
    const name = body.name != null ? String(body.name).trim() : existing.name;
    const slug = body.slug != null ? slugify(body.slug) : existing.slug;
    if (!name) return errorResponse('Profile name required.', 400);
    try {
      await env.DB.prepare('UPDATE profiles SET name = ?, slug = ? WHERE id = ?').bind(name, slug, id).run();
    } catch (e) {
      return errorResponse('Could not update profile (slug may already exist).', 409);
    }
    return jsonResponse({ ok: true, profile: { id, name, slug } });
  }

  if (path === '/api/admin/users' && request.method === 'GET') {
    requirePerm(session, PERMS.MANAGE_USERS);
    const rows = await env.DB.prepare('SELECT id, username, role, active, created_at FROM users ORDER BY username COLLATE NOCASE').all();
    const users = [];
    for (const r of rows.results || []) {
      const profiles = await listUserProfiles(env, r.id, r.role);
      users.push({
        id: r.id,
        username: r.username,
        role: normalizeRole(r.role),
        active: r.active !== 0,
        createdAt: r.created_at,
        profiles
      });
    }
    return jsonResponse({ ok: true, users, assignableRoles: ASSIGNABLE_ROLES });
  }

  if (path === '/api/admin/users' && request.method === 'POST') {
    requirePerm(session, PERMS.MANAGE_USERS);
    const body = await readBody(request);
    const username = String(body.username || '').trim();
    const password = String(body.password || '');
    let role = normalizeRole(body.role || 'teacher');
    if (ASSIGNABLE_ROLES.indexOf(role) < 0) role = 'teacher';
    if (!hasPerm(session.user, PERMS.MANAGE_USERS)) throw httpError('Not allowed.', 403);
    if (role === 'super_admin' && normalizeRole(session.user.role) !== 'super_admin') {
      return errorResponse('Only a super admin can create another super admin.', 403);
    }
    if (!username || !password) return errorResponse('Username and password required.', 400);
    if (password.length < 6) return errorResponse('Password must be at least 6 characters.', 400);
    const id = newId('usr');
    const hash = await createPasswordHash(password);
    try {
      await env.DB.prepare('INSERT INTO users (id, username, password_hash, role, active, created_at) VALUES (?, ?, ?, ?, 1, ?)')
        .bind(id, username, hash, role, nowMs())
        .run();
    } catch (e) {
      return errorResponse('Username already taken.', 409);
    }
    const profileIds = Array.isArray(body.profileIds) ? body.profileIds : [];
    for (const pid of profileIds) {
      await env.DB.prepare(
        `INSERT OR IGNORE INTO profile_members (profile_id, user_id, access_level, granted_at, granted_by_user_id)
         VALUES (?, ?, 'viewer', ?, ?)`
      ).bind(String(pid), id, nowMs(), session.user.id).run();
    }
    return jsonResponse({ ok: true, user: { id, username, role } });
  }

  const userMatch = path.match(/^\/api\/admin\/users\/([^/]+)$/);
  if (userMatch && request.method === 'PATCH') {
    requirePerm(session, PERMS.MANAGE_USERS);
    const id = decodeURIComponent(userMatch[1]);
    const body = await readBody(request);
    const existing = await env.DB.prepare('SELECT id, username, role, active FROM users WHERE id = ?').bind(id).first();
    if (!existing) return errorResponse('User not found.', 404);
    let role = existing.role;
    if (body.role != null) {
      role = normalizeRole(body.role);
      if (ASSIGNABLE_ROLES.indexOf(role) < 0) return errorResponse('Invalid role.', 400);
      if (role === 'super_admin' && normalizeRole(session.user.role) !== 'super_admin') {
        return errorResponse('Only a super admin can assign super admin.', 403);
      }
    }
    let active = existing.active;
    if (body.active != null) active = body.active ? 1 : 0;
    if (body.password) {
      if (String(body.password).length < 6) {
        return errorResponse('Password must be at least 6 characters.', 400);
      }
      const hash = await createPasswordHash(body.password);
      await env.DB.prepare('UPDATE users SET password_hash = ?, role = ?, active = ? WHERE id = ?').bind(hash, role, active, id).run();
    } else {
      await env.DB.prepare('UPDATE users SET role = ?, active = ? WHERE id = ?').bind(role, active, id).run();
    }
    if (active === 0) {
      await env.DB.prepare('DELETE FROM sessions WHERE user_id = ?').bind(id).run();
    }
    return jsonResponse({ ok: true, user: { id, username: existing.username, role: normalizeRole(role), active: !!active } });
  }

  if (userMatch && request.method === 'DELETE') {
    const admin = requirePerm(session, PERMS.MANAGE_USERS);
    const id = decodeURIComponent(userMatch[1]);
    if (id === admin.id) return errorResponse('You cannot delete your own account.', 400);
    await env.DB.prepare('DELETE FROM users WHERE id = ?').bind(id).run();
    return jsonResponse({ ok: true });
  }

  if (path === '/api/admin/groups' && request.method === 'GET') {
    requirePerm(session, PERMS.MANAGE_GROUPS);
    const groups = await env.DB.prepare(
      'SELECT id, name, created_at, created_by_user_id FROM teacher_groups ORDER BY name COLLATE NOCASE'
    ).all();
    const out = [];
    for (const g of groups.results || []) {
      const members = await env.DB.prepare(
        `SELECT u.id, u.username FROM group_members gm
         JOIN users u ON u.id = gm.user_id WHERE gm.group_id = ?
         ORDER BY u.username COLLATE NOCASE`
      ).bind(g.id).all();
      out.push({
        id: g.id,
        name: g.name,
        createdAt: g.created_at,
        members: (members.results || []).map((m) => ({ id: m.id, username: m.username }))
      });
    }
    return jsonResponse({ ok: true, groups: out });
  }

  if (path === '/api/admin/groups' && request.method === 'POST') {
    const actor = requirePerm(session, PERMS.MANAGE_GROUPS);
    const body = await readBody(request);
    const name = String(body.name || '').trim();
    if (!name) return errorResponse('Group name required.', 400);
    const id = newId('grp');
    await env.DB.prepare('INSERT INTO teacher_groups (id, name, created_at, created_by_user_id) VALUES (?, ?, ?, ?)')
      .bind(id, name, nowMs(), actor.id)
      .run();
    return jsonResponse({ ok: true, group: { id, name } });
  }

  const groupMatch = path.match(/^\/api\/admin\/groups\/([^/]+)$/);
  if (groupMatch && request.method === 'PATCH') {
    requirePerm(session, PERMS.MANAGE_GROUPS);
    const id = decodeURIComponent(groupMatch[1]);
    const body = await readBody(request);
    const name = String(body.name || '').trim();
    if (!name) return errorResponse('Group name required.', 400);
    await env.DB.prepare('UPDATE teacher_groups SET name = ? WHERE id = ?').bind(name, id).run();
    return jsonResponse({ ok: true, group: { id, name } });
  }

  if (groupMatch && request.method === 'DELETE') {
    requirePerm(session, PERMS.MANAGE_GROUPS);
    const id = decodeURIComponent(groupMatch[1]);
    await env.DB.prepare('DELETE FROM profile_groups WHERE group_id = ?').bind(id).run();
    await env.DB.prepare('DELETE FROM group_members WHERE group_id = ?').bind(id).run();
    await env.DB.prepare('DELETE FROM teacher_groups WHERE id = ?').bind(id).run();
    return jsonResponse({ ok: true });
  }

  const groupMembersMatch = path.match(/^\/api\/admin\/groups\/([^/]+)\/members$/);
  if (groupMembersMatch && request.method === 'PUT') {
    requirePerm(session, PERMS.MANAGE_GROUPS);
    const id = decodeURIComponent(groupMembersMatch[1]);
    const body = await readBody(request);
    const userIds = Array.isArray(body.userIds) ? body.userIds.map(String) : [];
    await env.DB.prepare('DELETE FROM group_members WHERE group_id = ?').bind(id).run();
    for (const uid of userIds) {
      await env.DB.prepare('INSERT OR IGNORE INTO group_members (group_id, user_id) VALUES (?, ?)').bind(id, uid).run();
    }
    return jsonResponse({ ok: true, saved: userIds.length });
  }

  if (path === '/api/admin/profiles' && request.method === 'GET') {
    requirePerm(session, PERMS.ACCESS_ADMIN_PAGE);
    const rows = await env.DB.prepare(
      'SELECT id, name, slug, created_at, created_by_user_id FROM profiles ORDER BY name COLLATE NOCASE'
    ).all();
    return jsonResponse({ ok: true, profiles: rows.results || [] });
  }

  if (path === '/api/admin/profiles' && request.method === 'POST') {
    const actor = requirePerm(session, PERMS.MANAGE_PROFILE_ACCESS);
    const body = await readBody(request);
    const name = String(body.name || '').trim();
    if (!name) return errorResponse('Profile name required.', 400);
    let slug = String(body.slug || '').trim() || slugify(name);
    slug = slugify(slug);
    const id = newId('prf');
    try {
      await env.DB.prepare('INSERT INTO profiles (id, name, slug, created_at, created_by_user_id) VALUES (?, ?, ?, ?, ?)')
        .bind(id, name, slug, nowMs(), actor.id)
        .run();
    } catch (e) {
      return errorResponse('Could not create profile (slug may already exist).', 409);
    }
    return jsonResponse({ ok: true, profile: { id, name, slug } });
  }

  const profileMatch = path.match(/^\/api\/admin\/profiles\/([^/]+)$/);
  if (profileMatch && request.method === 'PATCH') {
    requirePerm(session, PERMS.MANAGE_PROFILE_ACCESS);
    const id = decodeURIComponent(profileMatch[1]);
    const body = await readBody(request);
    const existing = await env.DB.prepare('SELECT id, name, slug FROM profiles WHERE id = ?').bind(id).first();
    if (!existing) return errorResponse('Profile not found.', 404);
    const name = body.name != null ? String(body.name).trim() : existing.name;
    const slug = body.slug != null ? slugify(body.slug) : existing.slug;
    if (!name) return errorResponse('Profile name required.', 400);
    try {
      await env.DB.prepare('UPDATE profiles SET name = ?, slug = ? WHERE id = ?').bind(name, slug, id).run();
    } catch (e) {
      return errorResponse('Could not update profile.', 409);
    }
    return jsonResponse({ ok: true, profile: { id, name, slug } });
  }

  if (profileMatch && request.method === 'DELETE') {
    requirePerm(session, PERMS.MANAGE_PROFILE_ACCESS);
    const id = decodeURIComponent(profileMatch[1]);
    await env.DB.prepare('DELETE FROM profile_members WHERE profile_id = ?').bind(id).run();
    await env.DB.prepare('DELETE FROM profile_groups WHERE profile_id = ?').bind(id).run();
    await env.DB.prepare("UPDATE resources SET school_id = NULL WHERE type = 'profile_pack' AND school_id = ?").bind(id).run();
    await env.DB.prepare('DELETE FROM profiles WHERE id = ?').bind(id).run();
    return jsonResponse({ ok: true });
  }

  const profileAccessMatch = path.match(/^\/api\/admin\/profiles\/([^/]+)\/access$/);
  if (profileAccessMatch && request.method === 'GET') {
    requirePerm(session, PERMS.MANAGE_PROFILE_ACCESS);
    const id = decodeURIComponent(profileAccessMatch[1]);
    const users = await env.DB.prepare(
      `SELECT pm.user_id AS id, u.username, pm.access_level
       FROM profile_members pm JOIN users u ON u.id = pm.user_id
       WHERE pm.profile_id = ? ORDER BY u.username COLLATE NOCASE`
    ).bind(id).all();
    const groups = await env.DB.prepare(
      `SELECT pg.group_id AS id, g.name, pg.access_level
       FROM profile_groups pg JOIN teacher_groups g ON g.id = pg.group_id
       WHERE pg.profile_id = ? ORDER BY g.name COLLATE NOCASE`
    ).bind(id).all();
    return jsonResponse({ ok: true, users: users.results || [], groups: groups.results || [] });
  }

  if (profileAccessMatch && request.method === 'PUT') {
    const actor = requirePerm(session, PERMS.MANAGE_PROFILE_ACCESS);
    const id = decodeURIComponent(profileAccessMatch[1]);
    const body = await readBody(request);
    const users = Array.isArray(body.users) ? body.users : [];
    const groups = Array.isArray(body.groups) ? body.groups : [];
    const ts = nowMs();
    await env.DB.prepare('DELETE FROM profile_members WHERE profile_id = ?').bind(id).run();
    await env.DB.prepare('DELETE FROM profile_groups WHERE profile_id = ?').bind(id).run();
    for (const u of users) {
      if (!u || !u.id) continue;
      const level = u.accessLevel === 'editor' ? 'editor' : 'viewer';
      await env.DB.prepare(
        `INSERT INTO profile_members (profile_id, user_id, access_level, granted_at, granted_by_user_id)
         VALUES (?, ?, ?, ?, ?)`
      ).bind(id, String(u.id), level, ts, actor.id).run();
    }
    for (const g of groups) {
      if (!g || !g.id) continue;
      const level = g.accessLevel === 'editor' ? 'editor' : 'viewer';
      await env.DB.prepare(
        `INSERT INTO profile_groups (profile_id, group_id, access_level, granted_at, granted_by_user_id)
         VALUES (?, ?, ?, ?, ?)`
      ).bind(id, String(g.id), level, ts, actor.id).run();
    }
    return jsonResponse({ ok: true });
  }

  if (path === '/api/admin/profile-packs' && request.method === 'POST') {
    const actor = requireUser(session);
    const body = await readBody(request);
    const profileId = String(body.profileId || '').trim();
    const title = String(body.title || '').trim();
    if (!profileId || !title) return errorResponse('profileId and title required.', 400);
    const profile = await env.DB.prepare('SELECT id, name FROM profiles WHERE id = ?').bind(profileId).first();
    if (!profile) return errorResponse('Profile not found.', 404);
    const level = await userProfileAccessLevel(env, actor, profileId);
    const canPublish = hasPerm(actor, PERMS.PUBLISH_PROFILE_PACKS) || level === 'editor';
    if (!canPublish) return errorResponse('Not allowed to publish packs to this profile.', 403);
    const payload = {
      breakdowns: (body.payload && body.payload.breakdowns) || body.breakdowns || {},
      curriculaOverlay: (body.payload && body.payload.curriculaOverlay) || body.curriculaOverlay || {}
    };
    const id = newId('res');
    const kvKey = resourceKvKey(id);
    const ts = nowMs();
    await writeJson(env.LIBRARY, kvKey, payload);
    await env.DB.prepare(
      `INSERT INTO resources
       (id, type, owner_user_id, school_id, title, book_id, activity_id, forked_from_id, kv_key, created_at, updated_at)
       VALUES (?, 'profile_pack', NULL, ?, ?, NULL, NULL, NULL, ?, ?, ?)`
    ).bind(id, profileId, title, kvKey, ts, ts).run();
    return jsonResponse({ ok: true, resource: { id, title, profileId, type: 'profile_pack' } });
  }

  const packMatch = path.match(/^\/api\/admin\/profile-packs\/([^/]+)$/);
  if (packMatch && request.method === 'DELETE') {
    requirePerm(session, PERMS.MANAGE_PROFILE_ACCESS);
    const id = decodeURIComponent(packMatch[1]);
    const row = await getResource(env, id);
    if (!row || (row.type !== 'profile_pack' && row.type !== 'school_pack')) {
      return errorResponse('Profile pack not found.', 404);
    }
    await env.LIBRARY.delete(row.kv_key);
    await env.DB.prepare('DELETE FROM resources WHERE id = ?').bind(id).run();
    return jsonResponse({ ok: true });
  }

  if (path.startsWith('/api/admin/schools') || path.startsWith('/api/admin/school-packs')) {
    return errorResponse('Use /api/admin/profiles and /api/admin/profile-packs (CCMU-style).', 410);
  }

  if (path === '/api/me/library' && request.method === 'GET') {
    const user = requireUser(session);
    const lib = await loadUserBreakdowns(env, user.id);
    const gen = await loadUserGenerated(env, user.id);
    const profilePacks = await listAccessibleProfilePacks(env, user);
    return jsonResponse({
      ok: true,
      user,
      breakdowns: lib.breakdowns,
      curriculaOverlay: lib.curriculaOverlay,
      breakdownMeta: lib.meta,
      generatedPacks: gen.packs,
      generatedMeta: gen.meta,
      profilePacks,
      schoolPacks: profilePacks
    });
  }

  const bdMatch = path.match(/^\/api\/me\/breakdowns\/([^/]+)$/);
  if (bdMatch && request.method === 'PUT') {
    const user = requireUser(session);
    const bookId = decodeURIComponent(bdMatch[1]);
    const breakdown = await readBody(request);
    if (!breakdown || typeof breakdown !== 'object' || !Array.isArray(breakdown.units)) {
      return errorResponse('Breakdown must include units array.', 400);
    }
    const result = await upsertBreakdownResource(env, user, bookId, breakdown);
    return jsonResponse({ ok: true, ...result });
  }

  if (bdMatch && request.method === 'DELETE') {
    const user = requireUser(session);
    const bookId = decodeURIComponent(bdMatch[1]);
    const existing = await env.DB.prepare(
      `SELECT id, kv_key FROM resources
       WHERE owner_user_id = ? AND type = 'breakdown' AND book_id = ?`
    ).bind(user.id, bookId).first();
    if (!existing) return errorResponse('Breakdown not found.', 404);
    await env.LIBRARY.delete(existing.kv_key);
    await env.DB.prepare('DELETE FROM resources WHERE id = ?').bind(existing.id).run();
    const overlay = await readJson(env.LIBRARY, userOverlayKey(user.id), {});
    delete overlay[bookId];
    await writeJson(env.LIBRARY, userOverlayKey(user.id), overlay);
    return jsonResponse({ ok: true });
  }

  const genMatch = path.match(/^\/api\/me\/generated\/([^/]+)\/([^/]+)$/);
  if (genMatch && request.method === 'PUT') {
    const user = requireUser(session);
    const bookId = decodeURIComponent(genMatch[1]);
    const activityId = decodeURIComponent(genMatch[2]);
    const body = await readBody(request);
    if (!body || typeof body !== 'object') return errorResponse('Invalid generated pack body.', 400);
    const payload = {
      bookId,
      activityId,
      title: body.title || bookId + ' ' + activityId,
      cefr: body.cefr || null,
      source: body.source || 'generated',
      pack: body.pack || null,
      html: body.html || '',
      savedAt: nowMs()
    };
    if (!payload.html) return errorResponse('Generated pack needs html.', 400);
    const result = await upsertGeneratedResource(env, user, bookId, activityId, payload);
    return jsonResponse({ ok: true, ...result });
  }

  if (genMatch && request.method === 'GET') {
    const user = requireUser(session);
    const bookId = decodeURIComponent(genMatch[1]);
    const activityId = decodeURIComponent(genMatch[2]);
    const existing = await env.DB.prepare(
      `SELECT id, kv_key FROM resources
       WHERE owner_user_id = ? AND type = 'generated_activity' AND book_id = ? AND activity_id = ?`
    ).bind(user.id, bookId, activityId).first();
    if (!existing) return errorResponse('Generated activity not found.', 404);
    const payload = await readJson(env.LIBRARY, existing.kv_key, null);
    return jsonResponse({ ok: true, resourceId: existing.id, pack: payload });
  }

  const forkMatch = path.match(/^\/api\/me\/fork\/([^/]+)$/);
  if (forkMatch && request.method === 'POST') {
    const user = requireUser(session);
    const sourceId = decodeURIComponent(forkMatch[1]);
    let body = {};
    try {
      body = await readBody(request);
    } catch (e) {
      body = {};
    }
    const result = await forkResource(env, user, sourceId, body && body.title);
    return jsonResponse({ ok: true, ...result });
  }

  const shareResponse = await handleShareApi(request, env, path, session);
  if (shareResponse) return shareResponse;

  return errorResponse('Not found.', 404);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      try {
        return await handleApi(request, env, url);
      } catch (e) {
        const status = e && e.status ? e.status : 500;
        return errorResponse(e && e.message ? e.message : 'Server error.', status);
      }
    }
    if (url.pathname.startsWith('/play/') || url.pathname.startsWith('/s/')) {
      return handlePlay(request, env, url);
    }
    if (env.ASSETS) return env.ASSETS.fetch(request);
    return errorResponse('Static assets not configured.', 503);
  }
};
