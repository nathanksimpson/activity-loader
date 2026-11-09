// Online play for generated games.
//
//   /play/<resourceId>   the owner's own game (log in required)
//   /s/<token>           public share link — anyone with the link can play,
//                        no account needed (for students). The owner can turn it off.
//   POST   /api/me/share/<resourceId>   make (or return) the share link
//   DELETE /api/me/share/<resourceId>   turn the share link off
//
// Games are teacher-made HTML, so they are served sandboxed (CSP `sandbox`
// without allow-same-origin): they run in their own throwaway origin and can't
// read the site's cookies or call its API. Browser storage isn't available in
// a sandbox, so a small shim gives games an in-memory localStorage instead.

import { getSessionUser, requireUser, getResource, readJson, jsonResponse, errorResponse, nowMs } from './index.js';

const STORAGE_SHIM =
  '<script>(function(){function M(){var d={};return{getItem:function(k){k=String(k);return Object.prototype.hasOwnProperty.call(d,k)?d[k]:null},' +
  'setItem:function(k,v){d[String(k)]=String(v)},removeItem:function(k){delete d[String(k)]},clear:function(){d={}},' +
  'key:function(i){return Object.keys(d)[i]||null},get length(){return Object.keys(d).length}}}' +
  "['localStorage','sessionStorage'].forEach(function(n){var ok=false;try{ok=!!window[n]&&(window[n].getItem('__t'),true)}catch(e){}" +
  'if(!ok){try{Object.defineProperty(window,n,{value:M(),configurable:true})}catch(e){}}})})();</script>';

const SANDBOX_CSP = 'sandbox allow-scripts allow-popups allow-modals allow-forms allow-downloads allow-pointer-lock';

function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function injectShim(html) {
  const text = String(html || '');
  const head = text.match(/<head[^>]*>/i);
  if (head) return text.slice(0, head.index + head[0].length) + STORAGE_SHIM + text.slice(head.index + head[0].length);
  return STORAGE_SHIM + text;
}

function gameResponse(html, isPublic) {
  return new Response(injectShim(html), {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Security-Policy': SANDBOX_CSP,
      'X-Robots-Tag': 'noindex, nofollow',
      'Referrer-Policy': 'no-referrer',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-store'
    }
  });
}

function messagePage(title, body, status) {
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const html =
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>' + esc(title) + '</title><link rel="icon" href="/favicon.ico" sizes="32x32"><link rel="icon" href="/favicon.svg" type="image/svg+xml">' +
    '<link rel="apple-touch-icon" href="/apple-touch-icon.png"><style>body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;background:#f4f6fb;color:#1c2333;' +
    'display:grid;place-items:center;min-height:100vh;margin:0;padding:16px}main{max-width:26rem;background:#fff;border:1px solid #dfe3ec;' +
    'border-radius:14px;padding:1.75rem}h1{font-size:1.3rem;margin:0 0 .6rem}p{line-height:1.55;margin:.4rem 0}a{color:#3b6fe0}' +
    '@media (prefers-color-scheme:dark){body{background:#12151c;color:#e7eaf1}main{background:#1b2030;border-color:#2c3346}a{color:#8fb0ff}}</style></head>' +
    '<body><main><h1>' + esc(title) + '</h1>' + body + '</main></body></html>';
  return new Response(html, {
    status: status || 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' }
  });
}

async function loadGameHtml(env, row) {
  if (!row || row.type !== 'generated_activity') return null;
  const payload = await readJson(env.LIBRARY, row.kv_key, null);
  return payload && payload.html ? payload.html : null;
}

export async function handlePlay(request, env, url) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return errorResponse('Method not allowed.', 405);
  if (!env.DB || !env.LIBRARY) return messagePage('Not available', '<p>Online play is not set up on this site.</p>', 503);
  const parts = url.pathname.split('/').filter(Boolean);
  const id = decodeURIComponent(parts[1] || '');

  if (parts[0] === 's') {
    const link = await env.DB.prepare(
      'SELECT resource_id FROM share_links WHERE token = ? AND revoked_at IS NULL'
    ).bind(id).first();
    const row = link ? await getResource(env, link.resource_id) : null;
    const html = await loadGameHtml(env, row);
    if (!html) {
      return messagePage('Link not working', '<p>This game link has been turned off or the game was removed. Ask your teacher for a new link.</p>', 404);
    }
    return gameResponse(html, true);
  }

  const session = await getSessionUser(request, env);
  if (!session || !session.user) {
    return messagePage(
      'Log in to play',
      '<p>This is a teacher\'s saved game. Log in to Activity Loader to open it.</p><p><a href="/">Open Activity Loader</a></p>' +
        '<p>Students: ask your teacher for the <strong>share link</strong> instead.</p>',
      401
    );
  }
  const row = await getResource(env, id);
  if (!row || row.type !== 'generated_activity' || row.owner_user_id !== session.user.id) {
    return messagePage('Game not found', '<p>This game isn\'t in your library.</p><p><a href="/">Back to Activity Loader</a></p>', 404);
  }
  const html = await loadGameHtml(env, row);
  if (!html) return messagePage('Game not found', '<p>The saved game file is missing. Generate it again.</p><p><a href="/">Back</a></p>', 404);
  return gameResponse(html, false);
}

export async function handleShareApi(request, env, path, session) {
  const m = path.match(/^\/api\/me\/share\/([^/]+)$/);
  if (!m) return null;
  const user = requireUser(session);
  const id = decodeURIComponent(m[1]);
  const row = await getResource(env, id);
  if (!row || row.type !== 'generated_activity' || row.owner_user_id !== user.id) {
    return errorResponse('Game not found in your library.', 404);
  }

  if (request.method === 'POST') {
    const existing = await env.DB.prepare(
      'SELECT token FROM share_links WHERE resource_id = ? AND revoked_at IS NULL ORDER BY created_at DESC LIMIT 1'
    ).bind(id).first();
    if (existing) return jsonResponse({ ok: true, sharePath: '/s/' + existing.token, created: false });
    const token = randomToken();
    await env.DB.prepare('INSERT INTO share_links (token, resource_id, created_by, created_at) VALUES (?, ?, ?, ?)')
      .bind(token, id, user.id, nowMs())
      .run();
    return jsonResponse({ ok: true, sharePath: '/s/' + token, created: true });
  }

  if (request.method === 'DELETE') {
    await env.DB.prepare('UPDATE share_links SET revoked_at = ? WHERE resource_id = ? AND revoked_at IS NULL')
      .bind(nowMs(), id)
      .run();
    return jsonResponse({ ok: true });
  }

  return errorResponse('Method not allowed.', 405);
}
