/**
 * Activity Loader catalog: load factory data, merge localStorage overlays, query helpers.
 */
(function (global) {
  'use strict';

  const STORAGE_OVERLAY = 'activityLoader.catalogOverlay.v1';
  const STORAGE_PREFS = 'activityLoader.prefs.v1';

  /** Factory catalog (mirrors data/catalog.json). Used when fetch fails on file://. */
  const FACTORY_CATALOG = {
    version: 1,
    levels: [
      { id: 'Red', name: 'Red', band: 'elementary', levelGroup: 'redOrangeYellow', programTrack: 'juniorRainbow', color: '#dc2626' },
      { id: 'Orange', name: 'Orange', band: 'elementary', levelGroup: 'redOrangeYellow', programTrack: 'juniorRainbow', color: '#ea580c' },
      { id: 'Yellow', name: 'Yellow', band: 'elementary', levelGroup: 'redOrangeYellow', programTrack: 'juniorRainbow', color: '#facc15' },
      { id: 'Green', name: 'Green', band: 'elementary', levelGroup: 'greenBlueNavy', programTrack: 'juniorRainbow', color: '#16a34a' },
      { id: 'Blue', name: 'Blue', band: 'elementary', levelGroup: 'greenBlueNavy', programTrack: 'juniorRainbow', color: '#2563eb' },
      { id: 'Navy', name: 'Navy', band: 'elementary', levelGroup: 'greenBlueNavy', programTrack: 'juniorRainbow', color: '#1e3a8a' },
      { id: 'Purple', name: 'Purple', band: 'elementary', levelGroup: 'purple', programTrack: 'juniorRainbow', color: '#9333ea' },
      { id: 'Yeoul', name: 'Yeoul', band: 'elementary', levelGroup: 'yeoulSaemmul', programTrack: 'seniorWaterflow', color: '#e8b8c4' },
      { id: 'Saemmul', name: 'Saemmul', band: 'elementary', levelGroup: 'yeoulSaemmul', programTrack: 'seniorWaterflow', color: '#d9a3a3' },
      { id: 'Garam', name: 'Garam', band: 'elementary', levelGroup: 'badaGaram', programTrack: 'seniorWaterflow', color: '#16a34a' },
      { id: 'Bada', name: 'Bada', band: 'elementary', levelGroup: 'badaGaram', programTrack: 'seniorWaterflow', color: '#16a34a' },
      { id: 'Byeolmaru', name: 'Byeolmaru', band: 'elementary', levelGroup: 'mirinaeByeolmaru', programTrack: 'seniorWaterflow', color: '#2563eb' },
      { id: 'Mirinae', name: 'Mirinae', band: 'elementary', levelGroup: 'mirinaeByeolmaru', programTrack: 'seniorWaterflow', color: '#2563eb' },
      { id: '유마', name: '유마', band: 'middle', grade: '중1', levelGroup: 'middleSchool', programTrack: 'seniorWaterflow', color: '#fef08a' },
      { id: '레오', name: '레오', band: 'middle', grade: '중1', levelGroup: 'middleSchool', programTrack: 'seniorWaterflow', color: '#fef08a' },
      { id: '파보', name: '파보', band: 'middle', grade: '중1', levelGroup: 'middleSchool', programTrack: 'seniorWaterflow', color: '#fef08a' },
      { id: '폴라', name: '폴라', band: 'middle', grade: '중1', levelGroup: 'middleSchool', programTrack: 'seniorWaterflow', color: '#fef08a' },
      { id: '힉스', name: '힉스', band: 'middle', grade: '중2', levelGroup: 'middleSchool', programTrack: 'seniorWaterflow', color: '#bbf7d0' },
      { id: '티카', name: '티카', band: 'middle', grade: '중2', levelGroup: 'middleSchool', programTrack: 'seniorWaterflow', color: '#bbf7d0' },
      { id: '빅티', name: '빅티', band: 'middle', grade: '중2', levelGroup: 'middleSchool', programTrack: 'seniorWaterflow', color: '#bbf7d0' },
      { id: '바이클', name: '바이클', band: 'middle', grade: '중2', levelGroup: 'middleSchool', programTrack: 'seniorWaterflow', color: '#bbf7d0' },
      { id: '안나', name: '안나', band: 'middle', grade: '중3', levelGroup: 'middleSchool', programTrack: 'seniorWaterflow', color: '#bfdbfe' },
      { id: '낭가', name: '낭가', band: 'middle', grade: '중3', levelGroup: 'middleSchool', programTrack: 'seniorWaterflow', color: '#bfdbfe' },
      { id: '로체', name: '로체', band: 'middle', grade: '중3', levelGroup: 'middleSchool', programTrack: 'seniorWaterflow', color: '#bfdbfe' },
      { id: '칡춘', name: '칡춘', band: 'middle', grade: '중3', levelGroup: 'middleSchool', programTrack: 'seniorWaterflow', color: '#bfdbfe' }
    ],
    books: [
      { id: 'write-now-1', title: 'Write Now 1', series: 'write-now', levelIds: ['Green'], unitsHint: 8 },
      { id: 'early-writers-1', title: 'Early Writers 1', series: 'early-writers', levelIds: ['Green'], unitsHint: 8 },
      { id: 'write-right-1', title: 'Write Right 1', series: 'write-right', levelIds: ['Green'], unitsHint: 8 },
      { id: 'best-writing-starter-1', title: 'The Best Writing Starter 1', series: 'best-writing-starter', levelIds: ['Green'], unitsHint: 8 },
      { id: 'write-now-2', title: 'Write Now 2', series: 'write-now', levelIds: ['Blue'], unitsHint: 8 },
      { id: 'early-writers-2', title: 'Early Writers 2', series: 'early-writers', levelIds: ['Blue'], unitsHint: 8 }
    ],
    activities: [
      {
        id: 'wn1-vocabulary',
        bookId: 'write-now-1',
        type: 'vocabulary',
        title: 'Write Now 1 Vocabulary Game',
        entryHtml: 'activities/green/write-now-1/vocabulary/Green - Write Now 1 - Vocabulary.html',
        unitFilter: null,
        status: 'ready',
        cefr: 'A1'
      },
      {
        id: 'wn1-charades',
        bookId: 'write-now-1',
        type: 'charades',
        title: 'Write Now 1 Charades',
        entryHtml: 'activities/green/write-now-1/charades/Green - Write Now 1 - Charades.html',
        unitFilter: null,
        status: 'ready'
      },
      {
        id: 'wn1-vocab-matching',
        bookId: 'write-now-1',
        type: 'teamMatch',
        title: 'Write Now 1 Team Match',
        entryHtml: 'activities/green/write-now-1/team-match/Green - Write Now 1 - Team Match.html',
        unitFilter: null,
        status: 'ready'
      },
      {
        id: 'wn1-jumping-ox',
        bookId: 'write-now-1',
        type: 'jumpingOx',
        title: 'Write Now 1 Jumping OX',
        entryHtml: 'activities/green/write-now-1/jumping-ox/Green - Write Now 1 - Jumping OX.html',
        unitFilter: null,
        status: 'ready',
        cefr: 'A1'
      },
      {
        id: 'wn1-jeopardy',
        bookId: 'write-now-1',
        type: 'jeopardy',
        title: 'Write Now 1 Jeopardy',
        entryHtml: 'activities/green/write-now-1/jeopardy/Green - Write Now 1 - Jeopardy.html',
        unitFilter: null,
        status: 'ready',
        cefr: 'A1'
      },
      {
        id: 'ew1-jumping-ox',
        bookId: 'early-writers-1',
        type: 'jumpingOx',
        title: 'Early Writers 1 Jumping OX',
        entryHtml: 'activities/green/early-writers-1/jumping-ox/Green - Early Writers 1 - Jumping OX.html',
        unitFilter: null,
        status: 'ready',
        cefr: 'A1'
      },
      {
        id: 'wn2-jumping-ox',
        bookId: 'write-now-2',
        type: 'jumpingOx',
        title: 'Write Now 2 Jumping OX',
        entryHtml: 'activities/blue/write-now-2/jumping-ox/Blue - Write Now 2 - Jumping OX.html',
        unitFilter: null,
        status: 'ready',
        cefr: 'A1'
      },
      {
        id: 'ew2-jumping-ox',
        bookId: 'early-writers-2',
        type: 'jumpingOx',
        title: 'Early Writers 2 Jumping OX',
        entryHtml: 'activities/blue/early-writers-2/jumping-ox/Blue - Early Writers 2 - Jumping OX.html',
        unitFilter: null,
        status: 'ready',
        cefr: 'A1'
      }
    ],
    activityTypes: [
      { id: 'vocabulary', label: 'Vocabulary' },
      { id: 'teamMatch', label: 'Team Match' },
      { id: 'charades', label: 'Charades' },
      { id: 'jeopardy', label: 'Jeopardy' },
      { id: 'jumpingOx', label: 'Jumping OX' },
      { id: 'quizQuizTrade', label: 'Quiz-Quiz-Trade' },
      { id: 'fanNPick', label: 'Fan-N-Pick' },
      { id: 'findSomeoneWho', label: 'Find Someone Who' },
      { id: 'showdown', label: 'Showdown' },
      { id: 'rallyCoach', label: 'RallyCoach' },
      { id: 'lexiQuest', label: 'LexiQuest' }
    ]
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) {
        return fallback;
      }
      return JSON.parse(raw);
    } catch (err) {
      console.warn('ActivityLoader: failed to read', key, err);
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function emptyOverlay() {
    return {
      activitiesAdded: [],
      activityPatches: {},
      hiddenActivityIds: [],
      levelsAdded: [],
      booksAdded: []
    };
  }

  function validateCatalog(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Catalog is missing.');
    }
    if (!Array.isArray(data.levels) || !Array.isArray(data.books) || !Array.isArray(data.activities)) {
      throw new Error('Catalog must include levels, books, and activities arrays.');
    }
    return data;
  }

  function mergeCatalog(factory, overlay) {
    const base = clone(factory);
    const ov = overlay || emptyOverlay();
    const patches = ov.activityPatches || {};
    const hidden = new Set(ov.hiddenActivityIds || []);

    const levels = new Map();
    (base.levels || []).forEach((level) => {
      levels.set(level.id, { ...level });
    });
    (ov.levelsAdded || []).forEach((level) => {
      if (!level || !level.id) return;
      levels.set(level.id, { ...level, added: true });
    });
    base.levels = Array.from(levels.values());

    const books = new Map();
    (base.books || []).forEach((book) => {
      books.set(book.id, { ...book });
    });
    (ov.booksAdded || []).forEach((book) => {
      if (!book || !book.id) return;
      books.set(book.id, { ...book, added: true });
    });
    base.books = Array.from(books.values());

    const byId = new Map();
    (base.activities || []).forEach((act) => {
      byId.set(act.id, { ...act });
    });

    Object.keys(patches).forEach((id) => {
      const patch = patches[id];
      if (!patch) {
        return;
      }
      const existing = byId.get(id);
      if (existing) {
        byId.set(id, { ...existing, ...patch, id });
      }
    });

    (ov.activitiesAdded || []).forEach((act) => {
      if (!act || !act.id) {
        return;
      }
      const patch = patches[act.id] || {};
      byId.set(act.id, { ...act, ...patch, id: act.id });
    });

    base.activities = Array.from(byId.values()).map((act) => ({
      ...act,
      hidden: hidden.has(act.id) || !!act.hidden
    }));

    return base;
  }


  const CatalogApi = {
    factory: null,
    catalog: null,
    overlay: emptyOverlay(),
    source: 'embedded',

    async init() {
      this.source = 'embedded';
      try {
        const res = await fetch('data/catalog.json', { cache: 'no-store' });
        if (res.ok) {
          this.factory = validateCatalog(await res.json());
          this.source = 'json';
        } else {
          this.factory = validateCatalog(clone(FACTORY_CATALOG));
        }
      } catch (err) {
        this.factory = validateCatalog(clone(FACTORY_CATALOG));
      }
      this.overlay = Object.assign(emptyOverlay(), readJson(STORAGE_OVERLAY, emptyOverlay()));
      this.catalog = mergeCatalog(this.factory, this.overlay);
      return this.catalog;
    },

    reloadMerged() {
      this.overlay = Object.assign(emptyOverlay(), readJson(STORAGE_OVERLAY, emptyOverlay()));
      this.catalog = mergeCatalog(this.factory, this.overlay);
      return this.catalog;
    },

    saveOverlay() {
      writeJson(STORAGE_OVERLAY, this.overlay);
      this.catalog = mergeCatalog(this.factory, this.overlay);
      return this.catalog;
    },

    getPrefs() {
      return Object.assign(
        { levelId: 'Green', bookId: 'write-now-1', panel: 'browse' },
        readJson(STORAGE_PREFS, {})
      );
    },

    savePrefs(prefs) {
      writeJson(STORAGE_PREFS, prefs);
    },

    getLevels() {
      return (this.catalog && this.catalog.levels) || [];
    },

    getLevel(id) {
      return this.getLevels().find((l) => l.id === id) || null;
    },

    getBooksForLevel(levelId) {
      return ((this.catalog && this.catalog.books) || []).filter((b) =>
        Array.isArray(b.levelIds) && b.levelIds.includes(levelId)
      );
    },

    getBook(id) {
      return ((this.catalog && this.catalog.books) || []).find((b) => b.id === id) || null;
    },

    getActivityTypes() {
      return (this.catalog && this.catalog.activityTypes) || [];
    },

    getActivitiesForBook(bookId, { includeHidden = false } = {}) {
      return ((this.catalog && this.catalog.activities) || []).filter((a) => {
        if (a.bookId !== bookId) {
          return false;
        }
        if (!includeHidden && a.hidden) {
          return false;
        }
        return true;
      });
    },

    getAllActivities({ includeHidden = true } = {}) {
      return ((this.catalog && this.catalog.activities) || []).filter((a) =>
        includeHidden ? true : !a.hidden
      );
    },

    getActivity(id) {
      return this.getAllActivities().find((a) => a.id === id) || null;
    },

    isFactoryActivity(id) {
      return !!(this.factory && this.factory.activities.some((a) => a.id === id));
    },

    isFactoryLevel(id) {
      return !!(this.factory && this.factory.levels.some((l) => l.id === id));
    },

    isFactoryBook(id) {
      return !!(this.factory && this.factory.books.some((b) => b.id === id));
    },

    addLevel(level) {
      const name = String(level && level.name ? level.name : '').trim();
      if (!name) throw new Error('Type a level name, for example Gold or Navy.');
      const id = String(level.id || name).trim();
      const exists = this.getLevels().some((l) => String(l.id).toLowerCase() === id.toLowerCase());
      if (exists) throw new Error('That level is already in the list.');
      const clean = {
        id: id,
        name: name,
        band: level.band === 'middle' ? 'middle' : 'elementary',
        levelGroup: String(level.levelGroup || 'custom'),
        programTrack: level.programTrack === 'seniorWaterflow' ? 'seniorWaterflow' : 'juniorRainbow',
        color: String(level.color || '#5b8def'),
        added: true
      };
      if (level.grade) clean.grade = String(level.grade).trim();
      this.overlay.levelsAdded = this.overlay.levelsAdded || [];
      this.overlay.levelsAdded.push(clean);
      return this.saveOverlay();
    },

    addBook(book) {
      const title = String(book && book.title ? book.title : '').trim();
      if (!title) throw new Error('Type a book title, for example Write Now 3.');
      const id = String(book.id || this.slugifyId(title)).trim();
      if (this.getBook(id)) throw new Error('That book is already in the list.');
      const levelIds = Array.isArray(book.levelIds) ? book.levelIds.filter(Boolean) : [];
      if (!levelIds.length) throw new Error('Pick a class level for this book.');
      const missing = levelIds.filter((lid) => !this.getLevel(lid));
      if (missing.length) throw new Error('Unknown level: ' + missing.join(', ') + '. Add the level first.');
      const clean = {
        id: id,
        title: title,
        series: String(book.series || this.slugifyId(title).replace(/-\d+$/, '') || id),
        levelIds: levelIds,
        unitsHint: Number(book.unitsHint) || 0,
        cefr: book.cefr ? String(book.cefr) : 'A1',
        added: true
      };
      this.overlay.booksAdded = this.overlay.booksAdded || [];
      this.overlay.booksAdded.push(clean);
      return this.saveOverlay();
    },

    removeAddedLevel(id) {
      if (this.isFactoryLevel(id)) {
        throw new Error('Built-in Rainbow levels cannot be removed.');
      }
      const used = this.getBooksForLevel(id);
      if (used.length) {
        throw new Error('Move or remove books on this level first: ' + used.map((b) => b.title).join(', '));
      }
      this.overlay.levelsAdded = (this.overlay.levelsAdded || []).filter((l) => l.id !== id);
      return this.saveOverlay();
    },

    removeAddedBook(id) {
      if (this.isFactoryBook(id)) {
        throw new Error('Built-in books cannot be removed here.');
      }
      this.overlay.booksAdded = (this.overlay.booksAdded || []).filter((b) => b.id !== id);
      this.overlay.activitiesAdded = (this.overlay.activitiesAdded || []).filter((a) => a.bookId !== id);
      return this.saveOverlay();
    },

    upsertActivity(activity) {
      if (!activity || !activity.id) {
        throw new Error('Activity needs a stable id.');
      }
      const clean = {
        id: String(activity.id).trim(),
        bookId: String(activity.bookId || '').trim(),
        type: String(activity.type || 'vocabulary').trim(),
        title: String(activity.title || '').trim(),
        entryHtml: activity.entryHtml || '',
        unitFilter: activity.unitFilter == null || activity.unitFilter === ''
          ? null
          : String(activity.unitFilter),
        status: String(activity.status || 'draft').trim(),
        cefr: activity.cefr ? String(activity.cefr) : null,
        generated: !!activity.generated
      };

      if (!clean.title || !clean.bookId || !clean.entryHtml) {
        throw new Error('Title, book, and file path are required.');
      }

      if (this.isFactoryActivity(clean.id)) {
        this.overlay.activityPatches[clean.id] = {
          ...(this.overlay.activityPatches[clean.id] || {}),
          ...clean
        };
      } else {
        const idx = this.overlay.activitiesAdded.findIndex((a) => a.id === clean.id);
        if (idx >= 0) {
          this.overlay.activitiesAdded[idx] = {
            ...this.overlay.activitiesAdded[idx],
            ...clean
          };
        } else {
          this.overlay.activitiesAdded.push(clean);
        }
        delete this.overlay.activityPatches[clean.id];
      }

      this.overlay.hiddenActivityIds = (this.overlay.hiddenActivityIds || []).filter((id) => id !== clean.id);
      return this.saveOverlay();
    },

    setActivityHidden(id, hidden) {
      const set = new Set(this.overlay.hiddenActivityIds || []);
      if (hidden) {
        set.add(id);
      } else {
        set.delete(id);
      }
      this.overlay.hiddenActivityIds = Array.from(set);
      return this.saveOverlay();
    },

    removeAddedActivity(id) {
      if (this.isFactoryActivity(id)) {
        this.setActivityHidden(id, true);
        return this.catalog;
      }
      this.overlay.activitiesAdded = (this.overlay.activitiesAdded || []).filter((a) => a.id !== id);
      if (this.overlay.activityPatches) {
        delete this.overlay.activityPatches[id];
      }
      this.overlay.hiddenActivityIds = (this.overlay.hiddenActivityIds || []).filter((hid) => hid !== id);
      return this.saveOverlay();
    },

    resetOverlay() {
      const keepLevels = (this.overlay && this.overlay.levelsAdded) || [];
      const keepBooks = (this.overlay && this.overlay.booksAdded) || [];
      this.overlay = emptyOverlay();
      this.overlay.levelsAdded = keepLevels;
      this.overlay.booksAdded = keepBooks;
      writeJson(STORAGE_OVERLAY, this.overlay);
      this.catalog = mergeCatalog(this.factory, this.overlay);
      return this.catalog;
    },

    slugifyId(text) {
      return String(text || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9가-힣]+/gi, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 48) || ('activity-' + Date.now());
    }
  };

  global.ActivityLoaderCatalog = CatalogApi;
})(typeof window !== 'undefined' ? window : globalThis);
