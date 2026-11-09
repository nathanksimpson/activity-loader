// Minimal Chrome DevTools Protocol driver for local browser tests (no npm needed).
import { spawn } from 'node:child_process';

export async function launch(port = 9333) {
  (await import('node:fs')).rmSync('/tmp/claude-0/lchrome-' + port, { recursive: true, force: true });
  const proc = spawn('google-chrome', [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--no-first-run',
    '--remote-debugging-port=' + port, '--user-data-dir=/tmp/claude-0/lchrome-' + port, 'about:blank'
  ], { stdio: 'ignore' });
  for (let i = 0; i < 50; i++) {
    try {
      const list = await (await fetch('http://127.0.0.1:' + port + '/json/list')).json();
      const page = list.find((t) => t.type === 'page');
      if (page) return { proc, page: await connect(page.webSocketDebuggerUrl) };
    } catch (e) { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error('Chrome did not start');
}

async function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0;
  const pending = new Map();
  const listeners = [];
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
    } else if (msg.method) listeners.forEach((l) => l(msg));
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const n = ++id;
    pending.set(n, { resolve, reject });
    ws.send(JSON.stringify({ id: n, method, params }));
  });
  const logs = [];
  const dialogs = [];
  let dialogAnswer = true;
  let promptText = '';
  listeners.push((m) => {
    if (m.method === 'Runtime.consoleAPICalled') logs.push(m.params.type + ': ' + m.params.args.map((a) => a.value ?? a.description).join(' '));
    if (m.method === 'Runtime.exceptionThrown') logs.push('EXCEPTION: ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
    if (m.method === 'Page.javascriptDialogOpening') {
      dialogs.push(m.params.message);
      send('Page.handleJavaScriptDialog', { accept: dialogAnswer, promptText });
    }
  });
  await send('Page.enable');
  await send('Runtime.enable');
  const page = {
    send, logs, dialogs,
    answerDialogs(accept, text = '') { dialogAnswer = accept; promptText = text; },
    async goto(url) {
      const loaded = new Promise((r) => listeners.push(function f(m) { if (m.method === 'Page.loadEventFired') { listeners.splice(listeners.indexOf(f), 1); r(); } }));
      await send('Page.navigate', { url });
      await loaded;
    },
    async eval(expr) {
      const res = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
      if (res.exceptionDetails) throw new Error(res.exceptionDetails.exception?.description || res.exceptionDetails.text);
      return res.result.value;
    },
    async waitFor(expr, timeout = 8000) {
      const end = Date.now() + timeout;
      while (Date.now() < end) {
        try { if (await page.eval(expr)) return true; } catch (e) { /* page navigating */ }
        await new Promise((r) => setTimeout(r, 150));
      }
      throw new Error('Timed out waiting for: ' + expr);
    },
    async screenshot(file, width = 1280, height = 900) {
      await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 500 });
      const { data } = await send('Page.captureScreenshot', { format: 'png' });
      (await import('node:fs')).writeFileSync(file, Buffer.from(data, 'base64'));
    },
    async setCookie(name, value, url) { await send('Network.setCookie', { name, value, url }); },
    close() { ws.close(); }
  };
  await send('Network.enable');
  return page;
}
