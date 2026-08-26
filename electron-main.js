const { app, BrowserWindow } = require('electron');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Simple static server so PDF.js workers can load via http:// (not file://).
function createStaticServer(rootDir) {
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
    '.txt': 'text/plain; charset=utf-8',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
  };

  return http.createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    const rel = urlPath === '/' ? '/index.html' : urlPath;
    const full = path.normalize(path.join(rootDir, rel));

    // Prevent directory traversal
    if (full !== rootDir && !full.startsWith(rootDir + path.sep)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
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

function listenOnFreePort(rootDir, startPort, attemptsLeft) {
  return new Promise((resolve, reject) => {
    const tryPort = (port, triesLeft) => {
      const server = createStaticServer(rootDir);
      server.once('error', (err) => {
        if (err && err.code === 'EADDRINUSE' && triesLeft > 0) {
          tryPort(port + 1, triesLeft - 1);
          return;
        }
        reject(err);
      });
      server.listen(port, () => resolve({ server, port }));
    };
    tryPort(startPort, attemptsLeft);
  });
}

async function start() {
  // app.getAppPath() points to where packaged resources live (asar or folder).
  const rootDir = app.getAppPath();

  const portStart = 8080;
  const { server, port } = await listenOnFreePort(rootDir, portStart, 20);

  const win = new BrowserWindow({
    width: 1100,
    height: 820,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    title: 'Activity Loader',
  });

  win.on('closed', () => {
    try { server.close(); } catch (e) { /* ignore */ }
  });

  await win.loadURL(`http://127.0.0.1:${port}/index.html`);
}

app.whenReady().then(() => {
  start().catch((err) => {
    console.error(err);
    app.quit();
  });
});

app.on('window-all-closed', () => {
  // Keep behavior predictable across platforms.
  if (process.platform !== 'darwin') app.quit();
});

