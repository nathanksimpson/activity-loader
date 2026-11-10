/**
 * Activity types + curriculum books (CEFR lives on curriculum).
 */
(function (global) {
  'use strict';

  const CEFR_OPTIONS = ['Pre-A1', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const STORAGE_CURRICULA = 'activityLoader.curriculaOverlay.v1';
  const STORAGE_BREAKDOWNS = 'activityLoader.breakdowns.v1';
  const STORAGE_BOOKS_ADDED = 'activityLoader.booksAdded.v1';
  const STORAGE_KEY = 'activityLoader.geminiKey';
  const STORAGE_AI_SETTINGS = 'activityLoader.aiSettings.v1';
  const STORAGE_STYLES = 'activityLoader.activityStyles.v1';
  const GENERATABLE_IDS = ['jumpingOx', 'jeopardy', 'vocabulary', 'teamMatch', 'charades', 'quizQuizTrade', 'fanNPick', 'findSomeoneWho', 'showdown', 'rallyCoach', 'sentenceScramble', 'gapFill', 'writingCards'];
  const CONTENT_SCHEMAS = ['vocabByUnit', 'matchPairs', 'unitQuestions', 'unitClues', 'genericPack'];
  const AI_PROVIDERS = [
    {
      id: 'gemini',
      label: 'Google Gemini',
      analyzeSupportsPdf: true,
      models: [
        { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
        { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' }
      ]
    },
    {
      id: 'openai',
      label: 'OpenAI',
      analyzeSupportsPdf: true,
      models: [
        { id: 'gpt-4o-mini', label: 'GPT-4o mini' },
        { id: 'gpt-4o', label: 'GPT-4o' },
        { id: 'gpt-4.1', label: 'GPT-4.1' }
      ]
    },
    {
      id: 'anthropic',
      label: 'Anthropic Claude',
      analyzeSupportsPdf: true,
      models: [
        { id: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5' },
        { id: 'claude-haiku-4-5', label: 'Claude Haiku 4.5' },
        { id: 'claude-3-5-haiku-latest', label: 'Claude 3.5 Haiku' }
      ]
    },
    {
      id: 'custom',
      label: 'Custom (OpenAI-compatible)',
      analyzeSupportsPdf: false,
      custom: true,
      models: []
    }
  ];

  const FACTORY_ACTIVITIES = {
    version: 1,
    types: [
      { id: 'jumpingOx', name: 'Jumping OX', description: 'Classroom Jumping OX: unit cards, runner jumps O or X, reveal, Mistake Spotted, teacher config.', template: 'templates/jumpingOx.template.html', contentSchema: 'unitQuestions', cefrAgnostic: true },
      { id: 'jeopardy', name: 'Jeopardy', description: 'Classroom canvas Jeopardy board. Categories are book units.', template: 'templates/jeopardy.template.html', contentSchema: 'unitClues', cefrAgnostic: true },
      { id: 'vocabulary', name: 'Vocabulary', description: 'Classroom timer and flip-card vocab game with team scores.', template: 'templates/vocabulary.template.html', contentSchema: 'vocabByUnit', cefrAgnostic: true },
      { id: 'teamMatch', name: 'Team Match', description: 'Memory match of English and Korean.', template: 'templates/teamMatch.template.html', contentSchema: 'matchPairs', cefrAgnostic: true },
      { id: 'charades', name: 'Charades', description: 'Act out unit vocabulary.', template: 'templates/charades.template.html', contentSchema: 'vocabByUnit', cefrAgnostic: true },
      { id: 'quizQuizTrade', name: 'Quiz-Quiz-Trade', description: 'Print fold cards: question on front, answer on back.', template: 'templates/quizQuizTrade.template.html', contentSchema: 'vocabByUnit', cefrAgnostic: true },
      { id: 'fanNPick', name: 'Fan-N-Pick', description: 'Numbered Q/A cards with 4 student roles.', template: 'templates/fanNPick.template.html', contentSchema: 'vocabByUnit', cefrAgnostic: true },
      { id: 'findSomeoneWho', name: 'Find Someone Who', description: 'Printable grid worksheet.', template: 'templates/findSomeoneWho.template.html', contentSchema: 'vocabByUnit', cefrAgnostic: true },
      { id: 'showdown', name: 'Showdown', description: 'Team question cards — Showdown and compare.', template: 'templates/showdown.template.html', contentSchema: 'vocabByUnit', cefrAgnostic: true },
      { id: 'rallyCoach', name: 'RallyCoach', description: 'Pair cards — one solves, the other coaches.', template: 'templates/rallyCoach.template.html', contentSchema: 'vocabByUnit', cefrAgnostic: true },
      { id: 'sentenceScramble', name: 'Sentence Scramble', description: 'Drag shuffled words into order; hint, check, team points.', template: 'templates/sentenceScramble.template.html', contentSchema: 'unitSentences', cefrAgnostic: true },
      { id: 'gapFill', name: 'Gap Fill', description: 'Model writing passage with numbered blanks to reveal; word bank and teams.', template: 'templates/gapFill.template.html', contentSchema: 'unitPassages', cefrAgnostic: true },
      { id: 'writingCards', name: 'Writing Card Spinner', description: 'Fill-in writing frames: spin silly words, say it, or type class ideas.', template: 'templates/writingCards.template.html', contentSchema: 'writingCards', cefrAgnostic: true }
    ]
  };

  const FACTORY_CURRICULA = {
    version: 1,
    cefrOptions: CEFR_OPTIONS.slice(),
    books: [
      {
        id: 'write-now-1', title: 'Write Now 1', series: 'write-now', levelIds: ['Green'], cefr: 'A1',
        units: ['Unit 1: My Family and I', 'Unit 2: My Friend Daisy', 'Unit 3: School Market Day', 'Unit 4: What a Messy Room!', 'Unit 5: My Favorite Thing', 'Unit 6: Welcome to My Town!', 'Unit 7: Different but Together', 'Unit 8: My Busy Day'],
        sources: ['Write Now 1 vocab lists', 'SB / WB answer keys']
      },
      {
        id: 'early-writers-1', title: 'Early Writers 1', series: 'early-writers', levelIds: ['Green'], cefr: 'A1',
        units: ['Unit 1: About Me', 'Unit 2: My Family', 'Unit 3: My Monster', 'Unit 4: Wanted', 'Unit 5: My Room', 'Unit 6: My Friend and I', 'Unit 7: My Favorite Season', 'Unit 8: Everyday Life'],
        sources: ['Early Writers 1 offline Jumping OX bank']
      },
      { id: 'write-right-1', title: 'Write Right 1', series: 'write-right', levelIds: ['Green'], cefr: 'A1', units: [], sources: [] },
      { id: 'best-writing-starter-1', title: 'The Best Writing Starter 1', series: 'best-writing-starter', levelIds: ['Green'], cefr: 'A1', units: [], sources: [] },
      {
        id: 'write-now-2', title: 'Write Now 2', series: 'write-now', levelIds: ['Blue'], cefr: 'A1',
        units: ['Unit 1: I Can Do It by Myself', 'Unit 2: We\'re on a Picnic', 'Unit 3: What Do You Do After School?', 'Unit 4: When I Grow Up', 'Unit 5: My Secret Closet', 'Unit 6: My Favorite Food', 'Unit 7: Drawing My Feelings', 'Unit 8: My Robot Friend'],
        sources: ['Write Now 2 vocab lists']
      },
      {
        id: 'early-writers-2', title: 'Early Writers 2', series: 'early-writers', levelIds: ['Blue'], cefr: 'A1',
        units: ['Unit 1: My School', 'Unit 2: My Style', 'Unit 3: My Special Recipe', 'Unit 4: My Birthday', 'Unit 5: At the Park', 'Unit 6: Last Winter', 'Unit 7: My Dream', 'Unit 8: How to Get There'],
        sources: ['Early Writers 2 OX sentence bank']
      }
    ]
  };

  function clone(v) { return JSON.parse(JSON.stringify(v)); }

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function defaultAiSettings() {
    return {
      provider: 'gemini',
      modelByProvider: {
        gemini: 'gemini-2.0-flash',
        openai: 'gpt-4o-mini',
        anthropic: 'claude-sonnet-4-5',
        custom: ''
      },
      apiKeys: {
        gemini: localStorage.getItem(STORAGE_KEY) || '',
        openai: '',
        anthropic: '',
        custom: ''
      },
      custom: {
        baseUrl: '',
        model: '',
        extraHeaderName: '',
        extraHeaderValue: ''
      }
    };
  }

  function slugifyStyleId(name) {
    const base = String(name || 'style')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'style';
    return 'style-' + base;
  }

  const Domain = {
    activities: FACTORY_ACTIVITIES,
    curricula: FACTORY_CURRICULA,
    factoryBookIds: {},
    source: 'embedded',

    async init() {
      try {
        const [a, c] = await Promise.all([
          fetch('data/activities.json', { cache: 'no-store' }),
          fetch('data/curricula.json', { cache: 'no-store' })
        ]);
        if (a.ok) this.activities = await a.json();
        if (c.ok) this.curricula = await c.json();
        if (a.ok && c.ok) this.source = 'json';
      } catch (e) {
        this.activities = FACTORY_ACTIVITIES;
        this.curricula = clone(FACTORY_CURRICULA);
        this.source = 'embedded';
      }
      this.factoryBookIds = {};
      (this.curricula.books || []).forEach((book) => {
        this.factoryBookIds[book.id] = true;
      });
      this.applyCurriculaOverlay();
      if (typeof global.ActivityLibrary !== 'undefined') {
        try {
          const status = await global.ActivityLibrary.probe();
          if (status.available) {
            const payload = await global.ActivityLibrary.loadSharedLibrary();
            this.mergeServerLibrary(payload);
          }
        } catch (e) {
          console.warn('Team library load failed:', e);
        }
      }
      return this;
    },

    mergeServerLibrary(payload) {
      if (!payload || typeof payload !== 'object') return { merged: 0 };
      const serverBreakdowns = payload.breakdowns && typeof payload.breakdowns === 'object' ? payload.breakdowns : {};
      const serverOverlay = payload.curriculaOverlay && typeof payload.curriculaOverlay === 'object' ? payload.curriculaOverlay : {};
      const local = readJson(STORAGE_BREAKDOWNS, {});
      let merged = 0;

      // Cloud copy is the source of truth for logged-in users: replace local breakdowns with server set.
      const Auth = global.ActivityAuth;
      if (Auth && Auth.isLoggedIn()) {
        Object.keys(local).forEach((id) => { delete local[id]; });
        Object.keys(serverBreakdowns).forEach((bookId) => {
          const server = serverBreakdowns[bookId];
          if (!server || !Array.isArray(server.units) || !server.units.length) return;
          local[bookId] = server;
          merged++;
        });
      } else {
        Object.keys(serverBreakdowns).forEach((bookId) => {
          const server = serverBreakdowns[bookId];
          const loc = local[bookId];
          if (!server || !Array.isArray(server.units) || !server.units.length) return;
          if (!loc || (Number(server.savedAt) || 0) >= (Number(loc.savedAt) || 0)) {
            local[bookId] = server;
            merged++;
          }
        });
      }
      localStorage.setItem(STORAGE_BREAKDOWNS, JSON.stringify(local));

      if (Auth && Auth.isLoggedIn()) {
        localStorage.setItem(STORAGE_CURRICULA, JSON.stringify(serverOverlay || {}));
      } else if (Object.keys(serverOverlay).length) {
        const overlay = readJson(STORAGE_CURRICULA, {});
        Object.keys(serverOverlay).forEach((bookId) => {
          overlay[bookId] = Object.assign({}, overlay[bookId], serverOverlay[bookId]);
        });
        localStorage.setItem(STORAGE_CURRICULA, JSON.stringify(overlay));
      }
      this.applyCurriculaOverlay();

      // Merge generated packs from server into generate storage when present
      if (payload.generatedPacks && typeof payload.generatedPacks === 'object' && global.ActivityGenerate && global.ActivityGenerate.mergeServerPacks) {
        global.ActivityGenerate.mergeServerPacks(payload.generatedPacks);
      }

      return { merged: merged, bookCount: Object.keys(serverBreakdowns).length };
    },

    applyCurriculaOverlay() {
      if (!Array.isArray(this.curricula.books)) this.curricula.books = [];
      const added = readJson(STORAGE_BOOKS_ADDED, []);
      (Array.isArray(added) ? added : []).forEach((book) => {
        if (!book || !book.id) return;
        if (!this.getBook(book.id)) this.curricula.books.push(clone(book));
      });
      const overlay = readJson(STORAGE_CURRICULA, {});
      (this.curricula.books || []).forEach((book) => {
        const patch = overlay[book.id];
        if (!patch) return;
        if (patch.cefr) book.cefr = patch.cefr;
        if (Array.isArray(patch.units) && patch.units.length) book.units = patch.units.slice();
      });
    },

    patchBookOverlay(bookId, patch) {
      const overlay = readJson(STORAGE_CURRICULA, {});
      overlay[bookId] = Object.assign({}, overlay[bookId], patch);
      localStorage.setItem(STORAGE_CURRICULA, JSON.stringify(overlay));
      const book = this.getBook(bookId);
      if (book && patch.cefr) book.cefr = patch.cefr;
      if (book && Array.isArray(patch.units)) book.units = patch.units.slice();
      return book;
    },

    getTypes() {
      return (this.activities && this.activities.types) || [];
    },

    getContentSchemas() {
      return CONTENT_SCHEMAS.slice();
    },

    getSavedStyles() {
      const data = readJson(STORAGE_STYLES, {});
      const list = data && Array.isArray(data.styles) ? data.styles : [];
      return list.filter((s) => s && s.id && s.templateHtml);
    },

    getSavedStyle(id) {
      return this.getSavedStyles().find((s) => s.id === id) || null;
    },

    saveStyle(style) {
      if (!style || !style.name || !style.templateHtml) {
        throw new Error('A saved style needs a name and HTML template.');
      }
      const schema = String(style.contentSchema || '').trim();
      if (CONTENT_SCHEMAS.indexOf(schema) < 0) {
        throw new Error('Choose a content shape: vocabByUnit, matchPairs, unitQuestions, unitClues, or genericPack.');
      }
      const clean = {
        id: String(style.id || slugifyStyleId(style.name)).trim(),
        name: String(style.name).trim(),
        description: String(style.description || '').trim(),
        contentSchema: schema,
        templateHtml: String(style.templateHtml),
        source: String(style.source || 'ai').trim(),
        createdAt: style.createdAt || Date.now(),
        updatedAt: Date.now()
      };
      if (!/^style-/.test(clean.id)) clean.id = 'style-' + clean.id.replace(/^style-/, '');
      const all = this.getSavedStyles().filter((s) => s.id !== clean.id);
      all.push(clean);
      localStorage.setItem(STORAGE_STYLES, JSON.stringify({ version: 1, styles: all }));
      return clean;
    },

    removeSavedStyle(id) {
      const all = this.getSavedStyles().filter((s) => s.id !== id);
      localStorage.setItem(STORAGE_STYLES, JSON.stringify({ version: 1, styles: all }));
      return all;
    },

    getGeneratableTypes() {
      const builtin = this.getTypes().filter((t) => GENERATABLE_IDS.indexOf(t.id) >= 0);
      const custom = this.getSavedStyles().map((style) => ({
        id: style.id,
        name: style.name,
        description: style.description || 'Custom activity style saved in this browser.',
        template: '(saved style)',
        contentSchema: style.contentSchema,
        cefrAgnostic: true,
        customStyle: true
      }));
      return builtin.concat(custom);
    },

    getType(id) {
      const builtin = this.getTypes().find((t) => t.id === id);
      if (builtin) return builtin;
      const style = this.getSavedStyle(id);
      if (!style) return null;
      return {
        id: style.id,
        name: style.name,
        description: style.description || '',
        template: '(saved style)',
        contentSchema: style.contentSchema,
        cefrAgnostic: true,
        customStyle: true
      };
    },

    getBooks() {
      return (this.curricula && this.curricula.books) || [];
    },

    getBook(id) {
      return this.getBooks().find((b) => b.id === id) || null;
    },

    getCefrOptions() {
      return (this.curricula && this.curricula.cefrOptions) || CEFR_OPTIONS;
    },

    setBookCefr(bookId, cefr) {
      const book = this.getBook(bookId);
      if (!book) throw new Error('Unknown book.');
      if (!this.getCefrOptions().includes(cefr)) throw new Error('Unknown CEFR level.');
      return this.patchBookOverlay(bookId, { cefr: cefr });
    },

    slugifyId(text) {
      return String(text || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9가-힣]+/gi, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 48) || ('book-' + Date.now());
    },

    isFactoryBook(id) {
      return !!this.factoryBookIds[id];
    },

    addBook(opts) {
      const title = String(opts && opts.title ? opts.title : '').trim();
      if (!title) throw new Error('Type a book title, for example Write Now 3.');
      const id = String(opts.id || this.slugifyId(title)).trim();
      const existing = this.getBook(id);
      if (existing) {
        if (this.isFactoryBook(id)) throw new Error('That book is already in the list.');
        return existing;
      }
      const levelIds = Array.isArray(opts.levelIds) ? opts.levelIds.filter(Boolean) : [];
      if (!levelIds.length) throw new Error('Pick a class level for this book.');
      const cefr = this.getCefrOptions().indexOf(opts.cefr) >= 0 ? opts.cefr : 'A1';
      const book = {
        id: id,
        title: title,
        series: String(opts.series || this.slugifyId(title).replace(/-\d+$/, '') || id),
        levelIds: levelIds,
        cefr: cefr,
        units: [],
        sources: [],
        added: true
      };
      this.curricula.books.push(book);
      const added = readJson(STORAGE_BOOKS_ADDED, []);
      added.push(clone(book));
      localStorage.setItem(STORAGE_BOOKS_ADDED, JSON.stringify(added));
      return book;
    },

    removeAddedBook(id) {
      if (this.isFactoryBook(id)) throw new Error('Built-in books cannot be removed here.');
      this.curricula.books = (this.curricula.books || []).filter((b) => b.id !== id);
      const added = readJson(STORAGE_BOOKS_ADDED, []).filter((b) => b && b.id !== id);
      localStorage.setItem(STORAGE_BOOKS_ADDED, JSON.stringify(added));
      const overlay = readJson(STORAGE_CURRICULA, {});
      delete overlay[id];
      localStorage.setItem(STORAGE_CURRICULA, JSON.stringify(overlay));
      const breakdowns = this.readBreakdowns();
      if (breakdowns[id]) {
        delete breakdowns[id];
        localStorage.setItem(STORAGE_BREAKDOWNS, JSON.stringify(breakdowns));
      }
    },

    readBreakdowns() {
      const data = readJson(STORAGE_BREAKDOWNS, {});
      return data && typeof data === 'object' ? data : {};
    },

    getBreakdown(bookId) {
      return this.readBreakdowns()[bookId] || null;
    },

    hasBreakdown(bookId) {
      const b = this.getBreakdown(bookId);
      return !!(b && Array.isArray(b.units) && b.units.length);
    },

    countBreakdownWords(breakdown) {
      if (!breakdown || !Array.isArray(breakdown.units)) return 0;
      return breakdown.units.reduce((n, unit) => n + ((unit.vocabulary || []).length), 0);
    },

    vocabByUnitFromBreakdown(breakdown) {
      const out = {};
      (breakdown && breakdown.units ? breakdown.units : []).forEach((unit, i) => {
        const words = [];
        const seen = {};
        (unit.vocabulary || []).forEach((word) => {
          const en = String(word && word.en ? word.en : '').trim();
          if (!en) return;
          const key = en.toLowerCase();
          if (seen[key]) return;
          seen[key] = true;
          words.push({
            en: en,
            ko: String(word.ko || '').trim()
          });
        });
        out['u' + (i + 1)] = {
          name: String(unit.title || ('Unit ' + (i + 1))),
          words: words
        };
      });
      return out;
    },

    normalizeBreakdown(raw, book) {
      if (!raw || typeof raw !== 'object') throw new Error('No units found.');
      const cefrOptions = this.getCefrOptions();
      const cefr = cefrOptions.indexOf(raw.cefr) >= 0
        ? raw.cefr
        : (book && book.cefr) || 'A1';
      const units = [];
      (Array.isArray(raw.units) ? raw.units : []).forEach((unit) => {
        if (!unit || typeof unit !== 'object') return;
        const title = String(unit.title || '').trim();
        if (!title) return;
        const grammar = [];
        (Array.isArray(unit.grammar) ? unit.grammar : []).forEach((g) => {
          const point = String(g && g.point ? g.point : '').trim();
          if (!point) return;
          grammar.push({
            point: point,
            example: String(g.example || '').trim()
          });
        });
        const vocabulary = [];
        const seen = {};
        (Array.isArray(unit.vocabulary) ? unit.vocabulary : []).forEach((w) => {
          const en = String(w && w.en ? w.en : '').trim();
          if (!en) return;
          const key = en.toLowerCase();
          if (seen[key]) return;
          seen[key] = true;
          vocabulary.push({
            en: en,
            ko: String(w.ko || '').trim(),
            pos: String(w.pos || '').trim()
          });
        });
        units.push({ title: title, grammar: grammar, vocabulary: vocabulary });
      });
      if (!units.length) throw new Error('No units found.');
      return {
        bookId: book ? book.id : String(raw.bookId || ''),
        title: String((raw.title || (book && book.title) || '')).trim(),
        cefr: cefr,
        source: raw.source || 'ai-upload',
        units: units,
        savedAt: Date.now()
      };
    },

    mergeBreakdownUnits(existing, incoming) {
      const byTitle = new Map();
      function addUnit(unit) {
        const key = String(unit.title || '').trim().toLowerCase();
        if (!key) return;
        const prev = byTitle.get(key);
        if (!prev) {
          byTitle.set(key, {
            title: unit.title,
            grammar: (unit.grammar || []).slice(),
            vocabulary: (unit.vocabulary || []).slice()
          });
          return;
        }
        const gSeen = {};
        prev.grammar.forEach((g) => { gSeen[String(g.point || '').toLowerCase()] = true; });
        (unit.grammar || []).forEach((g) => {
          const k = String(g.point || '').toLowerCase();
          if (!k || gSeen[k]) return;
          gSeen[k] = true;
          prev.grammar.push(g);
        });
        const vSeen = {};
        prev.vocabulary.forEach((w) => { vSeen[String(w.en || '').toLowerCase()] = true; });
        (unit.vocabulary || []).forEach((w) => {
          const k = String(w.en || '').toLowerCase();
          if (!k || vSeen[k]) return;
          vSeen[k] = true;
          prev.vocabulary.push(w);
        });
      }
      (existing && existing.units ? existing.units : []).forEach(addUnit);
      (incoming && incoming.units ? incoming.units : []).forEach(addUnit);
      return Array.from(byTitle.values());
    },

    saveBreakdown(bookId, breakdown, { merge = false, localOnly = false } = {}) {
      const book = this.getBook(bookId);
      if (!book) throw new Error('Unknown book.');
      const incoming = this.normalizeBreakdown(Object.assign({}, breakdown, { bookId: bookId }), book);
      const all = this.readBreakdowns();
      if (merge && all[bookId]) {
        incoming.units = this.mergeBreakdownUnits(all[bookId], incoming);
        incoming.source = 'ai-upload';
      }
      incoming.bookId = bookId;
      incoming.title = incoming.title || book.title;
      incoming.savedAt = Date.now();
      all[bookId] = incoming;
      localStorage.setItem(STORAGE_BREAKDOWNS, JSON.stringify(all));
      const unitTitles = incoming.units.map((u) => u.title);
      const patch = { units: unitTitles };
      if (incoming.cefr) patch.cefr = incoming.cefr;
      this.patchBookOverlay(bookId, patch);
      return incoming;
    },

    async saveBreakdownWithLibrary(bookId, breakdown, { merge = false } = {}) {
      const incoming = this.saveBreakdown(bookId, breakdown, { merge: merge, localOnly: true });
      const Library = global.ActivityLibrary;
      const Auth = global.ActivityAuth;
      if (Library && Library.isServerAvailable()) {
        if (!Auth || !Auth.isLoggedIn()) {
          const err = new Error('Please log in to save to your cloud library.');
          err.code = 'LOGIN_REQUIRED';
          throw err;
        }
        await Library.saveBreakdownToServer(bookId, incoming);
      }
      return incoming;
    },

    getAiProviders() {
      return clone(AI_PROVIDERS);
    },

    getAiProvider(providerId) {
      const id = String(providerId || '').trim() || 'gemini';
      return AI_PROVIDERS.find((provider) => provider.id === id) || AI_PROVIDERS[0];
    },

    getAiSettings() {
      const defaults = defaultAiSettings();
      const saved = readJson(STORAGE_AI_SETTINGS, {});
      const settings = Object.assign({}, defaults, saved || {});
      settings.modelByProvider = Object.assign({}, defaults.modelByProvider, settings.modelByProvider || {});
      settings.apiKeys = Object.assign({}, defaults.apiKeys, settings.apiKeys || {});
      settings.custom = Object.assign({}, defaults.custom, settings.custom || {});
      const provider = this.getAiProvider(settings.provider).id;
      settings.provider = provider;
      const providerInfo = this.getAiProvider(provider);
      if (provider === 'custom') {
        if (settings.custom.model) settings.modelByProvider.custom = settings.custom.model;
      } else {
        const currentModel = settings.modelByProvider[provider];
        const allowed = (providerInfo.models || []).some((model) => model.id === currentModel);
        if (!allowed) {
          settings.modelByProvider[provider] = providerInfo.models[0] ? providerInfo.models[0].id : '';
        }
      }
      return settings;
    },

    saveAiSettings(settings) {
      const merged = this.getAiSettings();
      const next = Object.assign({}, merged, settings || {});
      next.provider = this.getAiProvider(next.provider).id;
      next.modelByProvider = Object.assign({}, merged.modelByProvider, (settings && settings.modelByProvider) || {});
      next.apiKeys = Object.assign({}, merged.apiKeys, (settings && settings.apiKeys) || {});
      next.custom = Object.assign({}, merged.custom, (settings && settings.custom) || {});
      if (next.custom.model) next.modelByProvider.custom = String(next.custom.model).trim();
      localStorage.setItem(STORAGE_AI_SETTINGS, JSON.stringify(next));
      if (next.apiKeys.gemini) localStorage.setItem(STORAGE_KEY, next.apiKeys.gemini);
      else localStorage.removeItem(STORAGE_KEY);
      return next;
    },

    getCustomAiSettings() {
      return clone(this.getAiSettings().custom || defaultAiSettings().custom);
    },

    setCustomAiSettings(patch) {
      return this.saveAiSettings({ custom: Object.assign({}, this.getCustomAiSettings(), patch || {}) });
    },

    getSelectedAiProvider() {
      return this.getAiSettings().provider;
    },

    setSelectedAiProvider(providerId) {
      return this.saveAiSettings({ provider: this.getAiProvider(providerId).id });
    },

    getModelsForProvider(providerId) {
      const provider = this.getAiProvider(providerId);
      if (provider.id === 'custom') {
        const custom = this.getCustomAiSettings();
        const model = String(custom.model || '').trim();
        return model ? [{ id: model, label: model }] : [];
      }
      return clone(provider.models || []);
    },

    getSelectedModel(providerId) {
      const settings = this.getAiSettings();
      const provider = this.getAiProvider(providerId || settings.provider);
      if (provider.id === 'custom') return String(settings.custom.model || settings.modelByProvider.custom || '').trim();
      return settings.modelByProvider[provider.id] || ((provider.models[0] && provider.models[0].id) || '');
    },

    setSelectedModel(providerId, modelId) {
      const provider = this.getAiProvider(providerId);
      if (provider.id === 'custom') {
        const value = String(modelId || '').trim();
        return this.saveAiSettings({
          custom: Object.assign({}, this.getCustomAiSettings(), { model: value }),
          modelByProvider: { custom: value }
        });
      }
      const ok = (provider.models || []).some((model) => model.id === modelId);
      const value = ok ? modelId : ((provider.models[0] && provider.models[0].id) || '');
      const patch = {};
      patch[provider.id] = value;
      return this.saveAiSettings({ modelByProvider: patch });
    },

    getApiKey(providerId) {
      const provider = this.getAiProvider(providerId);
      const settings = this.getAiSettings();
      return String((settings.apiKeys && settings.apiKeys[provider.id]) || '').trim();
    },

    setApiKey(providerId, key) {
      const provider = this.getAiProvider(providerId);
      const patch = {};
      patch[provider.id] = String(key || '').trim();
      return this.saveAiSettings({ apiKeys: patch });
    },

    getGeminiKey() {
      return this.getApiKey('gemini');
    },

    setGeminiKey(key) {
      this.setApiKey('gemini', key);
    }
  };

  global.ActivityDomain = Domain;
})(typeof window !== 'undefined' ? window : globalThis);
