// Local test server: runs worker/index.js on Node.
// SQLite stands in for D1, a Map for KV, and this folder for the static files.
//   node tests/dev-server.mjs [port]
// Not used in production.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';
import worker from '../worker/index.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.argv[2] || 8787);

const env = { ADMIN_USERNAME: 'admin', ADMIN_PASSWORD: 'admin-pass' };

const db = new DatabaseSync(':memory:');
for (const f of fs.readdirSync(path.join(root, 'migrations')).sort()) {
  db.exec(fs.readFileSync(path.join(root, 'migrations', f), 'utf8'));
}
function stmt(sql, binds = []) {
  const norm = (v) => (v === undefined ? null : typeof v === 'boolean' ? Number(v) : v);
  return {
    bind: (...args) => stmt(sql, args.map(norm)),
    first: async () => db.prepare(sql).get(...binds) || null,
    all: async () => ({ results: db.prepare(sql).all(...binds) }),
    run: async () => ({ meta: { changes: Number(db.prepare(sql).run(...binds).changes) } })
  };
}
env.DB = { prepare: (sql) => stmt(sql) };

const kv = new Map();
env.LIBRARY = {
  get: async (k) => (kv.has(k) ? kv.get(k) : null),
  put: async (k, v) => { kv.set(k, String(v)); },
  delete: async (k) => { kv.delete(k); }
};

const ignored = fs.readFileSync(path.join(root, '.assetsignore'), 'utf8').split('\n').map((s) => s.trim()).filter(Boolean);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
env.ASSETS = {
  fetch: async (req) => {
    const u = new URL(req.url);
    let rel = decodeURIComponent(u.pathname);
    if (rel.endsWith('/')) rel += 'index.html';
    if (!path.extname(rel) && fs.existsSync(path.join(root, rel + '.html'))) rel += '.html';
    const first = rel.split('/')[1];
    if (ignored.includes(first)) return new Response('Not found', { status: 404 });
    const full = path.normalize(path.join(root, rel));
    if (!full.startsWith(root) || !fs.existsSync(full) || fs.statSync(full).isDirectory()) return new Response('Not found', { status: 404 });
    return new Response(fs.readFileSync(full), { headers: { 'Content-Type': types[path.extname(full)] || 'application/octet-stream' } });
  }
};

http.createServer(async (req, res) => {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const request = new Request('http://localhost:' + port + req.url, {
    method: req.method,
    headers: req.headers,
    body: req.method === 'GET' || req.method === 'HEAD' ? undefined : Buffer.concat(chunks)
  });
  let response;
  try {
    response = await worker.fetch(request, env);
  } catch (e) {
    console.error(e);
    response = new Response('crash: ' + e.message, { status: 500 });
  }
  const headers = {};
  response.headers.forEach((v, k) => { if (k !== 'set-cookie') headers[k] = v; });
  // The Worker marks cookies Secure; plain-http localhost needs them without it.
  const cookies = (response.headers.getSetCookie ? response.headers.getSetCookie() : []).map((c) => c.replace('; Secure', ''));
  if (cookies.length) headers['set-cookie'] = cookies;
  res.writeHead(response.status, headers);
  res.end(Buffer.from(await response.arrayBuffer()));
}).listen(port, () => console.log('Activity Loader test server on http://localhost:' + port));
