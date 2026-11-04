// Fake Gemini endpoint for local tests: echoes a small JSON answer.
import http from 'node:http';
http.createServer(async (req, res) => {
  let body = '';
  for await (const c of req) body += c;
  const key = req.headers['x-goog-api-key'];
  const parsed = JSON.parse(body || '{}');
  const prompt = parsed.contents?.[0]?.parts?.[0]?.text || '';
  const images = (parsed.contents?.[0]?.parts || []).filter((p) => p.inline_data).length;
  res.writeHead(key === 'test-key' ? 200 : 403, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ candidates: [{ content: { parts: [{ text: '```json\n' + JSON.stringify({ ok: true, model: req.url, promptStart: prompt.slice(0, 30), images }) + '\n```' }] } }] }));
}).listen(8799, () => console.log('mock gemini on 8799'));
