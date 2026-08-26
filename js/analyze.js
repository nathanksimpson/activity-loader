/**
 * AI multimodal: PDF / page photos -> curriculum breakdown JSON.
 * PDFs are shrunk locally (text extract, or compressed page photos). Files are never stored.
 */
(function (global) {
  'use strict';

  const MAX_IMAGE_EDGE = 1600;
  const JPEG_QUALITY = 0.82;
  const MIN_TEXT_CHARS_PAGE = 40;
  const MIN_TEXT_CHARS_TOTAL = 400;
  const TEXT_PAGE_RATIO = 0.45;
  const MAX_TEXT_CHARS = 20000;
  const IMAGE_BATCH = 6;
  const PDF_WORKER_SRC = 'vendor/pdfjs/pdf.worker.min.js';

  function extractJson(text) {
    if (global.ActivityAI && global.ActivityAI.extractJson) return global.ActivityAI.extractJson(text);
    const trimmed = String(text || '').trim();
    const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
    const raw = fence ? fence[1] : trimmed;
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start < 0 || end < start) throw new Error('AI did not return JSON.');
    return JSON.parse(raw.slice(start, end + 1));
  }

  function friendlyError(err) {
    if (global.ActivityAI && global.ActivityAI.friendlyError) return global.ActivityAI.friendlyError(err);
    const msg = String(err && err.message ? err.message : err);
    if (typeof location !== 'undefined' && location.protocol === 'file:') {
      return 'API blocked — open via local server. In this folder run: node serve.js then open http://localhost:8080';
    }
    if (/Failed to fetch|NetworkError|Load failed|CORS/i.test(msg)) {
      return 'API blocked — open via local server (node serve.js), then try again.';
    }
    if (/payload too large|inline_data|too large to process|413/i.test(msg)) {
      return 'The API still said the request was too large after shrinking. Add a note like “Units 1–2”, or upload fewer pages.';
    }
    if (/PDF reader is not loaded|pdf\.worker|Setting up fake worker|GlobalWorkerOptions/i.test(msg)) {
      return 'PDF reader needs the local server. Double-click start-app.bat, then try again.';
    }
    if (/No units found/i.test(msg)) {
      return 'No units found. Try a note like “Units 1–2”, or upload clearer pages.';
    }
    return msg;
  }

  function mimeForFile(file) {
    const type = String(file.type || '').toLowerCase();
    const name = String(file.name || '').toLowerCase();
    if (type === 'application/pdf' || name.endsWith('.pdf')) return 'application/pdf';
    if (type === 'image/png' || name.endsWith('.png')) return 'image/png';
    if (type === 'image/jpeg' || type === 'image/jpg' || name.endsWith('.jpg') || name.endsWith('.jpeg')) {
      return 'image/jpeg';
    }
    return '';
  }

  function kbLabel(chars) {
    const kb = Math.max(1, Math.round(chars / 1024));
    return kb + ' KB';
  }

  function mbLabel(bytes) {
    const mb = bytes / (1024 * 1024);
    if (mb < 1) return Math.max(1, Math.round(bytes / 1024)) + ' KB';
    return (mb >= 10 ? Math.round(mb) : mb.toFixed(1)) + ' MB';
  }

  function reportProgress(onProgress, phase, current, total, message) {
    if (!onProgress) return;
    onProgress({ phase: phase, current: current, total: total, message: message });
  }

  function getPdfjs() {
    const lib = global.pdfjsLib;
    if (!lib || !lib.getDocument) {
      throw new Error('PDF reader is not loaded. Open via start-app.bat (node serve.js).');
    }
    if (lib.GlobalWorkerOptions) {
      lib.GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC;
    }
    return lib;
  }

  function pageItemsToText(items) {
    const rows = [];
    (items || []).forEach((it) => {
      const str = String(it.str || '').replace(/\s+/g, ' ');
      if (!str.trim()) return;
      const t = it.transform || [1, 0, 0, 1, 0, 0];
      const h = Number(it.height) || 10;
      rows.push({
        str: str,
        x: Number(t[4]) || 0,
        y: Number(t[5]) || 0,
        h: h
      });
    });
    rows.sort((a, b) => {
      const line = Math.max(a.h, b.h, 8) * 0.6;
      const dy = b.y - a.y;
      if (Math.abs(dy) > line) return dy;
      return a.x - b.x;
    });
    const lines = [];
    let cur = [];
    let lastY = null;
    let lastH = 10;
    rows.forEach((item) => {
      const thresh = Math.max(item.h, lastH, 8) * 0.6;
      if (lastY != null && Math.abs(item.y - lastY) > thresh) {
        lines.push(cur.map((x) => x.str).join(' ').replace(/\s+/g, ' ').trim());
        cur = [];
      }
      cur.push(item);
      lastY = item.y;
      lastH = item.h;
    });
    if (cur.length) {
      lines.push(cur.map((x) => x.str).join(' ').replace(/\s+/g, ' ').trim());
    }
    return lines.filter(Boolean).join('\n');
  }

  async function withPdfDocument(file, onProgress, fn) {
    const pdfjs = getPdfjs();
    const url = URL.createObjectURL(file);
    let doc = null;
    try {
      reportProgress(onProgress, 'opening', 0, 0,
        'Opening ' + file.name + ' (' + mbLabel(file.size) + ')…');
      doc = await pdfjs.getDocument({ url: url }).promise;
      return await fn(doc);
    } finally {
      if (doc && doc.destroy) {
        try { await doc.destroy(); } catch (e) { /* ignore */ }
      }
      URL.revokeObjectURL(url);
    }
  }

  async function extractPdfPages(file, onProgress) {
    return withPdfDocument(file, onProgress, async (doc) => {
      const pages = [];
      for (let i = 1; i <= doc.numPages; i++) {
        reportProgress(onProgress, 'reading', i, doc.numPages,
          'Reading ' + file.name + ' page ' + i + ' / ' + doc.numPages +
          ' (' + mbLabel(file.size) + ')…');
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        const text = pageItemsToText(content.items);
        const chars = text.replace(/\s+/g, '').length;
        pages.push({
          fileName: file.name,
          pageNum: i,
          text: text,
          chars: chars
        });
        if (page.cleanup) page.cleanup();
      }
      return pages;
    });
  }

  async function rasterizePdfBatches(file, onProgress) {
    const batches = [];
    await withPdfDocument(file, onProgress, async (doc) => {
      let parts = [];
      for (let i = 1; i <= doc.numPages; i++) {
        reportProgress(onProgress, 'shrinking', i, doc.numPages,
          'Shrinking page photo ' + i + ' / ' + doc.numPages + '…');
        const page = await doc.getPage(i);
        parts.push({ inline_data: await renderPageJpeg(page) });
        if (page.cleanup) page.cleanup();
        if (parts.length >= IMAGE_BATCH || i === doc.numPages) {
          batches.push({ kind: 'images', parts: parts });
          parts = [];
        }
      }
    });
    return batches;
  }

  async function renderPageJpeg(page) {
    const vp1 = page.getViewport({ scale: 1 });
    const scale = Math.min(MAX_IMAGE_EDGE / vp1.width, MAX_IMAGE_EDGE / vp1.height, 1.5);
    const viewport = page.getViewport({ scale: scale });
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.ceil(viewport.width));
    canvas.height = Math.max(1, Math.ceil(viewport.height));
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport: viewport }).promise;
    const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
    const comma = dataUrl.indexOf(',');
    return { mime_type: 'image/jpeg', data: dataUrl.slice(comma + 1) };
  }

  function resizeImage(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = function () {
        let w = img.naturalWidth || img.width;
        let h = img.naturalHeight || img.height;
        if (w > MAX_IMAGE_EDGE || h > MAX_IMAGE_EDGE) {
          const scale = MAX_IMAGE_EDGE / Math.max(w, h);
          w = Math.max(1, Math.round(w * scale));
          h = Math.max(1, Math.round(h * scale));
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
        const comma = dataUrl.indexOf(',');
        resolve({ mime_type: 'image/jpeg', data: dataUrl.slice(comma + 1) });
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        reject(new Error('Could not read photo ' + (file.name || '') + '.'));
      };
      img.src = url;
    });
  }

  function chunkTextBlocks(blocks) {
    const batches = [];
    let buf = [];
    let size = 0;
    blocks.forEach((block) => {
      if (size && size + block.length > MAX_TEXT_CHARS) {
        batches.push({ kind: 'text', text: buf.join('\n\n') });
        buf = [block];
        size = block.length;
      } else {
        buf.push(block);
        size += block.length;
      }
    });
    if (buf.length) batches.push({ kind: 'text', text: buf.join('\n\n') });
    return batches;
  }

  function chunkImages(parts) {
    const batches = [];
    for (let i = 0; i < parts.length; i += IMAGE_BATCH) {
      batches.push({
        kind: 'images',
        parts: parts.slice(i, i + IMAGE_BATCH).map((p) => ({ inline_data: p }))
      });
    }
    return batches;
  }

  function formatPageBlock(page) {
    const header = '--- ' + page.fileName + ' page ' + page.pageNum + ' ---';
    const body = page.text && page.text.trim() ? page.text.trim() : '(no printed text on this page)';
    return header + '\n' + body;
  }

  async function prepareUploads(fileList, opts) {
    const options = opts || {};
    const onProgress = options.onProgress;
    const files = Array.prototype.slice.call(fileList || []).filter(Boolean);
    if (!files.length) throw new Error('Choose a PDF or photo first.');

    const pdfFiles = [];
    const pdfPages = [];
    const imageParts = [];
    const names = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const mime = mimeForFile(file);
      if (!mime) {
        throw new Error('Use a PDF or a JPG/PNG photo. "' + (file.name || 'This file') + '" is not supported.');
      }
      names.push(file.name);
      if (mime === 'application/pdf') {
        pdfFiles.push(file);
        const pages = await extractPdfPages(file, onProgress);
        pages.forEach((p) => pdfPages.push(p));
      } else {
        reportProgress(onProgress, 'shrinking', imageParts.length + 1, files.length,
          'Shrinking photo ' + file.name + ' (' + mbLabel(file.size) + ')…');
        imageParts.push(await resizeImage(file));
      }
    }

    const textChars = pdfPages.reduce((sum, p) => sum + p.chars, 0);
    const textPageCount = pdfPages.filter((p) => p.chars >= MIN_TEXT_CHARS_PAGE).length;
    const useText = pdfPages.length > 0 && (
      textChars >= MIN_TEXT_CHARS_TOTAL ||
      ((textPageCount / pdfPages.length) >= TEXT_PAGE_RATIO && textChars >= 80)
    );

    const downloadText = pdfPages.length
      ? pdfPages.map(formatPageBlock).join('\n\n')
      : '';
    const downloadName = (names[0] || 'pages').replace(/\.pdf$/i, '') + ' text.txt';

    const batches = [];
    if (useText) {
      batches.push.apply(batches, chunkTextBlocks(pdfPages.map(formatPageBlock)));
    }
    if (imageParts.length) {
      batches.push.apply(batches, chunkImages(imageParts));
    }

    const pdfMb = pdfFiles.reduce((sum, f) => sum + (f.size || 0), 0);
    const sizeNote = pdfMb ? 'Original ' + mbLabel(pdfMb) + '. ' : '';
    let summary;
    if (useText) {
      summary = sizeNote + (names.length === 1 ? names[0] : names.length + ' files') +
        ': ' + pdfPages.length + ' pages of text (~' + kbLabel(downloadText.length) + '). Ready to Analyze.';
    } else if (pdfPages.length) {
      const batchCount = Math.max(1, Math.ceil(pdfPages.length / IMAGE_BATCH));
      summary = sizeNote + 'Scanned PDF: will shrink to ' + pdfPages.length + ' page photos' +
        (imageParts.length ? ' + ' + imageParts.length + ' extra photos' : '') +
        ', then Analyze in ' + (batchCount + Math.ceil(imageParts.length / IMAGE_BATCH)) +
        ((batchCount + Math.ceil(imageParts.length / IMAGE_BATCH)) === 1 ? ' batch.' : ' batches.');
    } else {
      summary = imageParts.length + ' compressed page photo' + (imageParts.length === 1 ? '' : 's') + '. Ready to Analyze.';
    }

    return {
      mode: useText ? 'text' : (pdfPages.length ? 'images' : 'photos'),
      summary: summary,
      downloadText: downloadText,
      downloadName: downloadName,
      pageCount: pdfPages.length,
      photoCount: imageParts.length,
      textChars: textChars,
      pdfFiles: pdfFiles,
      batches: batches
    };
  }

  function buildPrompt(book, note, extractedText) {
    const title = book && book.title ? book.title : 'this English book';
    const knownUnits = book && book.units && book.units.length
      ? ('Known unit titles (use these if the pages match):\n' + book.units.join('\n'))
      : 'Unit titles are unknown. Read them from the pages.';
    const extra = String(note || '').trim();
    const body = String(extractedText || '').trim();
    return [
      'You are helping a Korean elementary English teacher.',
      'Extract a curriculum breakdown from the attached book pages for ' + title + '.',
      knownUnits,
      extra ? ('Teacher note: ' + extra) : '',
      body
        ? 'The following text was extracted from the PDF in visual reading order (top to bottom, left to right), including lines at the bottom of each page. Use every page.'
        : '',
      body,
      'Return JSON only, no markdown:',
      '{ "title": string, "cefr": "Pre-A1"|"A1"|"A2"|"B1"|"B2"|"C1"|"C2", "units": [ { "title": "Unit N: Name", "grammar": [ { "point": string, "example": string } ], "vocabulary": [ { "en": string, "ko": string, "pos": string } ] } ] }',
      'Rules:',
      '- Keep printed unit titles when visible (including Unit numbers).',
      '- Grammar: 1 to 4 key points per unit, each with one short example sentence.',
      '- Vocabulary: target words/phrases students should learn. Skip page numbers, instructions, and publisher marks.',
      '- If Korean is printed, copy it. If not, give a simple Korean gloss.',
      '- pos is n, v, adj, adv, phr, or similar.',
      '- Prefer A1 for starter writing books unless the pages are clearly harder or easier.',
      '- If only some units are in the files, return only those units.',
      '- Do not skip the last lines or blanks at the bottom of a page.'
    ].filter(Boolean).join('\n');
  }

  async function callProvider(provider, apiKey, model, prompt, imageParts) {
    const AI = global.ActivityAI;
    if (!AI || !AI.generateJson) throw new Error('AI client is not loaded.');
    return AI.generateJson({
      provider: provider,
      model: model,
      apiKey: apiKey,
      prompt: prompt,
      imageParts: imageParts || [],
      temperature: 0.2
    });
  }

  const Analyze = {
    friendlyError: friendlyError,

    async inspectFiles(fileList, onProgress) {
      return prepareUploads(fileList, { onProgress: onProgress });
    },

    downloadText(filename, text) {
      const blob = new Blob([text || ''], { type: 'text/plain;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename || 'extracted-text.txt';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1500);
    },

    async analyze({ book, files, note, apiKey, provider, model, onProgress }) {
      const key = String(apiKey || '').trim();
      const chosenProvider = String(provider || 'gemini').trim() || 'gemini';
      if (!key) throw new Error('Paste an API key first.');
      if (typeof location !== 'undefined' && location.protocol === 'file:') {
        throw new Error(friendlyError(new Error('file')));
      }
      const prepared = await prepareUploads(files, { onProgress: onProgress });
      const Domain = global.ActivityDomain;
      if (!Domain || !Domain.normalizeBreakdown) {
        throw new Error('Curriculum system is not loaded.');
      }

      const batches = prepared.batches.slice();
      if (prepared.mode === 'images') {
        for (let i = 0; i < prepared.pdfFiles.length; i++) {
          const more = await rasterizePdfBatches(prepared.pdfFiles[i], onProgress);
          more.forEach((b) => batches.push(b));
        }
      }
      if (!batches.length) {
        throw new Error('Choose a PDF or photo first.');
      }

      async function sendBatch(batch, index, total) {
        reportProgress(onProgress, 'analyzing', index + 1, total,
          'Analyzing batch ' + (index + 1) + ' of ' + total + '…');
        const extra = String(note || '').trim() +
          (total > 1 ? ' (part ' + (index + 1) + ' of ' + total + ')' : '');
        const prompt = buildPrompt(book, extra, batch.kind === 'text' ? batch.text : '');
        const imageParts = batch.kind === 'images' ? (batch.parts || []) : [];
        return callProvider(chosenProvider, key, model, prompt, imageParts);
      }

      let combined = null;
      for (let i = 0; i < batches.length; i++) {
        try {
          const raw = await sendBatch(batches[i], i, batches.length);
          const norm = Domain.normalizeBreakdown(raw, book);
          if (!combined) combined = norm;
          else combined.units = Domain.mergeBreakdownUnits(combined, norm);
        } catch (err) {
          if (combined && /No units found/i.test(String(err && err.message ? err.message : err))) {
            continue;
          }
          throw err;
        }
      }
      if (!combined) throw new Error('No units found.');
      combined.source = 'ai-upload';
      return combined;
    }
  };

  global.ActivityAnalyze = Analyze;
})(typeof window !== 'undefined' ? window : globalThis);
