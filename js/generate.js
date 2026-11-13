/**
 * Generation: Activity template + curriculum pack -> playable HTML.
 * Optional AI call happens only here. Saved HTML plays offline.
 */
(function (global) {
  'use strict';

  const STORAGE_PACKS = 'activityLoader.generatedPacks.v1';
  const STORAGE_OUTPUT_FOLDER_NAME = 'activityLoader.generateOutputFolderName.v1';
  const IDB_NAME = 'activityLoader.generateOutput.v1';
  const IDB_STORE = 'handles';
  const IDB_KEY = 'outputDir';
  const PACK_PATHS = {
    'early-writers-1:jumpingOx': 'content/early-writers-1/jumpingOx.json',
    'write-now-1:jumpingOx': 'content/write-now-1/jumpingOx.json',
    'write-now-1:jeopardy': 'content/write-now-1/jeopardy.json',
    'write-now-1:vocabulary': 'content/write-now-1/vocabulary.json',
    'write-now-2:jumpingOx': 'content/write-now-2/jumpingOx.json',
    'early-writers-2:jumpingOx': 'content/early-writers-2/jumpingOx.json',
    'the-best-writing-starter-2:sentenceScramble': 'content/the-best-writing-starter-2/sentenceScramble.json',
    'the-best-writing-starter-2:gapFill': 'content/the-best-writing-starter-2/gapFill.json',
    'the-best-writing-starter-2:writingCards': 'content/the-best-writing-starter-2/writingCards.json',
    'best-writing-starter-1:jumpingOx': 'content/best-writing-starter-1/jumpingOx.json',
    'best-writing-starter-1:jeopardy': 'content/best-writing-starter-1/jeopardy.json',
    'best-writing-starter-1:sentenceScramble': 'content/best-writing-starter-1/sentenceScramble.json',
    'best-writing-starter-1:gapFill': 'content/best-writing-starter-1/gapFill.json',
    'best-writing-starter-1:writingCards': 'content/best-writing-starter-1/writingCards.json',
    'the-best-writing-starter-3:jumpingOx': 'content/the-best-writing-starter-3/jumpingOx.json',
    'the-best-writing-starter-3:jeopardy': 'content/the-best-writing-starter-3/jeopardy.json',
    'the-best-writing-starter-3:sentenceScramble': 'content/the-best-writing-starter-3/sentenceScramble.json',
    'the-best-writing-starter-3:gapFill': 'content/the-best-writing-starter-3/gapFill.json',
    'the-best-writing-starter-3:writingCards': 'content/the-best-writing-starter-3/writingCards.json'
  };

  let jumpingOxTemplate = '';
  let jeopardyTemplate = '';
  let vocabularyTemplate = '';
  let teamMatchTemplate = '';
  let charadesTemplate = '';
  let quizQuizTradeTemplate = '';
  let fanNPickTemplate = '';
  let findSomeoneWhoTemplate = '';
  let showdownTemplate = '';
  let rallyCoachTemplate = '';
  let sentenceScrambleTemplate = '';
  let gapFillTemplate = '';
  let writingCardsTemplate = '';
  const VOCAB_TYPES = { vocabulary: true, teamMatch: true, charades: true, quizQuizTrade: true, fanNPick: true, findSomeoneWho: true, showdown: true, rallyCoach: true };
  // Writing-practice types: content comes from AI (sentences, passages, frames) or, without a key, from the saved breakdown.
  const WRITING_TYPES = { sentenceScramble: true, gapFill: true, writingCards: true };

  function clone(v) { return JSON.parse(JSON.stringify(v)); }

  // bookId:activityId -> promise of the online save started by savePack().
  const cloudSaves = {};

  function readPacks() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_PACKS) || '{}');
    } catch (e) {
      return {};
    }
  }

  function writePacks(packs) {
    localStorage.setItem(STORAGE_PACKS, JSON.stringify(packs));
  }

  function supportsDirectoryPicker() {
    return typeof window !== 'undefined' && typeof window.showDirectoryPicker === 'function';
  }

  function getStoredFolderName() {
    try {
      return String(localStorage.getItem(STORAGE_OUTPUT_FOLDER_NAME) || '').trim();
    } catch (e) {
      return '';
    }
  }

  function setStoredFolderName(name) {
    try {
      const clean = String(name || '').trim();
      if (!clean) localStorage.removeItem(STORAGE_OUTPUT_FOLDER_NAME);
      else localStorage.setItem(STORAGE_OUTPUT_FOLDER_NAME, clean);
    } catch (e) { /* ignore */ }
  }

  function openOutputIdb() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error('Could not open folder storage.'));
    });
  }

  async function idbGetHandle() {
    const db = await openOutputIdb();
    try {
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(IDB_STORE, 'readonly');
        const req = tx.objectStore(IDB_STORE).get(IDB_KEY);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error || new Error('Could not read saved folder.'));
      });
    } finally {
      db.close();
    }
  }

  async function idbSetHandle(handle) {
    const db = await openOutputIdb();
    try {
      await new Promise((resolve, reject) => {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        tx.objectStore(IDB_STORE).put(handle, IDB_KEY);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error || new Error('Could not save folder.'));
      });
    } finally {
      db.close();
    }
  }

  async function idbClearHandle() {
    const db = await openOutputIdb();
    try {
      await new Promise((resolve, reject) => {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        tx.objectStore(IDB_STORE).delete(IDB_KEY);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error || new Error('Could not clear folder.'));
      });
    } finally {
      db.close();
    }
  }

  async function ensureDirPermission(handle, { interactive }) {
    if (!handle) return false;
    const opts = { mode: 'readwrite' };
    try {
      if (typeof handle.queryPermission === 'function') {
        const state = await handle.queryPermission(opts);
        if (state === 'granted') return true;
      }
      if (interactive && typeof handle.requestPermission === 'function') {
        const next = await handle.requestPermission(opts);
        return next === 'granted';
      }
    } catch (e) {
      return false;
    }
    return false;
  }

  async function pickAndStoreOutputFolder() {
    if (!supportsDirectoryPicker()) {
      throw new Error('This browser cannot pick a save folder. Files will download the usual way.');
    }
    let handle;
    try {
      handle = await window.showDirectoryPicker({ mode: 'readwrite' });
    } catch (e) {
      if (e && (e.name === 'AbortError' || e.name === 'NotAllowedError')) {
        throw new Error('Folder pick cancelled.');
      }
      throw e;
    }
    const ok = await ensureDirPermission(handle, { interactive: true });
    if (!ok) throw new Error('Permission to write in that folder was denied.');
    await idbSetHandle(handle);
    setStoredFolderName(handle.name || 'Selected folder');
    return handle;
  }

  async function getWritableOutputDir({ pickIfMissing }) {
    if (!supportsDirectoryPicker()) return null;
    let handle = null;
    try {
      handle = await idbGetHandle();
    } catch (e) {
      handle = null;
    }
    if (handle) {
      const ok = await ensureDirPermission(handle, { interactive: true });
      if (ok) return handle;
      throw new Error('Permission to write in the saved output folder was denied. Use Change folder.');
    }
    if (!pickIfMissing) return null;
    return pickAndStoreOutputFolder();
  }

  async function writeHtmlToDirectory(dirHandle, filename, html) {
    const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
    const writable = await fileHandle.createWritable();
    try {
      await writable.write(html);
    } finally {
      await writable.close();
    }
  }

  async function fetchText(path) {
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) throw new Error('Could not load ' + path);
    return res.text();
  }

  async function fetchJson(path) {
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) throw new Error('Could not load ' + path);
    return res.json();
  }

  function packKey(bookId, activityId) {
    return bookId + ':' + activityId;
  }

  function catalogId(bookId, activityId) {
    const short = {
      'write-now-1': 'wn1',
      'early-writers-1': 'ew1',
      'write-now-2': 'wn2',
      'early-writers-2': 'ew2'
    }[bookId] || bookId;
    const type = {
      jumpingOx: 'jumping-ox',
      jeopardy: 'jeopardy',
      vocabulary: 'vocabulary',
      teamMatch: 'team-match',
      charades: 'charades',
      quizQuizTrade: 'quiz-quiz-trade',
      fanNPick: 'fan-n-pick',
      findSomeoneWho: 'find-someone-who',
      showdown: 'showdown',
      rallyCoach: 'rally-coach',
      sentenceScramble: 'sentence-scramble',
      gapFill: 'gap-fill',
      writingCards: 'writing-card-spinner'
    }[activityId] || activityId;
    return short + '-' + type;
  }

  function resolveBook(bookId) {
    const Domain = global.ActivityDomain;
    const Catalog = global.ActivityLoaderCatalog;
    return (Domain && Domain.getBook && Domain.getBook(bookId)) ||
      (Catalog && Catalog.getBook && Catalog.getBook(bookId)) ||
      null;
  }

  function bookLevelName(bookId) {
    const book = resolveBook(bookId);
    return (book && book.levelIds && book.levelIds[0]) || 'Green';
  }

  function bookLevelFolder(bookId) {
    return String(bookLevelName(bookId)).toLowerCase();
  }

  function activityLabel(activityId) {
    const Domain = global.ActivityDomain;
    const type = Domain && Domain.getType ? Domain.getType(activityId) : null;
    if (type && type.name) return type.name;
    return {
      jumpingOx: 'Jumping OX',
      jeopardy: 'Jeopardy',
      vocabulary: 'Vocabulary',
      teamMatch: 'Team Match',
      charades: 'Charades',
      quizQuizTrade: 'Quiz-Quiz-Trade',
      fanNPick: 'Fan-N-Pick',
      findSomeoneWho: 'Find Someone Who',
      showdown: 'Showdown',
      rallyCoach: 'RallyCoach',
      sentenceScramble: 'Sentence Scramble',
      gapFill: 'Gap Fill',
      writingCards: 'Writing Card Spinner'
    }[activityId] || activityId;
  }

  function safeFilePart(text) {
    return String(text || '')
      .replace(/[<>:"/\\|?*]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function outputFileName(bookId, activityId) {
    const book = resolveBook(bookId);
    const level = bookLevelName(bookId);
    const title = (book && book.title) || bookId;
    return safeFilePart(level) + ' - ' + safeFilePart(title) + ' - ' + activityLabel(activityId) + '.html';
  }

  function entryPath(bookId, activityId) {
    const Domain = global.ActivityDomain;
    const style = Domain && Domain.getSavedStyle ? Domain.getSavedStyle(activityId) : null;
    const folder = style
      ? String(activityId).replace(/^style-/, '')
      : ({
        jumpingOx: 'jumping-ox',
        jeopardy: 'jeopardy',
        vocabulary: 'vocabulary',
        teamMatch: 'team-match',
        charades: 'charades',
        quizQuizTrade: 'quiz-quiz-trade',
        fanNPick: 'fan-n-pick',
        findSomeoneWho: 'find-someone-who',
        showdown: 'showdown',
        rallyCoach: 'rally-coach',
        sentenceScramble: 'sentence-scramble',
        gapFill: 'gap-fill',
        writingCards: 'writing-card-spinner'
      }[activityId] || activityId);
    return 'activities/' + bookLevelFolder(bookId) + '/' + bookId + '/' + folder + '/' + outputFileName(bookId, activityId);
  }

  function unitDataFromPack(pack) {
    if (pack && pack.units && typeof pack.units === 'object' && !Array.isArray(pack.units)) {
      const keys = Object.keys(pack.units);
      if (keys.length && pack.units[keys[0]] && Array.isArray(pack.units[keys[0]].questions)) {
        return pack.units;
      }
    }
    const groups = {};
    const order = [];
    (pack && pack.sentences ? pack.sentences : []).forEach((s) => {
      const name = s.unit || 'Unit';
      if (!groups[name]) {
        order.push(name);
        groups[name] = [];
      }
      groups[name].push({
        text: s.original,
        correct: !!s.is_correct,
        explanation: s.is_correct
          ? ('Good! "' + s.original + '" is correct.')
          : ('Incorrect. Say: "' + (s.corrected || s.original) + '".')
      });
    });
    const units = {};
    order.forEach((name, i) => {
      units[String(i + 1)] = {
        title: name,
        description: groups[name].length + ' questions',
        questions: groups[name]
      };
    });
    return units;
  }

  function injectMeta(template, pack, bookId, activityId) {
    const book = resolveBook(bookId);
    const level = bookLevelName(bookId);
    const bookTitle = (book && book.title) || pack.title || bookId;
    return template
      .replace('__LEVEL_JSON__', JSON.stringify(level))
      .replace('__BOOK_JSON__', JSON.stringify(bookTitle))
      .replace('__DOWNLOAD_NAME_JSON__', JSON.stringify(outputFileName(bookId, activityId)));
  }

  function injectJumpingOx(template, pack, bookId) {
    const title = pack.title || 'Jumping OX';
    const units = unitDataFromPack(pack);
    return injectMeta(template, pack, bookId || pack.bookId, 'jumpingOx')
      .replace('__TITLE_JSON__', JSON.stringify(title))
      .replace(/__TITLE__/g, title)
      .replace('__UNIT_DATA__', JSON.stringify(units).replace(/</g, '\\u003c'));
  }

  function injectJeopardy(template, pack, bookId) {
    const title = pack.title || 'Jeopardy Review';
    const id = bookId || pack.bookId || 'book';
    return injectMeta(template, pack, id, 'jeopardy')
      .replace('__TITLE_JSON__', JSON.stringify(title))
      .replace(/__TITLE__/g, title)
      .replace('__STORAGE_KEY_JSON__', JSON.stringify('canvasReviewData_' + id))
      .replace('__UNIT_DATA__', JSON.stringify(pack.units || {}).replace(/</g, '\\u003c'));
  }

  function injectVocab(template, pack, bookId, activityId) {
    const title = pack.title || 'Vocabulary';
    const id = bookId || pack.bookId || 'book';
    const type = activityId || 'vocabulary';
    return injectMeta(template, pack, id, type)
      .replace('__TITLE_JSON__', JSON.stringify(title))
      .replace(/__TITLE__/g, title)
      .replace('__STORAGE_KEY_JSON__', JSON.stringify('vocab_image_' + id + '_'))
      .replace('__VOCAB_BY_UNIT__', JSON.stringify(pack.vocabByUnit || {}).replace(/</g, '\\u003c'));
  }

  function writingData(activityId, pack) {
    if (activityId === 'writingCards') return { cards: pack.cards || [], pools: pack.pools || {} };
    return { units: pack.units || [] };
  }

  function injectWriting(template, pack, bookId, activityId) {
    const title = pack.title || activityLabel(activityId);
    const id = bookId || pack.bookId || 'book';
    return injectMeta(template, pack, id, activityId)
      .replace('__TITLE_JSON__', () => JSON.stringify(title))
      .replace(/__TITLE__/g, () => title.replace(/[<>&]/g, ''))
      .replace('__ACTIVITY_DATA__', () => JSON.stringify(writingData(activityId, pack)).replace(/</g, '\\u003c'));
  }

  function resolveTemplate(activityId) {
    const Domain = global.ActivityDomain;
    const style = Domain && Domain.getSavedStyle ? Domain.getSavedStyle(activityId) : null;
    if (style && style.templateHtml) return style.templateHtml;
    const imported = global.ActivityImporter && global.ActivityImporter.getTemplate
      ? global.ActivityImporter.getTemplate(activityId)
      : null;
    if (imported && imported.templateHtml) {
      return imported.templateHtml;
    }
    if (activityId === 'jumpingOx') return jumpingOxTemplate;
    if (activityId === 'jeopardy') return jeopardyTemplate;
    if (activityId === 'vocabulary') return vocabularyTemplate;
    if (activityId === 'teamMatch') return teamMatchTemplate;
    if (activityId === 'charades') return charadesTemplate;
    if (activityId === 'quizQuizTrade') return quizQuizTradeTemplate;
    if (activityId === 'fanNPick') return fanNPickTemplate;
    if (activityId === 'findSomeoneWho') return findSomeoneWhoTemplate;
    if (activityId === 'showdown') return showdownTemplate;
    if (activityId === 'rallyCoach') return rallyCoachTemplate;
    if (activityId === 'sentenceScramble') return sentenceScrambleTemplate;
    if (activityId === 'gapFill') return gapFillTemplate;
    if (activityId === 'writingCards') return writingCardsTemplate;
    return '';
  }

  function injectCustomStyle(template, pack, bookId, activityId, schema) {
    const title = pack.title || activityLabel(activityId);
    const id = bookId || pack.bookId || 'book';
    let html = injectMeta(template, pack, id, activityId)
      .replace('__TITLE_JSON__', JSON.stringify(title))
      .replace(/__TITLE__/g, title)
      .replace('__STORAGE_KEY_JSON__', JSON.stringify('custom_style_' + id + '_' + activityId + '_'));
    if (schema === 'vocabByUnit' || schema === 'matchPairs') {
      html = html.replace('__VOCAB_BY_UNIT__', JSON.stringify(pack.vocabByUnit || {}).replace(/</g, '\\u003c'));
    }
    if (schema === 'unitQuestions' || schema === 'unitClues') {
      html = html.replace('__UNIT_DATA__', JSON.stringify(pack.units || unitDataFromPack(pack) || {}).replace(/</g, '\\u003c'));
    }
    if (schema === 'genericPack') {
      html = html.replace('__GENERIC_PACK__', JSON.stringify(pack.genericPack || pack.units || {}).replace(/</g, '\\u003c'));
    }
    return html;
  }

  function bakeHtml(activityId, pack, bookId) {
    const Domain = global.ActivityDomain;
    const style = Domain && Domain.getSavedStyle ? Domain.getSavedStyle(activityId) : null;
    if (style) {
      const template = resolveTemplate(activityId);
      if (!template) throw new Error('Saved style template is missing.');
      return injectCustomStyle(template, pack, bookId, activityId, style.contentSchema);
    }
    if (activityId === 'jumpingOx') {
      const template = resolveTemplate(activityId);
      if (!template) throw new Error('Jumping OX template is not loaded.');
      return injectJumpingOx(template, pack, bookId);
    }
    if (activityId === 'jeopardy') {
      const template = resolveTemplate(activityId);
      if (!template) throw new Error('Jeopardy template is not loaded.');
      return injectJeopardy(template, pack, bookId);
    }
    if (activityId === 'vocabulary') {
      const template = resolveTemplate(activityId);
      if (!template) throw new Error('Vocabulary template is not loaded.');
      return injectVocab(template, pack, bookId, 'vocabulary');
    }
    if (activityId === 'teamMatch') {
      const template = resolveTemplate(activityId);
      if (!template) throw new Error('Team Match template is not loaded.');
      return injectVocab(template, pack, bookId, 'teamMatch');
    }
    if (activityId === 'charades') {
      const template = resolveTemplate(activityId);
      if (!template) throw new Error('Charades template is not loaded.');
      return injectVocab(template, pack, bookId, 'charades');
    }
    if (activityId === 'quizQuizTrade') {
      const template = resolveTemplate(activityId);
      if (!template) throw new Error('Quiz-Quiz-Trade template is not loaded.');
      return injectVocab(template, pack, bookId, 'quizQuizTrade');
    }
    if (activityId === 'fanNPick') {
      const template = resolveTemplate(activityId);
      if (!template) throw new Error('Fan-N-Pick template is not loaded.');
      return injectVocab(template, pack, bookId, 'fanNPick');
    }
    if (activityId === 'findSomeoneWho') {
      const template = resolveTemplate(activityId);
      if (!template) throw new Error('Find Someone Who template is not loaded.');
      return injectVocab(template, pack, bookId, 'findSomeoneWho');
    }
    if (activityId === 'showdown') {
      const template = resolveTemplate(activityId);
      if (!template) throw new Error('Showdown template is not loaded.');
      return injectVocab(template, pack, bookId, 'showdown');
    }
    if (activityId === 'rallyCoach') {
      const template = resolveTemplate(activityId);
      if (!template) throw new Error('RallyCoach template is not loaded.');
      return injectVocab(template, pack, bookId, 'rallyCoach');
    }
    if (WRITING_TYPES[activityId]) {
      const template = resolveTemplate(activityId);
      if (!template) throw new Error(activityLabel(activityId) + ' template is not loaded.');
      return injectWriting(template, pack, bookId, activityId);
    }
    throw new Error('This activity type cannot be generated yet.');
  }

  function validatePack(activityId, pack) {
    if (!pack || typeof pack !== 'object') throw new Error('Empty pack.');
    const Domain = global.ActivityDomain;
    const style = Domain && Domain.getSavedStyle ? Domain.getSavedStyle(activityId) : null;
    if (style) {
      const schema = style.contentSchema;
      if (schema === 'vocabByUnit' || schema === 'matchPairs') {
        const vocab = pack.vocabByUnit || {};
        let words = 0;
        Object.keys(vocab).forEach((k) => {
          words += ((vocab[k] && vocab[k].words) || []).length;
        });
        if (words < 4) throw new Error('Need vocabulary words from a saved book breakdown.');
        return pack;
      }
      if (schema === 'unitQuestions') {
        const units = unitDataFromPack(pack);
        if (!Object.keys(units).length) throw new Error('Need unit questions from the book breakdown.');
        pack.units = units;
        return pack;
      }
      if (schema === 'unitClues') {
        if (!pack.units || !Object.keys(pack.units).length) throw new Error('Need unit clues from the book breakdown.');
        return pack;
      }
      if (schema === 'genericPack') {
        if (!pack.genericPack && !pack.units) throw new Error('Need pack data from the book breakdown.');
        return pack;
      }
    }
    if (activityId === 'jumpingOx') {
      const units = unitDataFromPack(pack);
      const keys = Object.keys(units);
      if (!keys.length) throw new Error('Jumping OX needs unit questions.');
      let total = 0;
      keys.forEach((k) => {
        const u = units[k];
        if (!u.title || !Array.isArray(u.questions) || u.questions.length < 4) {
          throw new Error('Each unit needs a title and at least 4 questions.');
        }
        u.questions.forEach((q) => {
          if (!q.text || typeof q.correct !== 'boolean' || !q.explanation) {
            throw new Error('Each question needs text, correct (true/false), and explanation.');
          }
          total += 1;
        });
      });
      if (total < 8) throw new Error('Jumping OX needs at least 8 questions.');
      pack.units = units;
      return pack;
    }
    if (activityId === 'jeopardy') {
      const units = pack.units || {};
      const keys = Object.keys(units);
      if (keys.length < 4) throw new Error('Jeopardy needs at least 4 units.');
      keys.forEach((k) => {
        if (!Array.isArray(units[k]) || units[k].length < 5) {
          throw new Error('Each Jeopardy unit needs at least 5 clues.');
        }
      });
      return pack;
    }
    if (VOCAB_TYPES[activityId]) {
      const vocab = pack.vocabByUnit || {};
      const keys = Object.keys(vocab);
      let words = 0;
      let pairs = 0;
      keys.forEach((k) => {
        const list = (vocab[k] && vocab[k].words) || [];
        words += list.length;
        list.forEach((w) => {
          if (w && w.en && w.ko) pairs += 1;
        });
      });
      if (words < 8) {
        throw new Error('Need at least 8 vocabulary words. Analyze more pages, then Save on the Curriculum tab.');
      }
      if (activityId === 'teamMatch' && pairs < 4) {
        throw new Error('Team Match needs at least 4 English/Korean pairs. Check Korean on the Curriculum preview.');
      }
      return pack;
    }
    if (activityId === 'sentenceScramble') {
      const units = Array.isArray(pack.units) ? pack.units : [];
      let total = 0;
      units.forEach((u) => {
        u.sentences = (u.sentences || []).map((x) => String(x || '').replace(/\s+/g, ' ').trim()).filter((x) => x.split(' ').length >= 2);
        total += u.sentences.length;
      });
      pack.units = units.filter((u) => u.sentences.length);
      if (total < 4) throw new Error('Sentence Scramble needs at least 4 sentences. Use AI mode, or save a breakdown with grammar examples.');
      return pack;
    }
    if (activityId === 'gapFill') {
      const units = (Array.isArray(pack.units) ? pack.units : []).filter((u) => u && Array.isArray(u.lines) && u.lines.length);
      const blanks = units.reduce((n, u) => n + u.lines.join('\n').split('[').length - 1, 0);
      if (!units.length || blanks < 3) throw new Error('Gap Fill needs passages with [blanks]. Use AI mode, or save a breakdown with grammar examples.');
      pack.units = units;
      return pack;
    }
    if (activityId === 'writingCards') {
      const cards = (Array.isArray(pack.cards) ? pack.cards : []).filter((c) => c && Array.isArray(c.lines) && c.lines.some((l) => /\{\w+/.test(l)));
      if (!cards.length) throw new Error('Writing Card Spinner needs at least one card with {blanks}. Use AI mode, or save a breakdown with grammar examples.');
      pack.cards = cards;
      pack.pools = pack.pools && typeof pack.pools === 'object' ? pack.pools : {};
      return pack;
    }
    throw new Error('Unknown activity.');
  }

  async function callAiJson(provider, apiKey, model, prompt) {
    const AI = global.ActivityAI;
    if (!AI || !AI.generateJson) throw new Error('AI client is not loaded.');
    return AI.generateJson({
      provider: provider,
      model: model,
      apiKey: apiKey,
      prompt: prompt,
      temperature: 0.4
    });
  }

  function breakdownUnitText(breakdown) {
    if (!breakdown || !Array.isArray(breakdown.units)) return '';
    return breakdown.units.map((unit) => {
      const grammar = (unit.grammar || []).map((g) => '- ' + g.point + (g.example ? ' (e.g. ' + g.example + ')' : '')).join('\n');
      const vocab = (unit.vocabulary || []).map((w) => w.en + (w.ko ? ' / ' + w.ko : '')).join(', ');
      return unit.title + '\nGrammar:\n' + (grammar || '- (none)') + '\nVocabulary: ' + (vocab || '(none)');
    }).join('\n\n');
  }

  // ---- Unit focus: every item practises a word or grammar pattern from its unit ----

  function focusRules() {
    return [
      'FOCUS RULES (most important):',
      '- Every item practises the target language of its unit: the MEANING of one word from that unit\'s Vocabulary list, or ONE pattern from that unit\'s Grammar list.',
      '- A student who never read the book\'s story or model text must still be able to answer, using only word meaning and grammar. Never ask about details of a reading passage (names, colours, ages, what someone has, likes or does in the text). Never make an item wrong because it disagrees with the reading.',
      '- Use only content words from that unit\'s Vocabulary list, plus very basic words (I, you, he, she, it, we, they, a, an, the, my, is, are, and, very, have, like, go). Do not bring in words, topics or grammar from other units or from outside the lists.',
      '- Copy the word or grammar point being practised into "target", exactly as it is written in the lists.'
    ].join('\n');
  }

  function normText(s) {
    return String(s == null ? '' : s).toLowerCase().replace(/[‘’]/g, "'")
      .replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function unitTargets(unit) {
    return {
      vocab: ((unit && unit.vocabulary) || []).map((w) => normText(w && w.en)).filter(Boolean),
      grammar: ((unit && unit.grammar) || []).map((g) => normText(g && g.point)).filter(Boolean)
    };
  }

  function vocabMatch(n, list) {
    for (let i = 0; i < list.length; i++) {
      const v = list[i];
      if (n === v || n === v + 's' || n === v + 'es' || v === n + 's' || v === n + 'es') return v;
    }
    return '';
  }

  function grammarMatch(n, list) {
    for (let i = 0; i < list.length; i++) {
      const g = list[i];
      if (n === g || (n.length >= 4 && (g.indexOf(n) >= 0 || n.indexOf(g) >= 0))) return g;
    }
    return '';
  }

  // The word (or a form of it) appears in the text.
  function textHasWord(text, word) {
    const t = ' ' + normText(text) + ' ';
    const w = normText(word);
    if (!w) return false;
    if (t.indexOf(' ' + w + ' ') >= 0) return true;
    const stem = w.length > 4 ? w.slice(0, w.length - 1) : w;
    return t.indexOf(' ' + stem) >= 0;
  }

  // Everyday words any item may use on top of the unit lists (A1 function words and basics).
  const BASIC_WORDS = (
    'a an the and or but so if because not no yes very too also really just only much many more most some any all every each other another ' +
    'i me my mine you your yours he him his she her hers it its we us our ours they them their theirs this that these those there here ' +
    'who what where when why how which whose ' +
    'am is are was were be been being do does did done have has had having can cant could will would should must may might shall ' +
    "don't doesn't didn't isn't aren't wasn't weren't can't won't i'm you're he's she's it's we're they're i've let's " +
    'to of in on at for with from by about up down out off over under into near next behind between after before around ' +
    'go goes went come comes came get gets got make makes made take takes took see sees saw look looks looked say says said tell ' +
    'like likes liked love loves want wants know knows think play plays played eat eats ate drink live lives give help put use ' +
    'one two three four five six seven eight nine ten first last ' +
    'good bad big small little new old nice happy sad great best favorite favourite fun ' +
    'day days today week year years time morning night home school friend friends family people person thing things way ' +
    'man woman boy girl child children mom dad mother father brother sister ' +
    'now then always never often sometimes usually again well' +
    ' something someone word words mean means meaning sentence correct right wrong same different kind called name'
  ).split(/\s+/).reduce((o, w) => { if (w) o[w] = true; return o; }, {});

  function wordForms(w) {
    const out = [w];
    if (/e$/.test(w)) out.push(w.slice(0, -1) + 'ing', w + 'd', w + 's');
    if (/y$/.test(w)) out.push(w.slice(0, -1) + 'ies', w.slice(0, -1) + 'ied');
    out.push(w + 's', w + 'es', w + 'ed', w + 'ing', w + "'s", w + w.slice(-1) + 'ing', w + w.slice(-1) + 'ed');
    return out;
  }

  // Every word a unit's own lists use: its vocabulary, grammar points and examples, and title.
  function unitWordSet(unit) {
    const set = {};
    const add = (text) => normText(text).split(' ').forEach((w) => {
      if (!w) return;
      wordForms(w).forEach((f) => { set[f] = true; });
    });
    add(unit && unit.title);
    ((unit && unit.vocabulary) || []).forEach((w) => add(w && w.en));
    ((unit && unit.grammar) || []).forEach((g) => { add(g && g.point); add(g && g.example); });
    return set;
  }

  /** Words in the text that are neither in the unit's lists nor everyday basics. */
  function offListWords(text, unitSet) {
    return normText(text).split(' ').filter((w) => {
      if (!w || /^\d+$/.test(w) || w.length < 3) return false;
      const base = w.replace(/'s$/, '');
      return !BASIC_WORDS[w] && !BASIC_WORDS[base] && !unitSet[w] && !unitSet[base];
    });
  }

  /** 'vocab' | 'grammar' | '' (off target) */
  function targetKind(target, text, targets) {
    const n = normText(target);
    if (!n) return '';
    const v = vocabMatch(n, targets.vocab);
    if (v) return (text == null || textHasWord(text, v)) ? 'vocab' : '';
    if (grammarMatch(n, targets.grammar)) return 'grammar';
    return '';
  }

  /**
   * An item is kept only if it practises one of its unit's words or grammar points AND
   * does not lean on words from outside the unit. Grammar sentences must be built from
   * unit vocabulary (at most one outside word); meaning items may use a few simple
   * defining words, but must still name a unit word.
   */
  function itemOnUnit(item, text, unit, targets, unitSet, opts) {
    const kind = targetKind(item && item.target, text, targets);
    if (!kind) return false;
    if (text == null) return true;
    const extra = offListWords(text, unitSet);
    if (kind === 'grammar') {
      const usesUnitWord = targets.vocab.some((v) => textHasWord(text, v));
      return (usesUnitWord || !targets.vocab.length) && extra.length <= 1;
    }
    return extra.length <= ((opts && opts.definitionWords) || 4);
  }

  function findBreakdownUnit(breakdown, title, index) {
    const units = (breakdown && breakdown.units) || [];
    const n = normText(title).replace(/^unit \d+ /, '');
    let hit = null;
    if (n) {
      hit = units.find((u) => normText(u.title).replace(/^unit \d+ /, '') === n) ||
        units.find((u) => { const t = normText(u.title); return t.indexOf(n) >= 0 || n.indexOf(t.replace(/^unit \d+ /, '')) >= 0; });
    }
    return hit || (typeof index === 'number' ? units[index] : null) || null;
  }

  /**
   * Drops AI items that don't practise a word or grammar point from their own unit.
   * Returns how many were dropped. Without a breakdown there is nothing to check against.
   */
  function keepUnitFocus(activityId, pack, breakdown) {
    if (!breakdown || !Array.isArray(breakdown.units) || !breakdown.units.length) return 0;
    let dropped = 0;
    const keep = (list, unit, textOf, opts) => {
      const t = unitTargets(unit);
      if (!t.vocab.length && !t.grammar.length) return list;
      const set = unitWordSet(unit);
      return (list || []).filter((item) => {
        const ok = itemOnUnit(item, textOf(item), unit, t, set, opts);
        if (!ok) dropped += 1;
        return ok;
      });
    };
    if (activityId === 'jumpingOx') {
      const units = pack.units || {};
      Object.keys(units).forEach((k, i) => {
        const u = units[k];
        const bu = findBreakdownUnit(breakdown, u && u.title, i);
        if (!bu || !u || !Array.isArray(u.questions)) return;
        u.questions = keep(u.questions, bu, (q) => q.text);
        u.description = u.questions.length + ' questions';
      });
    } else if (activityId === 'jeopardy') {
      const units = pack.units || {};
      Object.keys(units).forEach((k, i) => {
        const bu = findBreakdownUnit(breakdown, k, i);
        if (!bu || !Array.isArray(units[k])) return;
        // Vocabulary clues: the answer is the word, so it is never in the clue text.
        units[k] = keep(units[k], bu, (c) => (vocabMatch(normText(c.target), unitTargets(bu).vocab) ? c.a : c.q + ' ' + c.a));
      });
    } else if (activityId === 'sentenceScramble') {
      (pack.units || []).forEach((u, i) => {
        const bu = findBreakdownUnit(breakdown, u.name, i);
        if (!bu) return;
        u.sentences = keep(u.sentences, bu, (s) => s.text);
      });
    } else if (activityId === 'gapFill') {
      (pack.units || []).forEach((u, i) => {
        const bu = findBreakdownUnit(breakdown, u.name, i);
        if (!bu) return;
        u.lines = keep(u.lines, bu, (l) => l.text);
      });
    } else if (activityId === 'writingCards') {
      const all = { vocab: [], grammar: [] };
      breakdown.units.forEach((u) => { const t = unitTargets(u); all.vocab = all.vocab.concat(t.vocab); });
      Object.keys(pack.pools || {}).forEach((k) => {
        const before = pack.pools[k];
        const after = before.filter((opt) => all.vocab.some((v) => textHasWord(opt, v)));
        // Small closed sets like he/she or names stay as they are.
        if (after.length >= 3) { dropped += before.length - after.length; pack.pools[k] = after; }
      });
    }
    return dropped;
  }

  function jumpingOxPrompt(book, cefr, breakdown) {
    const unitBlock = breakdown
      ? breakdownUnitText(breakdown)
      : (book.units || []).join('\n');
    return [
      'Create classroom Jumping OX items for ' + book.title + ' at CEFR ' + cefr + '. Students jump to O (true / correct) or X (false / wrong).',
      'Use this book content. Do not invent a different syllabus.',
      unitBlock,
      focusRules(),
      'Return JSON only: { "title": string, "cefr": "' + cefr + '", "units": { "1": { "title": string, "description": string, "questions": [ { "kind": "vocab"|"grammar", "target": string, "text": string, "correct": boolean, "explanation": string } ] } } }',
      'Need exactly 10 questions per unit: 5 vocab and 5 grammar. At least 4 per unit must be false (correct: false), mixed between both kinds.',
      'vocab: a short statement about what one unit word means, using the word itself. True example: "A vet is a doctor for animals." False example: "Shy means you love to talk to new people." Wrong ones give a clearly wrong meaning, never a wrong fact from the reading.',
      'grammar: one sentence that uses one unit grammar pattern with unit vocabulary. Wrong sentences contain exactly one typical learner error in THAT pattern (is/are, have/has, 3rd person -s, a/an, like + -ing, can + base verb, word order, prepositions). Correct sentences are natural, simple English.',
      'explanation: one short teacher line. For vocab, give the real meaning and the Korean word. For grammar, show the correct sentence and name the pattern.',
      'Unit keys are "1","2",... Titles must match the unit titles above. No markdown.'
    ].join('\n');
  }

  function jeopardyPrompt(book, cefr, breakdown) {
    const unitBlock = breakdown
      ? breakdownUnitText(breakdown)
      : (book.units || []).join('\n');
    return [
      'Create Jeopardy review clues for ' + book.title + ' at CEFR ' + cefr + '.',
      'Use this book content. Do not invent a different syllabus.',
      unitBlock,
      focusRules(),
      'Return JSON only: { "title": string, "cefr": "' + cefr + '", "units": { "Unit name": [ { "kind": "vocab"|"grammar", "target": string, "q": string, "a": string } ] } }',
      'Each unit needs exactly 15 items: 10 vocab then 5 grammar, easiest first.',
      'vocab: q is a short child-friendly English meaning of the word (never the word itself, never a detail from the reading). a is the unit word exactly as listed.',
      'grammar: q is a sentence using the unit pattern with one blank ___ and the base word in brackets, e.g. "She ___ a pet cat. (have)". a is the correct form, e.g. "has". Only one answer may fit.',
      'Keys of units must match the unit titles above exactly. No markdown.'
    ].join('\n');
  }

  function sentenceScramblePrompt(book, cefr, breakdown) {
    return [
      'Create Sentence Scramble items for ' + book.title + ' at CEFR ' + cefr + '. Students drag shuffled words back into order, so the sentences train word order in the unit grammar patterns.',
      'Use this book content. Do not invent a different syllabus.',
      breakdownUnitText(breakdown) || (book.units || []).join('\n'),
      focusRules(),
      'Return JSON only: { "title": string, "units": [ { "name": string, "sentences": [ { "target": string, "text": string } ] } ] }',
      'Need 8 to 10 sentences per unit, 4 to 10 words each, correct English with a capital letter and end punctuation. Every unit grammar point is used at least twice.',
      'target is the grammar point the sentence practises. Each sentence also uses at least one unit vocabulary word. Do not retell the reading: write fresh, simple sentences a child could say about themselves, a friend or family.',
      'Avoid duplicate sentences. name must match the unit titles above exactly, in the same order. No markdown.'
    ].join('\n');
  }

  function gapFillPrompt(book, cefr, breakdown) {
    return [
      'Create a gap-fill review of the target words and grammar of ' + book.title + ' at CEFR ' + cefr + '. The game shows a word bank of the bracketed answers.',
      'Use this book content. Do not invent a different syllabus.',
      breakdownUnitText(breakdown) || (book.units || []).join('\n'),
      focusRules(),
      'Return JSON only: { "title": string, "units": [ { "name": string, "title": string, "lines": [ { "target": string, "text": string } ] } ] }',
      'lines: 8 to 12 separate sentences per unit (not a story). Each text has exactly ONE blank in square brackets, e.g. "A [vet] helps sick animals." or "My brother [has] a red bike."',
      'Around two thirds of the blanks are unit vocabulary words; the rest are the key word of a unit grammar pattern (is/are, has, -s verb, a/an, preposition...). The bracket holds only that word.',
      'Each sentence must give a clear meaning or grammar clue so that only one word from the bank fits. Never write a blank that could only be answered by remembering the reading.',
      'name must match the unit titles above exactly, in the same order. title is a short title, e.g. "Words and patterns". No markdown.'
    ].join('\n');
  }

  function writingCardsPrompt(book, cefr, breakdown) {
    return [
      'Create fill-in writing frame cards (like textbook Writing Assignment Cards) for ' + book.title + ' at CEFR ' + cefr + '.',
      'One card per unit. The card lines are the unit grammar patterns as sentence frames; the blanks are filled with unit vocabulary. Students say or write the card with their own words; the app can also spin random words into the blanks.',
      breakdownUnitText(breakdown) || (book.units || []).join('\n'),
      'Only use grammar patterns and words from that unit. Do not copy the reading passage; the card is about the student.',
      'Return JSON only: { "title": string, "cards": [ { "title": string, "lines": [string] } ], "pools": { "category": [string] } }',
      'Each card has 5 to 9 short lines and uses every grammar point of its unit at least once. A blank is written {category} where category is a lowercase word, e.g. "My favorite color is {color}." Use 3 to 7 blanks per card.',
      'To repeat the same answer later in the card, use {category#id}, e.g. "My best friend is {name#bf}." ... "{name#bf} is my best friend ever!"',
      'Pronouns that depend on he/she are written {He}, {he}, {his}, {him} (the app switches them).',
      'Every category used must exist in pools with 6 to 10 short options that fit the sentence grammatically (include articles where needed). Pool options are unit vocabulary words. Categories may be shared across cards.',
      'Card titles are short, in Title Case. No markdown.'
    ].join('\n');
  }

  function cleanSentence(text) {
    let t = String(text || '').replace(/\s+/g, ' ').replace(/^[-•*\d.)\s]+/, '').trim();
    if (!t) return '';
    t = t.charAt(0).toUpperCase() + t.slice(1);
    if (!/[.!?]$/.test(t)) t += '.';
    return t;
  }

  // Grammar examples from the breakdown, split into single sentences.
  function unitExamples(unit) {
    const out = [];
    (unit.grammar || []).forEach((g) => {
      String((g && g.example) || '').split(/\s*(?:\/|;|\|)\s*|(?<=[.!?])\s+/).forEach((part) => {
        const s = cleanSentence(part);
        const n = s.split(' ').length;
        if (n >= 3 && n <= 14 && out.indexOf(s) < 0) out.push(s);
      });
    });
    return out;
  }

  function findVocabIn(sentence, unit) {
    const words = (unit.vocabulary || []).map((w) => String((w && w.en) || '').trim()).filter(Boolean)
      .sort((a, b) => b.length - a.length);
    for (let i = 0; i < words.length; i++) {
      const esc = words[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const m = sentence.match(new RegExp('\\b' + esc + '\\b', 'i'));
      if (m) return { index: m.index, text: m[0] };
    }
    return null;
  }

  function writingPackFromBreakdown(book, activityId, cefr, breakdown) {
    const units = breakdown.units || [];
    const base = { title: book.title + ' ' + activityLabel(activityId), cefr: cefr, bookId: book.id, activityId: activityId };
    if (activityId === 'sentenceScramble') {
      base.units = units.map((u, i) => ({ name: String(u.title || ('Unit ' + (i + 1))), sentences: unitExamples(u) }));
      return base;
    }
    if (activityId === 'gapFill') {
      base.units = units.map((u, i) => {
        const lines = unitExamples(u).map((s) => {
          const hit = findVocabIn(s, u);
          if (hit) return s.slice(0, hit.index) + '[' + hit.text + ']' + s.slice(hit.index + hit.text.length);
          const longest = s.replace(/[^A-Za-z' ]/g, ' ').split(' ').filter((w) => w.length >= 4).sort((a, b) => b.length - a.length)[0];
          return longest ? s.replace(new RegExp('\\b' + longest + '\\b'), '[' + longest + ']') : s;
        });
        const name = String(u.title || ('Unit ' + (i + 1)));
        return { name: name, title: name.replace(/^Unit\s*\d+\s*[:.-]\s*/i, ''), lines: lines };
      });
      return base;
    }
    // writingCards: grammar examples become frames; unit vocabulary fills the blanks.
    const pools = {};
    base.cards = units.map((u, i) => {
      const cat = 'unit' + (i + 1);
      pools[cat] = (u.vocabulary || []).map((w) => String((w && w.en) || '').trim()).filter(Boolean);
      const lines = unitExamples(u).map((s) => {
        const hit = findVocabIn(s, u);
        return hit ? s.slice(0, hit.index) + '{' + cat + '}' + s.slice(hit.index + hit.text.length) : s;
      });
      return { title: String(u.title || ('Unit ' + (i + 1))).replace(/^Unit\s*\d+\s*[:.-]\s*/i, ''), lines: lines };
    });
    base.pools = pools;
    return base;
  }

  // AI answers: keep only the fields the templates read.
  function normalizeWritingPack(activityId, raw) {
    const pack = raw && typeof raw === 'object' ? raw : {};
    const asList = (v) => Array.isArray(v) ? v : (v && typeof v === 'object' ? Object.keys(v).map((k) => Object.assign({ name: k }, v[k])) : []);
    if (activityId === 'writingCards') {
      pack.cards = asList(pack.cards).map((c) => ({ title: String(c.title || ''), lines: (c.lines || []).map(String) }));
      const pools = {};
      Object.keys(pack.pools || {}).forEach((k) => {
        if (Array.isArray(pack.pools[k])) pools[k] = pack.pools[k].map(String).filter(Boolean);
      });
      pack.pools = pools;
      return pack;
    }
    // Items arrive as { target, text } (older answers: plain strings, which have no target).
    const asItem = (x) => (x && typeof x === 'object')
      ? { target: String(x.target || ''), text: String(x.text || x.sentence || x.line || '') }
      : { target: '', text: String(x == null ? '' : x) };
    pack.units = asList(pack.units).map((u) => (activityId === 'gapFill'
      ? { name: String(u.name || u.title || ''), title: String(u.title || u.name || ''), lines: (u.lines || []).map(asItem).filter((l) => l.text.trim()) }
      : { name: String(u.name || u.title || ''), sentences: (u.sentences || []).map(asItem).filter((l) => l.text.trim()) }));
    return pack;
  }

  // After the unit-focus check, the templates want plain strings.
  function flattenWritingPack(activityId, pack) {
    if (activityId === 'writingCards') return pack;
    (pack.units || []).forEach((u) => {
      if (activityId === 'gapFill') u.lines = (u.lines || []).map((l) => (l && typeof l === 'object' ? l.text : String(l)));
      else u.sentences = (u.sentences || []).map((l) => (l && typeof l === 'object' ? l.text : String(l)));
    });
    return pack;
  }

  function vocabPackFromBreakdown(book, activityId, cefr, breakdown) {
    const Domain = global.ActivityDomain;
    const vocabByUnit = Domain.vocabByUnitFromBreakdown(breakdown);
    const type = Domain.getType ? Domain.getType(activityId) : null;
    const label = type && type.name ? (' ' + type.name) : ({
      vocabulary: ' Vocabulary',
      teamMatch: ' Team Match',
      charades: ' Charades',
      quizQuizTrade: ' Quiz-Quiz-Trade',
      fanNPick: ' Fan-N-Pick',
      findSomeoneWho: ' Find Someone Who',
      showdown: ' Showdown',
      rallyCoach: ' RallyCoach'
    }[activityId] || '');
    return {
      title: book.title + label,
      cefr: cefr,
      bookId: book.id,
      activityId: activityId,
      vocabByUnit: vocabByUnit
    };
  }

  function genericPackFromBreakdown(book, activityId, cefr, breakdown) {
    const units = {};
    (breakdown.units || []).forEach((unit, i) => {
      const items = [];
      (unit.vocabulary || []).forEach((w) => {
        if (!w || !w.en) return;
        items.push({
          prompt: String(w.ko || w.en).trim(),
          answer: String(w.en).trim()
        });
      });
      (unit.grammar || []).forEach((g) => {
        if (!g || !g.point) return;
        items.push({
          prompt: String(g.point).trim(),
          answer: String(g.example || g.point).trim()
        });
      });
      units['u' + (i + 1)] = {
        name: String(unit.title || ('Unit ' + (i + 1))),
        items: items
      };
    });
    return {
      title: book.title + ' ' + activityLabel(activityId),
      cefr: cefr,
      bookId: book.id,
      activityId: activityId,
      genericPack: units,
      units: units
    };
  }

  // No AI: Jeopardy clues are the Korean meaning; the answer is the unit word.
  function cluesFromBreakdown(book, activityId, cefr, breakdown) {
    const units = {};
    (breakdown.units || []).forEach((unit) => {
      const list = [];
      (unit.vocabulary || []).forEach((w) => {
        if (!w || !w.en || !w.ko) return;
        list.push({ kind: 'vocab', target: String(w.en).trim(), q: String(w.ko).trim(), a: String(w.en).trim() });
      });
      if (list.length) units[String(unit.title || 'Unit')] = list;
    });
    return {
      title: book.title + ' ' + activityLabel(activityId),
      cefr: cefr,
      bookId: book.id,
      activityId: activityId,
      units: units
    };
  }

  // No AI: Jumping OX checks word meanings (word = Korean, true or swapped)
  // and shows the unit's grammar examples as correct model sentences.
  function questionsFromBreakdown(book, activityId, cefr, breakdown) {
    const units = {};
    (breakdown.units || []).forEach((unit, i) => {
      const questions = [];
      const words = (unit.vocabulary || []).filter((w) => w && w.en && w.ko);
      words.slice(0, 8).forEach((w, j) => {
        const others = words.filter((o) => o.ko !== w.ko);
        const swap = j % 2 === 1 && others.length ? others[(j * 7) % others.length] : null;
        questions.push({
          kind: 'vocab',
          target: w.en,
          text: '\u201c' + w.en + '\u201d means ' + (swap ? swap.ko : w.ko) + '.',
          correct: !swap,
          explanation: (swap ? 'No. ' : 'Yes. ') + w.en + ' = ' + w.ko + (swap ? ' (' + swap.ko + ' = ' + swap.en + ')' : '')
        });
      });
      unitExamples(unit).slice(0, 4).forEach((ex, j) => {
        const g = (unit.grammar || [])[j] || (unit.grammar || [])[0] || {};
        questions.push({
          kind: 'grammar',
          target: String(g.point || ''),
          text: ex,
          correct: true,
          explanation: 'Correct. Pattern: ' + String(g.point || '').trim()
        });
      });
      if (!questions.length) return;
      units[String(i + 1)] = {
        title: String(unit.title || ('Unit ' + (i + 1))),
        description: questions.length + ' questions',
        questions: questions
      };
    });
    return {
      title: book.title + ' ' + activityLabel(activityId),
      cefr: cefr,
      bookId: book.id,
      activityId: activityId,
      units: units
    };
  }

  function packFromBreakdownForStyle(book, activityId, cefr, breakdown, schema) {
    if (schema === 'vocabByUnit' || schema === 'matchPairs') {
      return vocabPackFromBreakdown(book, activityId, cefr, breakdown);
    }
    if (schema === 'unitClues') return cluesFromBreakdown(book, activityId, cefr, breakdown);
    if (schema === 'unitQuestions') return questionsFromBreakdown(book, activityId, cefr, breakdown);
    return genericPackFromBreakdown(book, activityId, cefr, breakdown);
  }

  const Generate = {
    async init() {
      const embedded = global.ACTIVITY_EMBEDDED || {};
      const t = embedded.templates || {};
      jumpingOxTemplate = t.jumpingOx || '';
      jeopardyTemplate = t.jeopardy || '';
      vocabularyTemplate = t.vocabulary || '';
      teamMatchTemplate = t.teamMatch || '';
      charadesTemplate = t.charades || '';
      quizQuizTradeTemplate = t.quizQuizTrade || '';
      fanNPickTemplate = t.fanNPick || '';
      findSomeoneWhoTemplate = t.findSomeoneWho || '';
      showdownTemplate = t.showdown || '';
      rallyCoachTemplate = t.rallyCoach || '';
      sentenceScrambleTemplate = t.sentenceScramble || '';
      gapFillTemplate = t.gapFill || '';
      writingCardsTemplate = t.writingCards || '';
      try {
        jumpingOxTemplate = await fetchText('templates/jumpingOx.template.html');
        jeopardyTemplate = await fetchText('templates/jeopardy.template.html');
        vocabularyTemplate = await fetchText('templates/vocabulary.template.html');
        teamMatchTemplate = await fetchText('templates/teamMatch.template.html');
        charadesTemplate = await fetchText('templates/charades.template.html');
        quizQuizTradeTemplate = await fetchText('templates/quizQuizTrade.template.html');
        fanNPickTemplate = await fetchText('templates/fanNPick.template.html');
        findSomeoneWhoTemplate = await fetchText('templates/findSomeoneWho.template.html');
        showdownTemplate = await fetchText('templates/showdown.template.html');
        rallyCoachTemplate = await fetchText('templates/rallyCoach.template.html');
        sentenceScrambleTemplate = await fetchText('templates/sentenceScramble.template.html');
        gapFillTemplate = await fetchText('templates/gapFill.template.html');
        writingCardsTemplate = await fetchText('templates/writingCards.template.html');
      } catch (e) {
        if (!jumpingOxTemplate || !jeopardyTemplate) {
          console.warn('Using embedded templates.');
        }
      }
    },

    packKey: packKey,
    catalogId: catalogId,
    entryPath: entryPath,
    outputFileName: outputFileName,

    async loadBuiltinPack(bookId, activityId) {
      const key = packKey(bookId, activityId);
      const embedded = (global.ACTIVITY_EMBEDDED && global.ACTIVITY_EMBEDDED.packs) || {};
      if (embedded[key]) {
        return clone(embedded[key]);
      }
      const path = PACK_PATHS[key];
      if (!path) throw new Error('No built-in pack for this book + activity yet.');
      return fetchJson(path);
    },

    /** Resolves when the online copy of this game is saved; null when not saving online. */
    cloudSaveFor(bookId, activityId) {
      return cloudSaves[packKey(bookId, activityId)] || null;
    },

    getSavedPack(bookId, activityId) {
      return readPacks()[packKey(bookId, activityId)] || null;
    },

    savePack(bookId, activityId, pack, html, cefr, source) {
      const packs = readPacks();
      packs[packKey(bookId, activityId)] = {
        bookId: bookId,
        activityId: activityId,
        cefr: cefr,
        source: source,
        pack: pack,
        html: html,
        savedAt: Date.now()
      };
      writePacks(packs);
      const saved = packs[packKey(bookId, activityId)];
      const Library = global.ActivityLibrary;
      const Auth = global.ActivityAuth;
      if (Library && Library.isServerAvailable && Library.isServerAvailable() && Auth && Auth.isLoggedIn()) {
        const promise = Library.saveGeneratedToServer(bookId, activityId, {
          title: (pack && pack.title) || (bookId + ' ' + activityId),
          cefr: cefr,
          source: source,
          pack: pack,
          html: html
        });
        cloudSaves[packKey(bookId, activityId)] = promise;
        promise.catch(function (err) {
          console.warn('Cloud save of generated activity failed:', err);
        });
      } else {
        delete cloudSaves[packKey(bookId, activityId)];
      }
      return saved;
    },

    mergeServerPacks(serverPacks) {
      if (!serverPacks || typeof serverPacks !== 'object') return 0;
      const packs = readPacks();
      let n = 0;
      Object.keys(serverPacks).forEach(function (key) {
        const server = serverPacks[key];
        if (!server || !server.html) return;
        packs[key] = server;
        n += 1;
      });
      writePacks(packs);
      return n;
    },

    renderHtml(activityId, pack, bookId) {
      validatePack(activityId, pack);
      return bakeHtml(activityId, pack, bookId || pack.bookId);
    },

    hasBuiltinPack(bookId, activityId) {
      const key = packKey(bookId, activityId);
      const embedded = (global.ACTIVITY_EMBEDDED && global.ACTIVITY_EMBEDDED.packs) || {};
      return !!(embedded[key] || PACK_PATHS[key]);
    },

    async generate(opts) {
      const bookId = opts.bookId;
      const activityId = opts.activityId;
      const cefr = opts.cefr;
      const mode = opts.mode || 'builtin';
      const apiKey = opts.apiKey || '';
      const provider = String(opts.provider || 'gemini').trim() || 'gemini';
      const model = opts.model || '';
      const Domain = global.ActivityDomain;
      const book = Domain.getBook(bookId);
      if (!book) throw new Error('Choose a curriculum book.');
      const breakdown = Domain.getBreakdown ? Domain.getBreakdown(bookId) : null;
      if (!book.units || !book.units.length) {
        throw new Error('This book has no units yet. Analyze a PDF on the Curriculum tab first.');
      }
      const wrongBook = breakdown && Domain.breakdownBookMismatch ? Domain.breakdownBookMismatch(book, breakdown) : '';
      if (wrongBook) {
        throw new Error('The saved word list for ' + book.title + ' looks like it came from ' + wrongBook +
          ' pages, so its games would test the wrong units. On the Curriculum tab, open Units on this book to check it, then re-Analyze or click "This is the right book".');
      }

      let pack;
      let source = 'builtin';
      let offTarget = 0;
      const style = Domain.getSavedStyle ? Domain.getSavedStyle(activityId) : null;

      if (style) {
        if (!breakdown) {
          throw new Error('Analyze the book first (Curriculum tab: upload PDF or photos, then Save).');
        }
        pack = packFromBreakdownForStyle(book, activityId, cefr, breakdown, style.contentSchema);
        source = 'breakdown-style';
      } else if (VOCAB_TYPES[activityId]) {
        if (!breakdown) {
          throw new Error('Analyze the book first (Curriculum tab: upload PDF or photos, then Save).');
        }
        pack = vocabPackFromBreakdown(book, activityId, cefr, breakdown);
        source = 'breakdown';
      } else if (WRITING_TYPES[activityId] && mode === 'ai') {
        if (!apiKey) throw new Error('Paste an API key, or use a built-in pack.');
        if (typeof location !== 'undefined' && location.protocol === 'file:') {
          throw new Error('API blocked — open via local server. Run node serve.js then open http://localhost:8080');
        }
        if (!breakdown) throw new Error('Analyze the book first (Curriculum tab: upload PDF or photos, then Save).');
        const prompt = activityId === 'sentenceScramble'
          ? sentenceScramblePrompt(book, cefr, breakdown)
          : (activityId === 'gapFill' ? gapFillPrompt(book, cefr, breakdown) : writingCardsPrompt(book, cefr, breakdown));
        pack = normalizeWritingPack(activityId, await callAiJson(provider, apiKey, model, prompt));
        offTarget = keepUnitFocus(activityId, pack, breakdown);
        flattenWritingPack(activityId, pack);
        pack.title = book.title + ' ' + activityLabel(activityId);
        pack.cefr = cefr;
        pack.bookId = bookId;
        pack.activityId = activityId;
        source = 'ai-breakdown:' + provider;
      } else if (WRITING_TYPES[activityId] && !this.hasBuiltinPack(bookId, activityId)) {
        if (!breakdown) {
          throw new Error('Analyze the book first (Curriculum tab), or paste an API key so AI can write the content.');
        }
        pack = writingPackFromBreakdown(book, activityId, cefr, breakdown);
        source = 'breakdown';
      } else if ((activityId === 'jumpingOx' || activityId === 'jeopardy') && mode !== 'ai' && !this.hasBuiltinPack(bookId, activityId)) {
        if (!breakdown) {
          throw new Error('Analyze the book first (Curriculum tab), or paste an API key so AI can write the content.');
        }
        pack = activityId === 'jumpingOx'
          ? questionsFromBreakdown(book, activityId, cefr, breakdown)
          : cluesFromBreakdown(book, activityId, cefr, breakdown);
        source = 'breakdown';
      } else if (mode === 'ai') {
        if (!apiKey) throw new Error('Paste an API key, or use a built-in pack.');
        if (typeof location !== 'undefined' && location.protocol === 'file:') {
          throw new Error('API blocked — open via local server. Run node serve.js then open http://localhost:8080');
        }
        const prompt = activityId === 'jumpingOx'
          ? jumpingOxPrompt(book, cefr, breakdown)
          : jeopardyPrompt(book, cefr, breakdown);
        pack = await callAiJson(provider, apiKey, model, prompt);
        offTarget = keepUnitFocus(activityId, pack, breakdown);
        pack.title = pack.title || (book.title + (activityId === 'jumpingOx' ? ' Jumping OX' : ' Review'));
        pack.cefr = cefr;
        pack.bookId = bookId;
        pack.activityId = activityId;
        source = (breakdown ? 'ai-breakdown' : 'ai') + ':' + provider;
      } else {
        pack = await this.loadBuiltinPack(bookId, activityId);
        pack = clone(pack);
        pack.cefr = cefr;
        source = 'builtin';
      }

      try {
        validatePack(activityId, pack);
      } catch (err) {
        if (offTarget) {
          throw new Error(err.message + ' (' + offTarget + ' AI items were removed because they did not practise a word or grammar point from their unit. Try Generate again.)');
        }
        throw err;
      }
      pack.bookId = bookId;
      pack.activityId = activityId;
      const html = bakeHtml(activityId, pack, bookId);
      this.savePack(bookId, activityId, pack, html, cefr, source);
      return {
        pack: pack,
        html: html,
        source: source,
        offTarget: offTarget,
        path: entryPath(bookId, activityId),
        filename: outputFileName(bookId, activityId),
        id: catalogId(bookId, activityId)
      };
    },

    downloadHtml(filename, html) {
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      return { method: 'download', filename: filename };
    },

    getOutputFolderInfo() {
      const supported = supportsDirectoryPicker();
      return {
        supported: supported,
        name: supported ? getStoredFolderName() : ''
      };
    },

    async pickOutputFolder() {
      const handle = await pickAndStoreOutputFolder();
      return {
        supported: true,
        name: (handle && handle.name) || getStoredFolderName()
      };
    },

    async clearOutputFolder() {
      try { await idbClearHandle(); } catch (e) { /* ignore */ }
      setStoredFolderName('');
      return this.getOutputFolderInfo();
    },

    async saveHtml(filename, html, opts) {
      const options = opts || {};
      const pickIfMissing = options.pickIfMissing !== false;
      if (!supportsDirectoryPicker()) {
        return this.downloadHtml(filename, html);
      }
      let dir;
      try {
        dir = await getWritableOutputDir({ pickIfMissing: pickIfMissing });
      } catch (e) {
        const msg = String(e && e.message || e);
        if (msg.indexOf('cancelled') !== -1 || msg.indexOf('Permission') !== -1) throw e;
        return this.downloadHtml(filename, html);
      }
      if (!dir) {
        return this.downloadHtml(filename, html);
      }
      try {
        await writeHtmlToDirectory(dir, filename, html);
        return {
          method: 'folder',
          filename: filename,
          folderName: dir.name || getStoredFolderName()
        };
      } catch (e) {
        return this.downloadHtml(filename, html);
      }
    },

    openHtml(html) {
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener');
    }
  };

  global.ActivityGenerate = Generate;
})(typeof window !== 'undefined' ? window : globalThis);
