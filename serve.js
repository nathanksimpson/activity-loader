const http = require('http');
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const root = __dirname;
const preferredPort = Number(process.env.PORT) || 8080;
const maxPortAttempts = 20;
const shouldOpenBrowser = process.argv.includes('--open') || process.env.OPEN_BROWSER === '1';
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

function createServer() {
  return http.createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    const rel = urlPath === '/' ? '/index.html' : urlPath;
    const full = path.normalize(path.join(root, rel));
    if (full !== root && !full.startsWith(root + path.sep)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    fs.readFile(full, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not found');
        return;
      }
      const ext = path.extname(full).toLowerCase();
      res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
      res.end(data);
    });
  });
}

function openBrowser(url) {
  const safeUrl = String(url || '').trim();
  if (!safeUrl) return;
  const localCwd = process.env.TEMP || process.env.USERPROFILE || process.cwd();
  try {
    if (process.platform === 'win32') {
      const child = childProcess.spawn(
        'cmd.exe',
        ['/c', 'start', '', safeUrl],
        { detached: true, stdio: 'ignore', windowsHide: true, cwd: localCwd }
      );
      child.on('error', () => {
        console.warn('Could not open the browser automatically. Open this address yourself: ' + safeUrl);
      });
      child.unref();
      return;
    }
    if (process.platform === 'darwin') {
      childProcess.spawn('open', [safeUrl], { detached: true, stdio: 'ignore' }).unref();
      return;
    }
    childProcess.spawn('xdg-open', [safeUrl], { detached: true, stdio: 'ignore' }).unref();
  } catch (err) {
    console.warn('Could not open the browser automatically. Open this address yourself: ' + safeUrl);
  }
}

function listenOnFreePort(startPort, attemptsLeft) {
  const port = Number(startPort) || 8080;
  const server = createServer();
  server.once('error', (err) => {
    if (err && err.code === 'EADDRINUSE' && attemptsLeft > 0) {
      console.log('Port ' + port + ' is busy. Trying ' + (port + 1) + '...');
      listenOnFreePort(port + 1, attemptsLeft - 1);
      return;
    }
    throw err;
  });
  server.listen(port, () => {
    const url = 'http://localhost:' + port;
    console.log('Activity Loader: ' + url);
    if (port !== preferredPort) {
      console.log('Requested port ' + preferredPort + ' was busy, so this app moved to ' + port + '.');
    }
    console.log('Keep this window open. In your browser open that address (not index.html as a file).');
    if (shouldOpenBrowser) {
      console.log('Opening the browser for you...');
      setTimeout(() => openBrowser(url), 400);
    }
  });
}

listenOnFreePort(preferredPort, maxPortAttempts);
