// Downloads the files the live site serves and writes them into the repo.
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'https://activity-loader.nathanksimpson.workers.dev';
const known = fs.readFileSync('.github/scripts/known-paths.txt', 'utf8').split('\n').map((s) => s.trim()).filter(Boolean);
const report = { ok: [], missing: [], discovered: [] };

async function get(p) {
  const res = await fetch(BASE + '/' + p.split('/').map(encodeURIComponent).join('/'), { redirect: 'follow' });
  if (res.status !== 200) return null;
  return Buffer.from(await res.arrayBuffer());
}

const index = await get('');
fs.writeFileSync('index.html', index);
const indexText = index.toString('utf8');

const queue = new Set(known.filter((p) => !p.startsWith('.') && !['package.json', 'package-lock.json', 'wrangler.jsonc', 'serve.js', 'bake.js', 'embed.js', 'electron-main.js', 'start-app.bat', 'README.md'].includes(p) && !p.startsWith('scripts/')));
const refRe = /(?:src|href)\s*=\s*["']([^"'#?]+)["']/g;
const strRe = /["'`]((?:js|css|data|content|templates|activities|vendor|img|images|admin|pages)\/[^"'`\s?#]+\.(?:js|css|json|html|svg|png))["'`]/g;
const htmlRe = /["'`]\/?([a-z0-9_-]+\.html)["'`]/gi;
function scan(text) {
  for (const re of [refRe, strRe, htmlRe]) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(text))) {
      let p = m[1].replace(/^\.?\//, '');
      if (/^(https?:|data:|mailto:|\/\/)/.test(m[1]) || !p) continue;
      if (!queue.has(p)) { queue.add(p); report.discovered.push(p); }
    }
  }
}
scan(indexText);

const done = new Set();
while (true) {
  const next = [...queue].filter((p) => !done.has(p));
  if (!next.length) break;
  for (const p of next) {
    done.add(p);
    const buf = await get(p);
    if (!buf || (p !== 'index.html' && buf.equals(index))) { report.missing.push(p); continue; }
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, buf);
    report.ok.push(p);
    if (/\.(js|html|css)$/.test(p) && !p.startsWith('activities/') && !p.startsWith('templates/')) scan(buf.toString('utf8'));
  }
}
fs.writeFileSync('.github/scripts/capture-report.json', JSON.stringify(report, null, 2));
console.log('ok', report.ok.length, 'missing', report.missing.length, 'discovered', report.discovered);
