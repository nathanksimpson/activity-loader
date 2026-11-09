/**
 * Import an existing activity HTML file, extract known content schemas locally,
 * and fall back to AI only when confidence is low.
 */
(function (global) {
  'use strict';

  const STORAGE_IMPORTED = 'activityLoader.importedTemplates.v1';

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function readFileText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Could not read ' + (file && file.name ? file.name : 'the HTML file') + '.'));
      reader.readAsText(file);
    });
  }

  function readStore() {
    return readJson(STORAGE_IMPORTED, {});
  }

  function writeStore(store) {
    writeJson(STORAGE_IMPORTED, store);
  }

  function clone(v) {
    return JSON.parse(JSON.stringify(v));
  }

  function safeEvalObject(source) {
    return Function('"use strict"; return (' + source + ');')();
  }

  function extractScripts(html) {
    const out = [];
    const re = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    while ((match = re.exec(html))) {
      const text = String(match[1] || '').trim();
      if (text) out.push(text);
    }
    return out;
  }

  function extractTitle(html) {
    const vars = [
      /(?:const|let|var)\s+(?:TITLE|gameTitle|title)\s*=\s*(['"`])([\s\S]*?)\1/,
      /<title>([\s\S]*?)<\/title>/i,
      /<h1[^>]*>([\s\S]*?)<\/h1>/i
    ];
    for (let i = 0; i < vars.length; i++) {
      const match = html.match(vars[i]);
      if (match) return String(match[2] || match[1] || '').replace(/<[^>]+>/g, '').trim();
    }
    return '';
  }

  function normalizeJumpingOxUnits(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
    const units = {};
    let count = 0;
    Object.keys(raw).forEach((key, idx) => {
      const unit = raw[key];
      if (!unit || !Array.isArray(unit.questions)) return;
      units[String(idx + 1)] = {
        title: String(unit.title || ('Unit ' + (idx + 1))).trim(),
        description: String(unit.description || (unit.questions.length + ' questions')).trim(),
        questions: unit.questions.map((q) => ({
          text: String(q.text || '').trim(),
          correct: !!q.correct,
          explanation: String(q.explanation || '').trim()
        })).filter((q) => q.text && q.explanation)
      };
      count += units[String(idx + 1)].questions.length;
    });
    return count ? units : null;
  }

  function normalizeJeopardyUnits(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
    const units = {};
    let count = 0;
    Object.keys(raw).forEach((key) => {
      const list = raw[key];
      if (!Array.isArray(list)) return;
      const clean = list.map((item) => ({
        q: String(item && item.q ? item.q : '').trim(),
        a: String(item && item.a ? item.a : '').trim()
      })).filter((item) => item.q && item.a);
      if (!clean.length) return;
      units[String(key).trim()] = clean;
      count += clean.length;
    });
    return count ? units : null;
  }

  function normalizeVocabByUnit(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
    const out = {};
    let count = 0;
    Object.keys(raw).forEach((key) => {
      const unit = raw[key];
      const words = Array.isArray(unit && unit.words) ? unit.words : [];
      const clean = words.map((word) => ({
        en: String(word && word.en ? word.en : '').trim(),
        ko: String(word && word.ko ? word.ko : '').trim()
      })).filter((word) => word.en);
      if (!clean.length) return;
      out[String(key).trim()] = {
        name: String(unit && unit.name ? unit.name : key).trim(),
        words: clean
      };
      count += clean.length;
    });
    return count ? out : null;
  }

  function detectLocal(html) {
    const scripts = extractScripts(html);
    const candidates = [
      { name: 'UNIT_DATA', regex: /(?:const|let|var)\s+UNIT_DATA\s*=\s*([\s\S]*?);/ },
      { name: 'VUNIT_DATA', regex: /(?:const|let|var)\s+VOCAB_BY_UNIT\s*=\s*([\s\S]*?);/ },
      { name: 'VUNIT_DATA_ALT', regex: /(?:const|let|var)\s+vocabByUnit\s*=\s*([\s\S]*?);/ },
      { name: 'UNITS', regex: /(?:const|let|var)\s+units\s*=\s*([\s\S]*?);/ }
    ];

    for (let s = 0; s < scripts.length; s++) {
      const script = scripts[s];
      for (let i = 0; i < candidates.length; i++) {
        const item = candidates[i];
        const match = script.match(item.regex);
        if (!match) continue;
        try {
          const parsed = safeEvalObject(match[1]);
          const jumping = normalizeJumpingOxUnits(parsed);
          if (jumping) {
            return {
              source: 'local',
              confidence: item.name === 'UNIT_DATA' ? 0.97 : 0.84,
              detectedType: 'jumpingOx',
              schema: 'unitQuestions',
              title: extractTitle(html) || 'Imported Jumping OX',
              pack: { title: extractTitle(html) || 'Imported Jumping OX', units: jumping },
              templateHtml: html.replace(match[1], '__UNIT_DATA__'),
              evidence: 'Detected unit question data in script.'
            };
          }
          const jeopardy = normalizeJeopardyUnits(parsed && parsed.units ? parsed.units : parsed);
          if (jeopardy) {
            return {
              source: 'local',
              confidence: 0.88,
              detectedType: 'jeopardy',
              schema: 'unitClues',
              title: extractTitle(html) || 'Imported Jeopardy',
              pack: { title: extractTitle(html) || 'Imported Jeopardy', units: jeopardy },
              templateHtml: html.replace(match[1], '__UNIT_DATA__'),
              evidence: 'Detected clue units in script.'
            };
          }
          const vocab = normalizeVocabByUnit(parsed && parsed.vocabByUnit ? parsed.vocabByUnit : parsed);
          if (vocab) {
            return {
              source: 'local',
              confidence: item.name.indexOf('VUNIT') >= 0 ? 0.97 : 0.82,
              detectedType: 'vocabulary',
              schema: 'vocabByUnit',
              title: extractTitle(html) || 'Imported Vocabulary',
              pack: { title: extractTitle(html) || 'Imported Vocabulary', vocabByUnit: vocab },
              templateHtml: html.replace(match[1], '__VOCAB_BY_UNIT__'),
              evidence: 'Detected vocabulary-by-unit data in script.'
            };
          }
        } catch (e) {
          // Keep trying other candidates.
        }
      }
    }

    return {
      source: 'local',
      confidence: 0.18,
      detectedType: '',
      schema: '',
      title: extractTitle(html) || 'Imported Activity',
      pack: null,
      templateHtml: html,
      evidence: 'Could not confidently map this HTML to current schemas.'
    };
  }

  function applyTemplatePlaceholders(html, title, schema) {
    let out = String(html || '');
    const safeTitle = String(title || '').trim();
    if (safeTitle) {
      out = out.replace(new RegExp(safeTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '__TITLE__');
    }
    out = out
      .replace(/(?:const|let|var)\s+(?:TITLE|gameTitle|title)\s*=\s*(['"`])[\s\S]*?\1/, 'const TITLE = __TITLE_JSON__')
      .replace(/<title>[\s\S]*?<\/title>/i, '<title>__TITLE__</title>');
    if (schema === 'unitQuestions' || schema === 'unitClues') {
      out = out.replace(/(?:const|let|var)\s+UNIT_DATA\s*=\s*__UNIT_DATA__/, 'const UNIT_DATA = __UNIT_DATA__');
      out = out.replace(/(?:const|let|var)\s+units\s*=\s*__UNIT_DATA__/, 'const UNIT_DATA = __UNIT_DATA__');
    }
    if (schema === 'vocabByUnit') {
      out = out.replace(/(?:const|let|var)\s+VOCAB_BY_UNIT\s*=\s*__VOCAB_BY_UNIT__/, 'const VOCAB_BY_UNIT = __VOCAB_BY_UNIT__');
      out = out.replace(/(?:const|let|var)\s+vocabByUnit\s*=\s*__VOCAB_BY_UNIT__/, 'const VOCAB_BY_UNIT = __VOCAB_BY_UNIT__');
    }
    return out;
  }

  async function callGemini(apiKey, model, prompt) {
    const AI = global.ActivityAI;
    if (!AI || !AI.generateJson) throw new Error('AI client is not loaded.');
    return AI.generateJson({ provider: 'gemini', model: model, apiKey: apiKey, prompt: prompt, temperature: 0.2 });
  }

  async function callOpenAi(apiKey, model, prompt) {
    const AI = global.ActivityAI;
    if (!AI || !AI.generateJson) throw new Error('AI client is not loaded.');
    return AI.generateJson({ provider: 'openai', model: model, apiKey: apiKey, prompt: prompt, temperature: 0.2 });
  }

  function buildApiPrompt(candidates, title) {
    return [
      'You are helping convert a classroom activity HTML file into an existing known schema.',
      'Choose only one schema: unitQuestions, unitClues, or vocabByUnit.',
      'Return JSON only:',
      '{ "schema": "unitQuestions"|"unitClues"|"vocabByUnit", "detectedType": "jumpingOx"|"jeopardy"|"vocabulary", "title": string, "confidence": number, "pack": object, "reason": string }',
      'The file title seems to be: ' + (title || 'Unknown'),
      'Only use the candidate snippets below, not assumptions about missing code:',
      candidates.join('\n\n---\n\n')
    ].join('\n');
  }

  function normalizeApiResult(raw) {
    const schema = String(raw && raw.schema ? raw.schema : '').trim();
    const title = String(raw && raw.title ? raw.title : 'Imported Activity').trim();
    if (schema === 'unitQuestions') {
      const units = normalizeJumpingOxUnits(raw && raw.pack && raw.pack.units ? raw.pack.units : raw && raw.pack);
      if (!units) throw new Error('API helper could not normalize unit questions.');
      return {
        source: 'api-helper',
        confidence: Math.max(0.2, Math.min(1, Number(raw.confidence || 0.65))),
        detectedType: 'jumpingOx',
        schema: schema,
        title: title,
        pack: { title: title, units: units },
        evidence: String(raw.reason || 'Mapped by API helper.')
      };
    }
    if (schema === 'unitClues') {
      const units = normalizeJeopardyUnits(raw && raw.pack && raw.pack.units ? raw.pack.units : raw && raw.pack);
      if (!units) throw new Error('API helper could not normalize unit clues.');
      return {
        source: 'api-helper',
        confidence: Math.max(0.2, Math.min(1, Number(raw.confidence || 0.65))),
        detectedType: 'jeopardy',
        schema: schema,
        title: title,
        pack: { title: title, units: units },
        evidence: String(raw.reason || 'Mapped by API helper.')
      };
    }
    if (schema === 'vocabByUnit') {
      const vocabByUnit = normalizeVocabByUnit(raw && raw.pack && raw.pack.vocabByUnit ? raw.pack.vocabByUnit : raw && raw.pack);
      if (!vocabByUnit) throw new Error('API helper could not normalize vocab by unit.');
      return {
        source: 'api-helper',
        confidence: Math.max(0.2, Math.min(1, Number(raw.confidence || 0.65))),
        detectedType: 'vocabulary',
        schema: schema,
        title: title,
        pack: { title: title, vocabByUnit: vocabByUnit },
        evidence: String(raw.reason || 'Mapped by API helper.')
      };
    }
    throw new Error('API helper returned an unsupported schema.');
  }

  const Importer = {
    readStore: readStore,

    getTemplate(activityId) {
      const store = readStore();
      return store[String(activityId || '').trim()] || null;
    },

    saveTemplate(activityId, asset) {
      const store = readStore();
      store[String(activityId || '').trim()] = clone(asset);
      writeStore(store);
      return store[String(activityId || '').trim()];
    },

    async inspectFile(file) {
      if (!file) throw new Error('Choose an HTML activity file first.');
      const html = await readFileText(file);
      if (!/\.html?$/i.test(file.name || '')) {
        throw new Error('Use an .html activity file.');
      }
      const result = detectLocal(html);
      result.fileName = file.name || 'activity.html';
      result.html = html;
      result.templateHtml = applyTemplatePlaceholders(result.templateHtml, result.title, result.schema);
      return result;
    },

    async improveWithApi(inspected, opts) {
      if (!inspected || !inspected.html) throw new Error('Inspect the HTML file first.');
      const Domain = global.ActivityDomain;
      const provider = String((opts && opts.provider) || (Domain && Domain.getSelectedAiProvider ? Domain.getSelectedAiProvider() : 'gemini')).trim();
      const model = (opts && opts.model) || (Domain && Domain.getSelectedModel ? Domain.getSelectedModel(provider) : '');
      const apiKey = String((opts && opts.apiKey) || (Domain && Domain.getApiKey ? Domain.getApiKey(provider) : '')).trim();
      if (!apiKey) throw new Error('Paste an API key first.');
      const scripts = extractScripts(inspected.html).slice(0, 4);
      const candidates = scripts.length ? scripts : [inspected.html.slice(0, 4000)];
      const prompt = buildApiPrompt(candidates, inspected.title);
      const AI = global.ActivityAI;
      const raw = AI && AI.generateJson
        ? await AI.generateJson({ provider: provider, model: model, apiKey: apiKey, prompt: prompt, temperature: 0.2 })
        : (provider === 'openai'
          ? await callOpenAi(apiKey, model, prompt)
          : await callGemini(apiKey, model, prompt));
      const normalized = normalizeApiResult(raw);
      normalized.fileName = inspected.fileName;
      normalized.html = inspected.html;
      normalized.templateHtml = applyTemplatePlaceholders(inspected.html, normalized.title, normalized.schema);
      return normalized;
    }
  };

  global.ActivityImporter = Importer;
})(typeof window !== 'undefined' ? window : globalThis);
