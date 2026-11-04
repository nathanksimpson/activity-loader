/**
 * Activity Loader accounts + sync.
 *
 * The app keeps its saved data in a few localStorage keys (activityLoader.*).
 * On the live site this file:
 *   1. checks sign-in (shows the Google sign-in screen if needed),
 *   2. picks a workspace (solo or team) and loads that workspace's data
 *      into localStorage before the rest of the app starts,
 *   3. watches writes to those keys and sends them to the server,
 *   4. pulls teammates' changes when the tab is focused again.
 *
 * Opened from a file or `node serve.js` (no /api), it does nothing and the app
 * works offline exactly as before.
 *
 * Each saved key is stored on the server one entry at a time (one book's
 * breakdown, one game, …) so two teachers editing different things never
 * overwrite each other. If both edit the same entry, the changes are merged.
 */
(function (global) {
  'use strict';

  const SYNCED_KEYS = [
    'activityLoader.curriculaOverlay.v1',
    'activityLoader.breakdowns.v1',
    'activityLoader.booksAdded.v1',
    'activityLoader.activityStyles.v1',
    'activityLoader.catalogOverlay.v1',
    'activityLoader.generatedPacks.v1',
    'activityLoader.importedTemplates.v1'
  ];
  const SYNCED = new Set(SYNCED_KEYS);
  const WS_PREF = 'activitySync.workspace';
  const BOUND = 'activitySync.boundWorkspace';
  const WHOLE = ''; // item name used when a value is not a plain object

  const rawGet = Storage.prototype.getItem;
  const rawSet = Storage.prototype.setItem;
  const rawRemove = Storage.prototype.removeItem;
  const store = global.localStorage;

  let online = false;
  let me = null;
  let workspace = null;
  let known = {};          // key -> { item -> { version, value } }  (what the server has)
  let lastServerTime = 0;
  const dirty = new Set();
  let flushTimer = 0;
  let flushing = null;
  let retryDelay = 2000;
  let statusEl = null;
  let usageEl = null;

  /* ---------------- small helpers ---------------- */

  function isPlainObject(v) {
    return v !== null && typeof v === 'object' && !Array.isArray(v);
  }

  function parse(text) {
    try { return JSON.parse(text); } catch (e) { return undefined; }
  }

  function same(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    Object.keys(attrs || {}).forEach((k) => {
      if (k === 'text') node.textContent = attrs[k];
      else if (k === 'class') node.className = attrs[k];
      else if (k.startsWith('on')) node.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== false && attrs[k] != null) node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach((c) => { if (c) node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return node;
  }

  async function api(path, opts) {
    const o = opts || {};
    const headers = { 'Content-Type': 'application/json' };
    if (workspace) headers['X-Workspace'] = workspace.id;
    let res;
    try {
      res = await fetch(path, {
        method: o.method || 'GET',
        headers: headers,
        body: o.body != null ? JSON.stringify(o.body) : undefined,
        credentials: 'same-origin',
        keepalive: !!o.keepalive
      });
    } catch (e) {
      const err = new Error('Could not reach the Activity Loader server. Check your internet connection.');
      err.network = true;
      throw err;
    }
    const data = await res.json().catch(() => ({}));
    if (res.status === 401 && data.signin) {
      showSignIn();
      throw new Error('Please sign in again.');
    }
    if (!res.ok) {
      const err = new Error(data.error || ('Server error (' + res.status + ').'));
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  /* ---------------- encode / decode saved values ---------------- */

  /** localStorage string -> { item -> string } as the server stores it. */
  function splitValue(text) {
    if (text == null) return {};
    const parsed = parse(text);
    if (!isPlainObject(parsed)) return { [WHOLE]: text };
    const out = {};
    Object.keys(parsed).forEach((item) => { out[item] = JSON.stringify(parsed[item]); });
    return out;
  }

  /** server items -> localStorage string (or null when nothing is saved). */
  function joinItems(items) {
    const names = Object.keys(items || {}).filter((n) => items[n] && items[n].value != null);
    if (!names.length) return null;
    if (names.includes(WHOLE)) return items[WHOLE].value;
    const obj = {};
    names.forEach((n) => { obj[n] = parse(items[n].value); });
    return JSON.stringify(obj);
  }

  /* ---------------- three-way merge for conflicts ---------------- */

  function mergeById(base, local, remote) {
    const idOf = (x) => (isPlainObject(x) && x.id != null ? String(x.id) : null);
    const index = (list) => {
      const map = new Map();
      list.forEach((x) => map.set(idOf(x), x));
      return map;
    };
    const b = index(base);
    const l = index(local);
    const out = remote.slice();
    const pos = (id) => out.findIndex((x) => idOf(x) === id);
    l.forEach((item, id) => {
      const i = pos(id);
      if (!b.has(id)) {                        // added here
        if (i >= 0) out[i] = item; else out.push(item);
      } else if (!same(item, b.get(id))) {      // changed here
        if (i >= 0) out[i] = merge3(b.get(id), item, out[i]); else out.push(item);
      }
    });
    b.forEach((item, id) => {                  // deleted here
      if (!l.has(id)) {
        const i = pos(id);
        if (i >= 0 && same(out[i], item)) out.splice(i, 1);
      }
    });
    return out;
  }

  function merge3(base, local, remote) {
    if (same(local, base)) return remote;
    if (same(remote, base) || same(local, remote)) return local;
    if (isPlainObject(local) && isPlainObject(remote)) {
      const b = isPlainObject(base) ? base : {};
      const out = {};
      new Set([...Object.keys(local), ...Object.keys(remote), ...Object.keys(b)]).forEach((k) => {
        const v = merge3(b[k], local[k], remote[k]);
        if (v !== undefined) out[k] = v;
      });
      return out;
    }
    const allIdLists = [base || [], local, remote].every((list) => Array.isArray(list) &&
      list.every((x) => isPlainObject(x) && x.id != null));
    if (allIdLists) return mergeById(base || [], local, remote);
    return local;                              // same scalar edited both places: this edit wins
  }

  /* ---------------- local storage hooks ---------------- */

  function installHooks() {
    Storage.prototype.setItem = function (k, v) {
      rawSet.call(this, k, v);
      if (this === store && SYNCED.has(k)) markDirty(k);
    };
    Storage.prototype.removeItem = function (k) {
      rawRemove.call(this, k);
      if (this === store && SYNCED.has(k)) markDirty(k);
    };
  }

  function markDirty(key) {
    dirty.add(key);
    setStatus('saving');
    clearTimeout(flushTimer);
    flushTimer = setTimeout(flush, 700);
  }

  function buildChanges(key) {
    const want = splitValue(rawGet.call(store, key));
    const have = known[key] || {};
    const changes = [];
    Object.keys(want).forEach((item) => {
      const cur = have[item];
      if (!cur || cur.value !== want[item]) changes.push({ key, item, value: want[item], base: cur ? cur.version : 0 });
    });
    Object.keys(have).forEach((item) => {
      if (have[item].value != null && !(item in want)) changes.push({ key, item, value: null, base: have[item].version });
    });
    return changes;
  }

  async function flush(opts) {
    if (flushing) { await flushing; if (!dirty.size) return; }
    if (!dirty.size) { setStatus('saved'); return; }
    const keys = [...dirty];
    dirty.clear();
    flushing = (async () => {
      try {
        for (let round = 0; round < 4; round++) {
          let changes = [];
          keys.forEach((k) => { changes = changes.concat(buildChanges(k)); });
          if (!changes.length) break;
          const res = await api('/api/data', { method: 'POST', body: { changes: changes.slice(0, 400) }, keepalive: !!(opts && opts.keepalive) });
          lastServerTime = Math.max(lastServerTime, res.serverTime || 0);
          const sent = new Map(changes.map((c) => [c.key + '\u0000' + c.item, c]));
          res.applied.forEach((a) => {
            const c = sent.get(a.key + '\u0000' + a.item);
            known[a.key] = known[a.key] || {};
            known[a.key][a.item] = { version: a.version, value: c ? c.value : null };
          });
          if (!res.conflicts.length && changes.length <= 400) break;
          res.conflicts.forEach((row) => resolveConflict(row));
        }
        retryDelay = 2000;
        setStatus(dirty.size ? 'saving' : 'saved');
      } catch (err) {
        keys.forEach((k) => dirty.add(k));
        if (err.status === 413) {
          setStatus('error', err.message);
          return;
        }
        setStatus('error', err.network ? 'Offline — will retry' : err.message);
        clearTimeout(flushTimer);
        flushTimer = setTimeout(flush, retryDelay);
        retryDelay = Math.min(retryDelay * 2, 60000);
      } finally {
        flushing = null;
      }
    })();
    return flushing;
  }

  /** Someone else changed an entry we also changed: merge, keep both edits. */
  function resolveConflict(row) {
    const key = row.key;
    const item = row.item;
    const have = (known[key] = known[key] || {});
    const baseText = have[item] ? have[item].value : null;
    have[item] = { version: row.version, value: row.value };
    const localAll = parse(rawGet.call(store, key));
    if (item === WHOLE) {
      const merged = merge3(parse(baseText), localAll, parse(row.value));
      writeLocal(key, merged === undefined ? null : JSON.stringify(merged));
      return;
    }
    const localObj = isPlainObject(localAll) ? localAll : {};
    const merged = merge3(parse(baseText), localObj[item], row.value == null ? undefined : parse(row.value));
    if (merged === undefined) delete localObj[item]; else localObj[item] = merged;
    writeLocal(key, JSON.stringify(localObj));
  }

  function writeLocal(key, text) {
    try {
      if (text == null) rawRemove.call(store, key);
      else rawSet.call(store, key, text);
    } catch (e) {
      console.warn('Activity Loader: this browser ran out of space for', key, e);
      setStatus('error', 'This browser is full — some games only open after a refresh.');
    }
  }

  /* ---------------- loading & pulling ---------------- */

  function absorbRows(rows) {
    const touched = new Set();
    rows.forEach((r) => {
      known[r.key] = known[r.key] || {};
      const cur = known[r.key][r.item];
      if (cur && cur.version >= r.version) return;
      if (dirty.has(r.key)) {
        resolveConflict(r);
      } else {
        known[r.key][r.item] = { version: r.version, value: r.value };
        touched.add(r.key);
      }
      lastServerTime = Math.max(lastServerTime, r.updated_at || 0);
    });
    touched.forEach((key) => writeLocal(key, joinItems(known[key])));
    return touched.size;
  }

  async function loadWorkspaceData() {
    known = {};
    const res = await api('/api/data');
    lastServerTime = res.serverTime || 0;
    const legacy = rawGet.call(store, BOUND) == null
      ? SYNCED_KEYS.filter((k) => rawGet.call(store, k) != null)
      : [];
    const localCopies = {};
    legacy.forEach((k) => { localCopies[k] = rawGet.call(store, k); });

    SYNCED_KEYS.forEach((k) => rawRemove.call(store, k));
    absorbRows(res.items || []);
    rawSet.call(store, BOUND, workspace.id);

    // Data saved in this browser before accounts existed: offer to copy it in.
    if (legacy.length && confirm(
      'This browser has books, word lists or games saved from before you signed in.\n\n' +
      'Copy them into "' + workspace.name + '"? (Choose Cancel to leave them out.)')) {
      legacy.forEach((k) => {
        const serverObj = parse(rawGet.call(store, k));
        const localObj = parse(localCopies[k]);
        const merged = isPlainObject(serverObj) && isPlainObject(localObj)
          ? Object.assign({}, localObj, serverObj)
          : (serverObj != null ? merge3(undefined, localObj, serverObj) : localObj);
        writeLocal(k, JSON.stringify(merged));
        markDirty(k);
      });
    }
  }

  async function pull() {
    if (!online || !workspace || document.visibilityState !== 'visible') return;
    try {
      const res = await api('/api/data?since=' + Math.max(0, lastServerTime - 5000));
      const changed = absorbRows(res.items || []);
      lastServerTime = Math.max(lastServerTime, res.serverTime || 0);
      if (changed && typeof Sync.onRemoteChange === 'function') Sync.onRemoteChange();
      const fresh = await api('/api/me');
      me = fresh;
      const ws = fresh.workspaces.find((w) => w.id === workspace.id);
      if (ws) { workspace = ws; renderUsage(); }
    } catch (e) {
      console.warn('Activity Loader: could not check for team changes', e);
    }
  }

  /* ---------------- UI: sign-in screen ---------------- */

  function showSignIn() {
    online = false;
    const back = location.pathname + location.search;
    document.body.innerHTML = '';
    document.body.appendChild(el('main', { class: 'signin-page' }, [
      el('div', { class: 'signin-card' }, [
        el('h1', { text: 'Activity Loader' }),
        el('p', { class: 'signin-lead', text: 'Turn your textbook into classroom games — Jumping OX, Jeopardy, vocabulary, Kagan cards and more.' }),
        el('ul', { class: 'signin-points' }, [
          el('li', { text: 'Upload a unit, get its word and grammar list.' }),
          el('li', { text: 'Generate ready-to-play games for every unit.' }),
          el('li', { text: 'Share books and games with your whole academy.' })
        ]),
        el('a', { class: 'btn btn-primary signin-google', href: '/auth/google?return=' + encodeURIComponent(back) }, [
          el('span', { class: 'g-mark', 'aria-hidden': 'true', text: 'G' }),
          'Sign in with Google'
        ]),
        el('p', { class: 'hint', text: 'Your first sign-in creates your own workspace.' })
      ])
    ]));
  }

  /* ---------------- UI: account bar ---------------- */

  function setStatus(state, message) {
    if (!statusEl) return;
    statusEl.dataset.state = state;
    statusEl.textContent = state === 'saving' ? 'Saving…' : state === 'saved' ? 'Saved' : (message || 'Not saved');
    statusEl.title = state === 'error' ? (message || '') : 'Your books and games are saved to ' + (workspace ? workspace.name : 'your account');
  }

  function renderUsage() {
    if (!usageEl || !workspace) return;
    if (workspace.aiMode !== 'included') {
      usageEl.textContent = 'AI: your own key';
      usageEl.title = 'This workspace uses each teacher\'s own AI key.';
    } else {
      usageEl.textContent = 'AI ' + workspace.aiUsed + ' / ' + workspace.aiLimit;
      usageEl.title = 'Included AI requests used this month (' + me.month + ').';
      usageEl.dataset.full = workspace.aiUsed >= workspace.aiLimit ? '1' : '';
    }
  }

  function switchWorkspace(id) {
    if (!id || (workspace && id === workspace.id)) return;
    const go = () => {
      rawSet.call(store, WS_PREF, id);
      location.reload();
    };
    if (dirty.size || flushing) flush().then(go, go); else go();
  }

  function renderAccountBar() {
    const header = document.querySelector('.app-header');
    if (!header) return;
    const select = el('select', { class: 'select ws-select', 'aria-label': 'Workspace', onchange: (e) => switchWorkspace(e.target.value) });
    me.workspaces.forEach((w) => {
      select.appendChild(el('option', { value: w.id, text: w.kind === 'team' ? w.name + ' (team)' : w.name }));
    });
    select.value = workspace.id;
    statusEl = el('span', { class: 'sync-status', 'aria-live': 'polite' });
    usageEl = el('span', { class: 'ai-usage' });
    const bar = el('div', { class: 'account-bar' }, [
      el('label', { class: 'ws-label' }, [el('span', { class: 'visually-hidden', text: 'Workspace' }), select]),
      statusEl,
      usageEl,
      el('button', { type: 'button', class: 'btn btn-small', onclick: openTeamDialog, text: workspace.kind === 'team' ? 'Team' : 'Teams' }),
      me.user.admin ? el('button', { type: 'button', class: 'btn btn-small', onclick: openAdminDialog, text: 'Admin' }) : null,
      el('span', { class: 'account-user', title: me.user.email, text: me.user.name || me.user.email }),
      el('a', { class: 'btn btn-small btn-ghost', href: '/auth/logout', onclick: (e) => {
        if (dirty.size) { e.preventDefault(); flush().finally(() => { location.href = '/auth/logout'; }); }
      }, text: 'Sign out' })
    ]);
    header.appendChild(bar);
    setStatus('saved');
    renderUsage();
  }

  /* ---------------- UI: team dialog ---------------- */

  function dialogShell(title) {
    const dlg = el('dialog', { class: 'sync-dialog' });
    const body = el('div', { class: 'sync-dialog-body' });
    dlg.appendChild(el('div', { class: 'sync-dialog-head' }, [
      el('h2', { class: 'section-title', text: title }),
      el('button', { type: 'button', class: 'btn btn-small btn-ghost', 'aria-label': 'Close', onclick: () => dlg.close(), text: '✕' })
    ]));
    dlg.appendChild(body);
    dlg.addEventListener('close', () => dlg.remove());
    document.body.appendChild(dlg);
    dlg.showModal();
    return body;
  }

  function note(body, text, isError) {
    let p = body.querySelector('.sync-note');
    if (!p) { p = el('p', { class: 'sync-note' }); body.appendChild(p); }
    p.textContent = text;
    p.dataset.error = isError ? '1' : '';
  }

  async function openTeamDialog() {
    const body = dialogShell(workspace.kind === 'team' ? workspace.name : 'Teams');
    await renderTeamBody(body).catch((e) => note(body, e.message, true));
  }

  async function renderTeamBody(body) {
    body.innerHTML = '';
    if (workspace.kind === 'team') {
      const data = await api('/api/workspaces/' + encodeURIComponent(workspace.id) + '/members');
      body.appendChild(el('p', { class: 'hint', text: 'Everyone here shares the same books, word lists and games.' }));
      const list = el('ul', { class: 'member-list' });
      data.members.forEach((m) => {
        list.appendChild(el('li', {}, [
          el('span', {}, [el('strong', { text: m.name || m.email }), ' ', el('span', { class: 'muted', text: m.email })]),
          el('span', { class: 'member-actions' }, [
            el('span', { class: 'role-tag', text: m.role === 'owner' ? 'Owner' : 'Member' }),
            data.canManage && m.role !== 'owner'
              ? el('button', { type: 'button', class: 'btn btn-small btn-danger', text: 'Remove', onclick: async () => {
                if (!confirm('Remove ' + (m.name || m.email) + ' from ' + workspace.name + '?')) return;
                await api('/api/workspaces/' + encodeURIComponent(workspace.id) + '/members/' + encodeURIComponent(m.id), { method: 'DELETE' });
                renderTeamBody(body);
              } })
              : null
          ])
        ]));
      });
      body.appendChild(list);

      if (data.canManage) {
        const linkBox = el('div', { class: 'invite-box' });
        body.appendChild(el('h3', { class: 'sub-title', text: 'Invite a teacher' }));
        body.appendChild(el('p', { class: 'hint', text: 'Make a link and send it to one teacher. It works once and lasts 14 days. They sign in with Google to join.' }));
        body.appendChild(el('button', { type: 'button', class: 'btn btn-primary', text: 'Make invite link', onclick: async () => {
          try {
            const res = await api('/api/workspaces/' + encodeURIComponent(workspace.id) + '/invites', { method: 'POST' });
            const link = location.origin + res.path;
            const input = el('input', { class: 'input', readonly: 'readonly', value: link });
            linkBox.innerHTML = '';
            linkBox.appendChild(input);
            linkBox.appendChild(el('button', { type: 'button', class: 'btn', text: 'Copy', onclick: async (e) => {
              try { await navigator.clipboard.writeText(link); e.target.textContent = 'Copied'; } catch (err) { input.select(); }
            } }));
            input.select();
          } catch (e) { note(body, e.message, true); }
        } }));
        body.appendChild(linkBox);
        if (data.invites.length) {
          body.appendChild(el('p', { class: 'hint', text: data.invites.length + ' unused invite link' + (data.invites.length === 1 ? '' : 's') + ' still open.' }));
        }
      }
      const isOwner = workspace.role === 'owner';
      body.appendChild(el('div', { class: 'danger-row' }, [
        isOwner
          ? el('button', { type: 'button', class: 'btn btn-danger', text: 'Delete this team', onclick: async () => {
            if (prompt('This deletes the team and ALL its books and games for everyone.\nType the team name to confirm:') !== workspace.name) return;
            await api('/api/workspaces/' + encodeURIComponent(workspace.id), { method: 'DELETE' });
            rawRemove.call(store, WS_PREF);
            location.href = '/';
          } })
          : el('button', { type: 'button', class: 'btn btn-danger', text: 'Leave this team', onclick: async () => {
            if (!confirm('Leave ' + workspace.name + '? You will lose access to its books and games.')) return;
            await api('/api/workspaces/' + encodeURIComponent(workspace.id) + '/members/' + encodeURIComponent(me.user.id), { method: 'DELETE' });
            rawRemove.call(store, WS_PREF);
            location.href = '/';
          } })
      ]));
    } else {
      body.appendChild(el('p', { class: 'hint', text: 'This is your own workspace. To share books and games with other teachers, make a team and invite them.' }));
      const teams = me.workspaces.filter((w) => w.kind === 'team');
      if (teams.length) {
        body.appendChild(el('h3', { class: 'sub-title', text: 'Your teams' }));
        const list = el('ul', { class: 'member-list' });
        teams.forEach((w) => list.appendChild(el('li', {}, [
          el('strong', { text: w.name }),
          el('button', { type: 'button', class: 'btn btn-small', text: 'Open', onclick: () => switchWorkspace(w.id) })
        ])));
        body.appendChild(list);
      }
    }

    body.appendChild(el('h3', { class: 'sub-title', text: 'Make a new team' }));
    const name = el('input', { class: 'input', placeholder: 'Team name, e.g. Simson Academy', maxlength: '80' });
    body.appendChild(el('form', { class: 'inline-form', onsubmit: async (e) => {
      e.preventDefault();
      try {
        const res = await api('/api/workspaces', { method: 'POST', body: { name: name.value } });
        switchWorkspace(res.id);
      } catch (err) { note(body, err.message, true); }
    } }, [name, el('button', { type: 'submit', class: 'btn btn-primary', text: 'Create team' })]));
    body.appendChild(el('p', { class: 'hint', text: 'A new team starts empty. Use Backup → Download on one workspace and Restore in another to copy books across.' }));
  }

  /* ---------------- UI: admin dialog ---------------- */

  async function openAdminDialog() {
    const body = dialogShell('Admin — workspaces');
    try {
      const data = await api('/api/admin/workspaces');
      body.appendChild(el('p', { class: 'hint', text: 'Plan settings for each workspace. Blank limit = site default (' + data.defaultLimit + ' AI requests a month). Month: ' + data.month + '.' }));
      const table = el('table', { class: 'admin-table' });
      table.appendChild(el('thead', {}, [el('tr', {}, ['Workspace', 'Owner', 'People', 'AI', 'Used', 'Limit', ''].map((h) => el('th', { text: h })))]));
      const tbody = el('tbody');
      data.workspaces.forEach((w) => {
        const mode = el('select', { class: 'select' }, [
          el('option', { value: 'included', text: 'Included' }),
          el('option', { value: 'byok', text: 'Own key' })
        ]);
        mode.value = w.ai_mode;
        const limit = el('input', { class: 'input', type: 'number', min: '0', value: w.ai_monthly_limit == null ? '' : String(w.ai_monthly_limit), placeholder: String(data.defaultLimit) });
        const save = el('button', { type: 'button', class: 'btn btn-small', text: 'Save', onclick: async () => {
          try {
            await api('/api/admin/workspaces/' + encodeURIComponent(w.id), { method: 'PATCH', body: { aiMode: mode.value, aiLimit: limit.value === '' ? null : Number(limit.value) } });
            save.textContent = 'Saved';
          } catch (e) { note(body, e.message, true); }
        } });
        tbody.appendChild(el('tr', {}, [
          el('td', {}, [el('strong', { text: w.name }), el('span', { class: 'muted', text: ' ' + w.kind })]),
          el('td', { text: w.owner_email }),
          el('td', { text: String(w.members) }),
          el('td', {}, [mode]),
          el('td', { text: String(w.ai_used || 0) }),
          el('td', {}, [limit]),
          el('td', {}, [save])
        ]));
      });
      table.appendChild(tbody);
      body.appendChild(el('div', { class: 'table-scroll' }, [table]));
    } catch (e) {
      note(body, e.message, true);
    }
  }

  /* ---------------- public API ---------------- */

  const Sync = {
    onRemoteChange: null,

    isOnline() { return online; },
    getWorkspace() { return workspace; },

    siteAiAvailable() {
      return !!(online && workspace && workspace.aiMode === 'included' && workspace.siteAiReady);
    },

    async callSiteAi(payload) {
      try {
        const res = await api('/api/ai', { method: 'POST', body: payload });
        workspace.aiUsed = res.used;
        workspace.aiLimit = res.limit;
        renderUsage();
        return res.text;
      } catch (err) {
        if (err.data && err.data.limitReached) {
          workspace.aiUsed = err.data.limit;
          renderUsage();
          throw new Error(err.message + ' Choose another AI provider and paste your own key, or wait until next month.');
        }
        throw err;
      }
    },

    flush() { return flush(); },

    async ready() {
      if (location.protocol === 'file:') return;
      let res;
      try {
        res = await fetch('/api/me', { credentials: 'same-origin', headers: { Accept: 'application/json' } });
      } catch (e) {
        return; // no server: run offline
      }
      const type = res.headers.get('Content-Type') || '';
      if (type.indexOf('application/json') < 0) return; // serve.js / plain static hosting
      if (res.status === 401) {
        document.addEventListener('DOMContentLoaded', showSignIn);
        if (document.readyState !== 'loading') showSignIn();
        return new Promise(() => {}); // the app never starts until sign-in
      }
      if (!res.ok) throw new Error('The server could not load your account. Try refreshing.');
      me = await res.json();

      const params = new URLSearchParams(location.search);
      const wanted = params.get('workspace') || rawGet.call(store, WS_PREF);
      workspace = me.workspaces.find((w) => w.id === wanted) || me.workspaces[0];
      if (!workspace) throw new Error('Your account has no workspace. Please contact support.');
      rawSet.call(store, WS_PREF, workspace.id);
      if (params.has('workspace')) {
        params.delete('workspace');
        const qs = params.toString();
        history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
      }

      online = true;
      await loadWorkspaceData();
      installHooks();
      renderAccountBar();
      if (dirty.size) setStatus('saving');

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') pull();
        else if (dirty.size) flush({ keepalive: true });
      });
      global.addEventListener('beforeunload', (e) => {
        if (dirty.size || flushing) {
          flush({ keepalive: true });
          e.preventDefault();
          e.returnValue = '';
        }
      });
    }
  };

  global.ActivitySync = Sync;
})(typeof window !== 'undefined' ? window : globalThis);
