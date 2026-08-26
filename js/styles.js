/**
 * Activity style parser: turn an HTML file or written description into a reusable template.
 * Saved styles live in ActivityDomain (localStorage). Generate fills them from book breakdowns.
 */
(function (global) {
  'use strict';

  const MAX_HTML_CHARS = 14000;
  const SCHEMAS = ['vocabByUnit', 'matchPairs', 'unitQuestions', 'unitClues', 'genericPack'];

  function clone(v) {
    return JSON.parse(JSON.stringify(v));
  }

  function readFileText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Could not read the HTML file.'));
      reader.readAsText(file);
    });
  }

  function samplePack(schema, title) {
    const vocabByUnit = {
      u1: {
        name: 'Sample Unit',
        words: [
          { en: 'apple', ko: '사과' },
          { en: 'banana', ko: '바나나' },
          { en: 'cat', ko: '고양이' },
          { en: 'dog', ko: '강아지' },
          { en: 'run', ko: '달리다' },
          { en: 'jump', ko: '뛰다' }
        ]
      }
    };
    const unitsQuestions = {
      '1': {
        title: 'Sample Unit',
        description: 'Sample',
        questions: [
          { text: 'I have a cat.', correct: true, explanation: 'Good.' },
          { text: 'I has a cat.', correct: false, explanation: 'Use have with I.' },
          { text: 'She is happy.', correct: true, explanation: 'Good.' },
          { text: 'She are happy.', correct: false, explanation: 'Use is with she.' }
        ]
      }
    };
    const unitsClues = {
      'Sample Unit': [
        { q: 'A red fruit', a: 'apple' },
        { q: 'A yellow fruit', a: 'banana' },
        { q: 'An animal that meows', a: 'cat' },
        { q: 'An animal that barks', a: 'dog' },
        { q: 'Move fast on feet', a: 'run' }
      ]
    };
    const genericPack = {
      u1: {
        name: 'Sample Unit',
        items: [
          { prompt: '사과', answer: 'apple' },
          { prompt: '바나나', answer: 'banana' },
          { prompt: '고양이', answer: 'cat' },
          { prompt: '강아지', answer: 'dog' }
        ]
      }
    };
    const base = { title: title || 'Sample Activity', cefr: 'A1', bookId: 'sample', activityId: 'sample' };
    if (schema === 'vocabByUnit' || schema === 'matchPairs') return Object.assign({}, base, { vocabByUnit: vocabByUnit });
    if (schema === 'unitQuestions') return Object.assign({}, base, { units: unitsQuestions });
    if (schema === 'unitClues') return Object.assign({}, base, { units: unitsClues });
    return Object.assign({}, base, { genericPack: genericPack, units: genericPack });
  }

  function injectPreview(templateHtml, schema, title) {
    const pack = samplePack(schema, title);
    let html = String(templateHtml || '')
      .replace(/__TITLE_JSON__/g, JSON.stringify(pack.title))
      .replace(/__TITLE__/g, pack.title)
      .replace(/__LEVEL_JSON__/g, JSON.stringify('Sample'))
      .replace(/__BOOK_JSON__/g, JSON.stringify('Sample Book'))
      .replace(/__DOWNLOAD_NAME_JSON__/g, JSON.stringify('Sample.html'))
      .replace(/__STORAGE_KEY_JSON__/g, JSON.stringify('style_preview_'));
    if (schema === 'vocabByUnit' || schema === 'matchPairs') {
      html = html.replace(/__VOCAB_BY_UNIT__/g, JSON.stringify(pack.vocabByUnit).replace(/</g, '\\u003c'));
    }
    if (schema === 'unitQuestions' || schema === 'unitClues') {
      html = html.replace(/__UNIT_DATA__/g, JSON.stringify(pack.units).replace(/</g, '\\u003c'));
    }
    if (schema === 'genericPack') {
      html = html.replace(/__GENERIC_PACK__/g, JSON.stringify(pack.genericPack).replace(/</g, '\\u003c'));
    }
    return html;
  }

  function ensurePlaceholders(html, schema) {
    let out = String(html || '');
    if (!/__TITLE__/.test(out) && !/__TITLE_JSON__/.test(out)) {
      out = out.replace(/<title>[\s\S]*?<\/title>/i, '<title>__TITLE__</title>');
      if (!/<title>/i.test(out)) {
        out = out.replace(/<head([^>]*)>/i, '<head$1><title>__TITLE__</title>');
      }
    }
    if ((schema === 'vocabByUnit' || schema === 'matchPairs') && !/__VOCAB_BY_UNIT__/.test(out)) {
      throw new Error('Template must include __VOCAB_BY_UNIT__ so Generate can fill word lists.');
    }
    if ((schema === 'unitQuestions' || schema === 'unitClues') && !/__UNIT_DATA__/.test(out)) {
      throw new Error('Template must include __UNIT_DATA__ so Generate can fill questions or clues.');
    }
    if (schema === 'genericPack' && !/__GENERIC_PACK__/.test(out)) {
      throw new Error('Template must include __GENERIC_PACK__ so Generate can fill prompts and answers.');
    }
    return out;
  }

  function normalizeSchema(raw) {
    const schema = String(raw || '').trim();
    return SCHEMAS.indexOf(schema) >= 0 ? schema : 'genericPack';
  }

  function truncateHtml(html) {
    const text = String(html || '');
    if (text.length <= MAX_HTML_CHARS) return text;
    return text.slice(0, MAX_HTML_CHARS) + '\n<!-- truncated for API length -->';
  }

  function descriptionPrompt(description) {
    return [
      'You create a single-file classroom activity HTML template for Korean elementary English teachers.',
      'The teacher described this game:',
      String(description || '').trim(),
      'Return JSON only (no markdown fences):',
      '{',
      '  "name": string,',
      '  "description": string,',
      '  "contentSchema": "vocabByUnit"|"matchPairs"|"unitQuestions"|"unitClues"|"genericPack",',
      '  "templateHtml": string',
      '}',
      'Rules for templateHtml:',
      '- Complete HTML5 document with inline CSS and JS (no external scripts except optional Google Fonts).',
      '- Soft dark classroom UI, large buttons, works on laptop and projector.',
      '- Must include placeholders depending on contentSchema:',
      '  vocabByUnit or matchPairs → const VOCAB_BY_UNIT = __VOCAB_BY_UNIT__; and title __TITLE__ / __TITLE_JSON__',
      '  unitQuestions or unitClues → const UNIT_DATA = __UNIT_DATA__; and title placeholders',
      '  genericPack → const GENERIC_PACK = __GENERIC_PACK__; and title placeholders',
      '- Read the injected data and render a playable or printable activity.',
      '- Do not invent a backend. Offline-only.',
      '- Keep the HTML under ~200 lines if possible.'
    ].join('\n');
  }

  function htmlPrompt(htmlExcerpt, titleHint) {
    return [
      'You convert an existing classroom activity HTML into a reusable template for Activity Loader.',
      'Prefer one contentSchema: vocabByUnit, matchPairs, unitQuestions, unitClues, or genericPack.',
      'Return JSON only:',
      '{ "name": string, "description": string, "contentSchema": string, "templateHtml": string, "confidence": number, "reason": string }',
      'Replace concrete title text with __TITLE__ / __TITLE_JSON__.',
      'Replace the main content data object with __VOCAB_BY_UNIT__, __UNIT_DATA__, or __GENERIC_PACK__ matching the schema.',
      'Keep the game UI and rules. Soft dark styling is fine.',
      'File title hint: ' + (titleHint || 'Unknown'),
      'HTML excerpt:',
      htmlExcerpt
    ].join('\n');
  }

  function normalizeResult(raw, source) {
    const name = String(raw && raw.name ? raw.name : 'Custom Activity').trim() || 'Custom Activity';
    const schema = normalizeSchema(raw && raw.contentSchema);
    let templateHtml = String(raw && raw.templateHtml ? raw.templateHtml : '').trim();
    if (!templateHtml) throw new Error('AI did not return a templateHtml field.');
    if (/^```/.test(templateHtml)) {
      const fence = templateHtml.match(/```(?:html)?\s*([\s\S]*?)```/i);
      if (fence) templateHtml = fence[1].trim();
    }
    templateHtml = ensurePlaceholders(templateHtml, schema);
    return {
      name: name,
      description: String(raw && raw.description ? raw.description : '').trim(),
      contentSchema: schema,
      templateHtml: templateHtml,
      source: source,
      confidence: Math.max(0.1, Math.min(1, Number(raw && raw.confidence != null ? raw.confidence : 0.7))),
      reason: String(raw && raw.reason ? raw.reason : '').trim(),
      previewHtml: injectPreview(templateHtml, schema, name)
    };
  }

  function localFromImporter(inspected) {
    if (!inspected || !inspected.templateHtml || !inspected.schema) return null;
    if (inspected.confidence < 0.8) return null;
    const schemaMap = {
      unitQuestions: 'unitQuestions',
      unitClues: 'unitClues',
      vocabByUnit: 'vocabByUnit'
    };
    const schema = schemaMap[inspected.schema];
    if (!schema) return null;
    const name = String(inspected.title || 'Imported Activity').trim();
    const templateHtml = ensurePlaceholders(inspected.templateHtml, schema);
    return {
      name: name,
      description: 'Imported from HTML (' + inspected.schema + ').',
      contentSchema: schema,
      templateHtml: templateHtml,
      source: 'local-html',
      confidence: inspected.confidence,
      reason: inspected.evidence || 'Matched a known content shape locally.',
      previewHtml: injectPreview(templateHtml, schema, name)
    };
  }

  const Styles = {
    samplePack: samplePack,
    injectPreview: injectPreview,

    async parseDescription(description, opts) {
      const text = String(description || '').trim();
      if (text.length < 12) throw new Error('Write a short description of the game first (at least a sentence).');
      const AI = global.ActivityAI;
      if (!AI || !AI.generateJson) throw new Error('AI client is not loaded.');
      const raw = await AI.generateJson({
        provider: opts && opts.provider,
        model: opts && opts.model,
        apiKey: opts && opts.apiKey,
        prompt: descriptionPrompt(text),
        temperature: 0.35
      });
      return normalizeResult(raw, 'ai-description');
    },

    async parseHtmlFile(file, opts) {
      if (!file) throw new Error('Choose an HTML activity file first.');
      const html = await readFileText(file);
      if (!/\.html?$/i.test(file.name || '') && !/<html/i.test(html)) {
        throw new Error('Use an .html activity file.');
      }
      if (global.ActivityImporter && global.ActivityImporter.inspectFile) {
        try {
          const inspected = await global.ActivityImporter.inspectFile(file);
          const local = localFromImporter(inspected);
          if (local) return local;
        } catch (e) {
          // Fall through to AI.
        }
      }
      const AI = global.ActivityAI;
      if (!AI || !AI.generateJson) throw new Error('AI client is not loaded.');
      const titleHint = (html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || file.name || '';
      const raw = await AI.generateJson({
        provider: opts && opts.provider,
        model: opts && opts.model,
        apiKey: opts && opts.apiKey,
        prompt: htmlPrompt(truncateHtml(html), String(titleHint).replace(/<[^>]+>/g, '').trim()),
        temperature: 0.25
      });
      return normalizeResult(raw, 'ai-html');
    },

    saveParsed(parsed, id) {
      const Domain = global.ActivityDomain;
      if (!Domain || !Domain.saveStyle) throw new Error('Curriculum system is not loaded.');
      if (!parsed || !parsed.previewHtml) throw new Error('Parse and preview the style before saving.');
      return Domain.saveStyle({
        id: id,
        name: parsed.name,
        description: parsed.description,
        contentSchema: parsed.contentSchema,
        templateHtml: parsed.templateHtml,
        source: parsed.source
      });
    }
  };

  global.ActivityStyles = Styles;
})(typeof window !== 'undefined' ? window : globalThis);
