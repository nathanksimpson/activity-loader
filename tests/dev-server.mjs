// Local test harness: runs src/worker.js on Node with SQLite standing in for D1
// and the project folder standing in for the assets binding.
//   node tests/dev-server.mjs [port]
// Reads .dev.vars for environment values. Not used in production.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';
import worker from '../src/worker.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.argv[2] || 8787);

const env = {};
for (const line of fs.readFileSync(path.join(root, '.dev.vars'), 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2];
}
const wrangler = fs.readFileSync(path.join(root, 'wrangler.jsonc'), 'utf8');
const admins = wrangler.match(/"ADMIN_EMAILS":\s*"([^"]*)"/);
if (admins && !env.ADMIN_EMAILS) env.ADMIN_EMAILS = admins[1];

// ---- D1 stand-in ----
const db = new DatabaseSync(process.env.DB_FILE || ':memory:');
db.exec('PRAGMA foreign_keys = ON');
db.exec(fs.readFileSync(path.join(root, 'schema.sql'), 'utf8'));

function stmt(sql, binds = []) {
  const norm = (v) => (v === undefined ? null : typeof v === 'boolean' ? Number(v) : v);
  return {
    bind: (...args) => stmt(sql, args.map(norm)),
    first: async () => db.prepare(sql).get(...binds) || null,
    all: async () => ({ results: db.prepare(sql).all(...binds) }),
    run: async () => {
      const r = db.prepare(sql).run(...binds);
      return { meta: { changes: Number(r.changes) } };
    },
    _exec: () => db.prepare(sql).run(...binds)
  };
}
env.DB = {
  prepare: (sql) => stmt(sql),
  batch: async (list) => {
    db.exec('BEGIN');
    try { list.forEach((s) => s._exec()); db.exec('COMMIT'); } catch (e) { db.exec('ROLLBACK'); throw e; }
    return [];
  }
};

// ---- assets stand-in (respects .assetsignore roughly) ----
const ignored = fs.readFileSync(path.join(root, '.assetsignore'), 'utf8').split('\n').map((s) => s.trim()).filter(Boolean);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml' };
env.ASSETS = {
  fetch: async (req) => {
    const u = new URL(req.url);
    let rel = decodeURIComponent(u.pathname);
    if (rel.endsWith('/')) rel += 'index.html';
    const first = rel.split('/')[1];
    if (ignored.some((p) => p === first || p === rel.slice(1))) return new Response('Not found', { status: 404 });
    const full = path.normalize(path.join(root, rel));
    if (!full.startsWith(root) || !fs.existsSync(full) || fs.statSync(full).isDirectory()) return new Response('Not found', { status: 404 });
    return new Response(fs.readFileSync(full), { headers: { 'Content-Type': types[path.extname(full)] || 'application/octet-stream' } });
  }
};

http.createServer(async (req, res) => {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const body = chunks.length ? Buffer.concat(chunks) : undefined;
  const request = new Request('http://localhost:' + port + req.url, {
    method: req.method,
    headers: req.headers,
    body: req.method === 'GET' || req.method === 'HEAD' ? undefined : body,
    redirect: 'manual'
  });
  const response = await worker.fetch(request, env);
  const headers = {};
  response.headers.forEach((v, k) => {
    if (k === 'set-cookie') return;
    headers[k] = v;
  });
  const cookies = response.headers.getSetCookie ? response.headers.getSetCookie() : [];
  if (cookies.length) headers['set-cookie'] = cookies;
  res.writeHead(response.status, headers);
  res.end(Buffer.from(await response.arrayBuffer()));
}).listen(port, () => console.log('Activity Loader test server on http://localhost:' + port));
