/**
 * Shared AI client: Gemini, OpenAI, Anthropic, and custom OpenAI-compatible endpoints.
 * Keys and settings come from ActivityDomain; this module only talks to APIs.
 */
(function (global) {
  'use strict';

  const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/';
  const OPENAI_RESPONSES = 'https://api.openai.com/v1/responses';
  const OPENAI_CHAT = 'https://api.openai.com/v1/chat/completions';
  const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

  function extractJson(text) {
    const trimmed = String(text || '').trim();
    const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
    const raw = fence ? fence[1] : trimmed;
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start < 0 || end < start) throw new Error('AI did not return JSON.');
    return JSON.parse(raw.slice(start, end + 1));
  }

  function extractHtml(text) {
    const trimmed = String(text || '').trim();
    const fence = trimmed.match(/```(?:html)?\s*([\s\S]*?)```/i);
    if (fence) return fence[1].trim();
    const doc = trimmed.match(/<!DOCTYPE[\s\S]*<\/html>/i) || trimmed.match(/<html[\s\S]*<\/html>/i);
    if (doc) return doc[0].trim();
    if (/<html[\s\S]*>/i.test(trimmed) || /<body[\s\S]*>/i.test(trimmed)) return trimmed;
    throw new Error('AI did not return an HTML template.');
  }

  function friendlyError(err) {
    const msg = String(err && err.message ? err.message : err);
    if (typeof location !== 'undefined' && location.protocol === 'file:') {
      return 'API blocked — open via local server. In this folder run: node serve.js then open http://localhost:8080';
    }
    if (/Failed to fetch|NetworkError|Load failed|CORS/i.test(msg)) {
      return 'API blocked — open via local server (node serve.js), then try again. Some providers also block browser calls (CORS).';
    }
    if (/payload too large|inline_data|too large to process|413/i.test(msg)) {
      return 'The API still said the request was too large after shrinking. Add a note like “Units 1–2”, or upload fewer pages.';
    }
    return msg;
  }

  function requireHttps() {
    if (typeof location !== 'undefined' && location.protocol === 'file:') {
      throw new Error(friendlyError(new Error('file')));
    }
  }

  function resolveOptions(opts) {
    const Domain = global.ActivityDomain;
    const settings = Domain && Domain.getAiSettings ? Domain.getAiSettings() : {};
    const provider = String((opts && opts.provider) || settings.provider || 'gemini').trim() || 'gemini';
    const providerInfo = Domain && Domain.getAiProvider
      ? Domain.getAiProvider(provider)
      : { id: provider };
    const id = providerInfo.id || provider;
    const custom = (settings.custom && typeof settings.custom === 'object') ? settings.custom : {};
    let model = String((opts && opts.model) || '').trim();
    if (!model) {
      if (id === 'custom') model = String(custom.model || '').trim();
      else if (Domain && Domain.getSelectedModel) model = Domain.getSelectedModel(id);
    }
    let apiKey = String((opts && opts.apiKey) || '').trim();
    if (!apiKey && Domain && Domain.getApiKey) apiKey = Domain.getApiKey(id);
    return {
      provider: id,
      model: model,
      apiKey: apiKey,
      temperature: opts && opts.temperature != null ? Number(opts.temperature) : 0.2,
      custom: custom,
      parseJson: !(opts && opts.parseJson === false),
      parseHtml: !!(opts && opts.parseHtml)
    };
  }

  function assertReady(resolved) {
    requireHttps();
    if (!resolved.apiKey) throw new Error('Paste an API key first.');
    if (resolved.provider === 'custom') {
      if (!String(resolved.custom.baseUrl || '').trim()) {
        throw new Error('Enter a custom API base URL (example: https://api.groq.com/openai/v1).');
      }
      if (!resolved.model) throw new Error('Enter a model name for the custom provider.');
    } else if (!resolved.model) {
      throw new Error('Choose a model first.');
    }
  }

  async function readError(res) {
    try {
      return (await res.text()).slice(0, 220);
    } catch (e) {
      return '';
    }
  }

  function geminiPartsFromPrompt(prompt, imageParts) {
    const parts = [{ text: String(prompt || '') }];
    (imageParts || []).forEach((p) => {
      if (p && p.inline_data) parts.push(p);
      else if (p && p.text) parts.push(p);
    });
    return parts;
  }

  async function callGemini(resolved, prompt, imageParts) {
    const url = GEMINI_BASE + encodeURIComponent(resolved.model) + ':generateContent?key=' + encodeURIComponent(resolved.apiKey);
    let res;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: geminiPartsFromPrompt(prompt, imageParts) }],
          generationConfig: { temperature: resolved.temperature }
        })
      });
    } catch (err) {
      throw new Error(friendlyError(err));
    }
    if (!res.ok) {
      const errText = await readError(res);
      if (res.status === 400 && /inline|size|too large|payload/i.test(errText)) {
        throw new Error('The API still said the request was too large after shrinking. Add a note like “Units 1–2”, or upload fewer pages.');
      }
      throw new Error('Gemini error (' + res.status + '). ' + errText);
    }
    const data = await res.json();
    const text = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts
      ? data.candidates[0].content.parts.map((p) => p.text || '').join('')
      : '';
    if (!text) throw new Error('AI returned an empty answer.');
    return text;
  }

  function openaiImageContent(imageParts) {
    const out = [];
    (imageParts || []).forEach((part) => {
      const mime = part && part.inline_data && part.inline_data.mime_type;
      const data = part && part.inline_data && part.inline_data.data;
      if (!mime || !data || mime === 'application/pdf') return;
      out.push({
        type: 'input_image',
        image_url: 'data:' + mime + ';base64,' + data
      });
    });
    return out;
  }

  async function callOpenAiResponses(resolved, prompt, imageParts) {
    const content = [{ type: 'input_text', text: String(prompt || '') }].concat(openaiImageContent(imageParts));
    let res;
    try {
      res = await fetch(OPENAI_RESPONSES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + resolved.apiKey
        },
        body: JSON.stringify({
          model: resolved.model,
          input: [{ role: 'user', content: content }],
          temperature: resolved.temperature
        })
      });
    } catch (err) {
      throw new Error(friendlyError(err));
    }
    if (!res.ok) throw new Error('OpenAI error (' + res.status + '). ' + (await readError(res)));
    const data = await res.json();
    const text = Array.isArray(data.output)
      ? data.output.map((item) => {
        const parts = Array.isArray(item.content) ? item.content : [];
        return parts.map((part) => part.text || '').join('');
      }).join('')
      : '';
    if (!text) throw new Error('AI returned an empty answer.');
    return text;
  }

  function chatImageContent(imageParts) {
    const out = [];
    (imageParts || []).forEach((part) => {
      const mime = part && part.inline_data && part.inline_data.mime_type;
      const data = part && part.inline_data && part.inline_data.data;
      if (!mime || !data || mime === 'application/pdf') return;
      out.push({
        type: 'image_url',
        image_url: { url: 'data:' + mime + ';base64,' + data }
      });
    });
    return out;
  }

  async function callOpenAiChat(resolved, prompt, imageParts, baseUrl, extraHeaders) {
    const root = String(baseUrl || OPENAI_CHAT).replace(/\/+$/, '');
    const url = /\/chat\/completions$/i.test(root) ? root : root + '/chat/completions';
    const content = [{ type: 'text', text: String(prompt || '') }].concat(chatImageContent(imageParts));
    const headers = Object.assign({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + resolved.apiKey
    }, extraHeaders || {});
    let res;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          model: resolved.model,
          messages: [{ role: 'user', content: content }],
          temperature: resolved.temperature
        })
      });
    } catch (err) {
      throw new Error(friendlyError(err));
    }
    if (!res.ok) throw new Error('Custom API error (' + res.status + '). ' + (await readError(res)));
    const data = await res.json();
    const text = data && data.choices && data.choices[0] && data.choices[0].message
      ? String(data.choices[0].message.content || '')
      : '';
    if (!text) throw new Error('AI returned an empty answer.');
    return text;
  }

  async function callAnthropic(resolved, prompt, imageParts) {
    const content = [];
    (imageParts || []).forEach((part) => {
      const mime = part && part.inline_data && part.inline_data.mime_type;
      const data = part && part.inline_data && part.inline_data.data;
      if (!mime || !data || mime === 'application/pdf') return;
      content.push({
        type: 'image',
        source: { type: 'base64', media_type: mime, data: data }
      });
    });
    content.push({ type: 'text', text: String(prompt || '') });
    let res;
    try {
      res = await fetch(ANTHROPIC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': resolved.apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: resolved.model,
          max_tokens: 8192,
          temperature: resolved.temperature,
          messages: [{ role: 'user', content: content }]
        })
      });
    } catch (err) {
      throw new Error(friendlyError(err));
    }
    if (!res.ok) throw new Error('Anthropic error (' + res.status + '). ' + (await readError(res)));
    const data = await res.json();
    const text = Array.isArray(data.content)
      ? data.content.map((part) => part.text || '').join('')
      : '';
    if (!text) throw new Error('AI returned an empty answer.');
    return text;
  }

  async function callCustom(resolved, prompt, imageParts) {
    const baseUrl = String(resolved.custom.baseUrl || '').trim();
    const headers = {};
    const headerName = String(resolved.custom.extraHeaderName || '').trim();
    const headerValue = String(resolved.custom.extraHeaderValue || '').trim();
    if (headerName && headerValue) headers[headerName] = headerValue;
    return callOpenAiChat(resolved, prompt, imageParts, baseUrl, headers);
  }

  async function generateText(opts) {
    const resolved = resolveOptions(opts || {});
    assertReady(resolved);
    const prompt = (opts && opts.prompt) || '';
    const imageParts = (opts && opts.imageParts) || (opts && opts.parts) || [];
    let text;
    if (resolved.provider === 'openai') text = await callOpenAiResponses(resolved, prompt, imageParts);
    else if (resolved.provider === 'anthropic') text = await callAnthropic(resolved, prompt, imageParts);
    else if (resolved.provider === 'custom') text = await callCustom(resolved, prompt, imageParts);
    else text = await callGemini(resolved, prompt, imageParts);

    if (resolved.parseHtml) return extractHtml(text);
    if (resolved.parseJson) return extractJson(text);
    return text;
  }

  const AI = {
    extractJson: extractJson,
    extractHtml: extractHtml,
    friendlyError: friendlyError,
    generateText: generateText,
    /** Convenience: text prompt → JSON object */
    async generateJson(opts) {
      return generateText(Object.assign({}, opts, { parseJson: true, parseHtml: false }));
    },
    /** Convenience: text prompt → HTML string */
    async generateHtml(opts) {
      return generateText(Object.assign({}, opts, { parseJson: false, parseHtml: true }));
    }
  };

  global.ActivityAI = AI;
})(typeof window !== 'undefined' ? window : globalThis);
