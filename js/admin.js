/**
 * CCMU-style admin page for Activity Loader profiles / groups / accounts.
 */
(function () {
  'use strict';

  const Auth = window.ActivityAuth;
  const Library = window.ActivityLibrary;

  const THEME_STORAGE = 'activityLoader.theme.v1';
  const THEME_ORDER = ['system', 'light', 'dark'];
  const THEME_LABELS = { system: 'System', light: 'Light', dark: 'Dark' };
  const THEME_ICONS = {
    system:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>',
    light:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>',
    dark:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 14.5A8.5 8.5 0 1 1 9.5 3a7 7 0 0 0 11.5 11.5z"/></svg>'
  };

  let usersCache = [];
  let groupsCache = [];
  let profilesCache = [];
  let editingGroupId = null;
  let editingProfileId = null;

  function $(id) { return document.getElementById(id); }

  function readThemePref() {
    try {
      const t = localStorage.getItem(THEME_STORAGE) || 'system';
      return THEME_ORDER.indexOf(t) >= 0 ? t : 'system';
    } catch (e) {
      return 'system';
    }
  }

  function applyTheme(theme) {
    const next = THEME_ORDER.indexOf(theme) >= 0 ? theme : 'system';
    const label = THEME_LABELS[next] || 'System';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem(THEME_STORAGE, next); } catch (e) { /* ignore */ }
    const btn = $('theme-toggle');
    if (!btn) return;
    const glyph = btn.querySelector('.theme-toggle-glyph');
    const text = btn.querySelector('.theme-toggle-text');
    if (glyph) {
      glyph.setAttribute('data-theme-icon', next);
      glyph.innerHTML = THEME_ICONS[next] || THEME_ICONS.system;
    }
    if (text) text.textContent = label;
    btn.setAttribute('aria-label', 'Color theme: ' + label + '. Click to change.');
    btn.title = 'Theme: ' + label + ' (click to change)';
  }

  function cycleTheme() {
    const current = readThemePref();
    const idx = THEME_ORDER.indexOf(current);
    const next = THEME_ORDER[(idx + 1) % THEME_ORDER.length];
    applyTheme(next);
  }

  function setStatus(msg, isError) {
    const el = $('adminStatus');
    if (!el) return;
    el.textContent = msg || '';
    el.classList.toggle('error', !!isError);
  }

  function hasAdminAccess(user) {
    if (!user || !user.permissions) return false;
    return user.permissions.indexOf('access_admin_page') >= 0;
  }

  function showTab(name) {
    document.querySelectorAll('.admin-tab').forEach((btn) => {
      const on = btn.getAttribute('data-tab') === name;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    document.querySelectorAll('.admin-section').forEach((panel) => {
      const on = panel.getAttribute('data-panel') === name;
      panel.hidden = !on;
    });
  }

  function renderUsers() {
    const body = $('usersTableBody');
    if (!body) return;
    const q = String(($('accountsSearch') && $('accountsSearch').value) || '').trim().toLowerCase();
    body.innerHTML = '';
    usersCache.filter((u) => !q || String(u.username).toLowerCase().indexOf(q) >= 0).forEach((u) => {
      const tr = document.createElement('tr');
      const profiles = (u.profiles || []).map((p) => p.name).join(', ') || '—';
      tr.innerHTML =
        '<td></td><td></td><td></td><td></td><td class="admin-inline-actions"></td>';
      tr.children[0].textContent = u.username;
      tr.children[1].textContent = u.role;
      tr.children[2].textContent = profiles;
      const badge = document.createElement('span');
      badge.className = 'admin-badge ' + (u.active ? 'is-active' : 'is-inactive');
      badge.textContent = u.active ? 'Active' : 'Deactivated';
      tr.children[3].appendChild(badge);
      const actions = tr.children[4];

      const reset = document.createElement('button');
      reset.type = 'button';
      reset.className = 'btn btn-small';
      reset.textContent = 'Reset password';
      reset.addEventListener('click', async () => {
        const pw = window.prompt('New password for ' + u.username + ' (min 6 characters):');
        if (!pw) return;
        try {
          await Library.updateUser(u.id, { password: pw });
          setStatus('Password updated for ' + u.username + '.');
        } catch (err) {
          setStatus(err.message || String(err), true);
        }
      });

      const roleBtn = document.createElement('button');
      roleBtn.type = 'button';
      roleBtn.className = 'btn btn-small';
      roleBtn.textContent = 'Change role';
      roleBtn.addEventListener('click', async () => {
        const next = window.prompt(
          'Role for ' + u.username + ' (teacher, viewer, head_teacher, user_admin, super_admin):',
          u.role
        );
        if (!next) return;
        try {
          await Library.updateUser(u.id, { role: next.trim() });
          await refreshAll();
          setStatus('Role updated.');
        } catch (err) {
          setStatus(err.message || String(err), true);
        }
      });

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'btn btn-small';
      toggle.textContent = u.active ? 'Deactivate' : 'Activate';
      toggle.addEventListener('click', async () => {
        try {
          await Library.updateUser(u.id, { active: !u.active });
          await refreshAll();
          setStatus(u.active ? 'Deactivated.' : 'Activated.');
        } catch (err) {
          setStatus(err.message || String(err), true);
        }
      });

      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'btn btn-small btn-danger';
      del.textContent = 'Delete';
      del.addEventListener('click', async () => {
        if (!window.confirm('Delete user “' + u.username + '”?')) return;
        try {
          await Library.deleteUser(u.id);
          await refreshAll();
          setStatus('User deleted.');
        } catch (err) {
          setStatus(err.message || String(err), true);
        }
      });

      actions.appendChild(reset);
      actions.appendChild(roleBtn);
      actions.appendChild(toggle);
      actions.appendChild(del);
      body.appendChild(tr);
    });
  }

  function renderGroups() {
    const list = $('groupsList');
    if (!list) return;
    list.innerHTML = '';
    groupsCache.forEach((g) => {
      const li = document.createElement('li');
      li.className = 'manage-item';
      const left = document.createElement('div');
      left.innerHTML = '<strong></strong><span class="hint"></span>';
      left.querySelector('strong').textContent = g.name;
      left.querySelector('.hint').textContent =
        (g.members || []).map((m) => m.username).join(', ') || 'No members';
      const actions = document.createElement('div');
      actions.className = 'admin-inline-actions';
      const edit = document.createElement('button');
      edit.type = 'button';
      edit.className = 'btn btn-small';
      edit.textContent = 'Members';
      edit.addEventListener('click', () => openGroupEditor(g.id));
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'btn btn-small btn-danger';
      del.textContent = 'Delete';
      del.addEventListener('click', async () => {
        if (!window.confirm('Delete group “' + g.name + '”?')) return;
        try {
          await Library.deleteGroup(g.id);
          await refreshAll();
          setStatus('Group deleted.');
        } catch (err) {
          setStatus(err.message || String(err), true);
        }
      });
      actions.appendChild(edit);
      actions.appendChild(del);
      li.appendChild(left);
      li.appendChild(actions);
      list.appendChild(li);
    });
  }

  function openGroupEditor(groupId) {
    editingGroupId = groupId;
    const g = groupsCache.find((x) => x.id === groupId);
    const card = $('groupEditCard');
    const host = $('groupMemberChecks');
    if (!g || !card || !host) return;
    $('groupEditTitle').textContent = 'Members — ' + g.name;
    const memberIds = {};
    (g.members || []).forEach((m) => { memberIds[m.id] = true; });
    host.innerHTML = '';
    usersCache.forEach((u) => {
      const label = document.createElement('label');
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.value = u.id;
      cb.checked = !!memberIds[u.id];
      label.appendChild(cb);
      label.appendChild(document.createTextNode(' ' + u.username));
      host.appendChild(label);
    });
    card.hidden = false;
  }

  function fillPackProfileSelect() {
    const select = $('packProfile');
    if (!select) return;
    const prev = select.value;
    select.innerHTML = '';
    const opt0 = document.createElement('option');
    opt0.value = '';
    opt0.textContent = 'Choose profile';
    select.appendChild(opt0);
    profilesCache.forEach((p) => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.name;
      select.appendChild(opt);
    });
    if (prev) select.value = prev;
  }

  function renderProfiles() {
    const list = $('profilesList');
    if (!list) return;
    list.innerHTML = '';
    profilesCache.forEach((p) => {
      const li = document.createElement('li');
      li.className = 'manage-item';
      const left = document.createElement('div');
      left.innerHTML = '<strong></strong><span class="hint"></span>';
      left.querySelector('strong').textContent = p.name;
      left.querySelector('.hint').textContent = p.slug || p.id;
      const actions = document.createElement('div');
      actions.className = 'admin-inline-actions';
      const access = document.createElement('button');
      access.type = 'button';
      access.className = 'btn btn-small btn-primary';
      access.textContent = 'Access';
      access.addEventListener('click', () => openProfileAccess(p.id));
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'btn btn-small btn-danger';
      del.textContent = 'Delete';
      del.addEventListener('click', async () => {
        if (!window.confirm('Delete profile “' + p.name + '”?')) return;
        try {
          await Library.deleteProfile(p.id);
          await refreshAll();
          setStatus('Profile deleted.');
        } catch (err) {
          setStatus(err.message || String(err), true);
        }
      });
      actions.appendChild(access);
      actions.appendChild(del);
      li.appendChild(left);
      li.appendChild(actions);
      list.appendChild(li);
    });
    fillPackProfileSelect();
  }

  async function openProfileAccess(profileId) {
    editingProfileId = profileId;
    const p = profilesCache.find((x) => x.id === profileId);
    const card = $('profileAccessCard');
    if (!p || !card) return;
    $('profileAccessTitle').textContent = 'Access — ' + p.name;
    const data = await Library.getProfileAccess(profileId);
    const userMap = {};
    const groupMap = {};
    (data.users || []).forEach((u) => { userMap[u.id] = u.access_level || u.accessLevel || 'viewer'; });
    (data.groups || []).forEach((g) => { groupMap[g.id] = g.access_level || g.accessLevel || 'viewer'; });

    const userHost = $('profileUserAccess');
    const groupHost = $('profileGroupAccess');
    userHost.innerHTML = '';
    groupHost.innerHTML = '';

    usersCache.forEach((u) => {
      const wrap = document.createElement('label');
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.dataset.userId = u.id;
      cb.checked = !!userMap[u.id];
      const sel = document.createElement('select');
      sel.className = 'select';
      sel.style.width = 'auto';
      sel.innerHTML = '<option value="viewer">viewer</option><option value="editor">editor</option>';
      sel.value = userMap[u.id] || 'viewer';
      wrap.appendChild(cb);
      wrap.appendChild(document.createTextNode(' ' + u.username + ' '));
      wrap.appendChild(sel);
      userHost.appendChild(wrap);
    });

    groupsCache.forEach((g) => {
      const wrap = document.createElement('label');
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.dataset.groupId = g.id;
      cb.checked = !!groupMap[g.id];
      const sel = document.createElement('select');
      sel.className = 'select';
      sel.style.width = 'auto';
      sel.innerHTML = '<option value="viewer">viewer</option><option value="editor">editor</option>';
      sel.value = groupMap[g.id] || 'viewer';
      wrap.appendChild(cb);
      wrap.appendChild(document.createTextNode(' ' + g.name + ' '));
      wrap.appendChild(sel);
      groupHost.appendChild(wrap);
    });

    card.hidden = false;
  }

  async function refreshAll() {
    const [u, g, p] = await Promise.all([
      Library.listUsers(),
      Library.listGroups(),
      Library.listProfiles()
    ]);
    usersCache = u.users || [];
    groupsCache = g.groups || [];
    profilesCache = p.profiles || [];
    renderUsers();
    renderGroups();
    renderProfiles();
  }

  async function init() {
    await Auth.probe();
    if (!Auth.isServerAvailable()) {
      setStatus('Admin needs the Cloudflare site (not a local file).', true);
      $('adminSignInHint').hidden = false;
      return;
    }
    await Auth.refreshMe();
    if (!Auth.isLoggedIn()) {
      setStatus('Please sign in on the main app first, then open Admin.', true);
      $('adminSignInHint').hidden = false;
      return;
    }
    const user = Auth.getUser();
    $('adminWho').textContent = user.username + ' · ' + user.role;
    if (!hasAdminAccess(user)) {
      setStatus('Your role cannot open the admin page.', true);
      return;
    }
    $('adminTabBar').hidden = false;
    await refreshAll();
    setStatus('Ready.');
  }

  function bind() {
    const themeBtn = $('theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', cycleTheme);

    document.querySelectorAll('.admin-tab').forEach((btn) => {
      btn.addEventListener('click', () => showTab(btn.getAttribute('data-tab')));
    });
    if ($('accountsSearch')) $('accountsSearch').addEventListener('input', renderUsers);

    $('addUserForm').addEventListener('submit', async (ev) => {
      ev.preventDefault();
      try {
        await Library.createUser({
          username: $('newUsername').value.trim(),
          password: $('newPassword').value,
          role: $('newRole').value
        });
        $('addUserForm').reset();
        await refreshAll();
        setStatus('User created.');
      } catch (err) {
        setStatus(err.message || String(err), true);
      }
    });

    $('addGroupForm').addEventListener('submit', async (ev) => {
      ev.preventDefault();
      try {
        await Library.createGroup($('newGroupName').value.trim());
        $('addGroupForm').reset();
        await refreshAll();
        setStatus('Group created.');
      } catch (err) {
        setStatus(err.message || String(err), true);
      }
    });

    $('saveGroupMembersBtn').addEventListener('click', async () => {
      if (!editingGroupId) return;
      const ids = Array.prototype.map.call(
        $('groupMemberChecks').querySelectorAll('input[type=checkbox]:checked'),
        (el) => el.value
      );
      try {
        await Library.setGroupMembers(editingGroupId, ids);
        $('groupEditCard').hidden = true;
        editingGroupId = null;
        await refreshAll();
        setStatus('Group members saved.');
      } catch (err) {
        setStatus(err.message || String(err), true);
      }
    });
    $('cancelGroupEditBtn').addEventListener('click', () => {
      $('groupEditCard').hidden = true;
      editingGroupId = null;
    });

    $('addProfileForm').addEventListener('submit', async (ev) => {
      ev.preventDefault();
      try {
        await Library.createProfile($('newProfileName').value.trim(), $('newProfileSlug').value.trim());
        $('addProfileForm').reset();
        await refreshAll();
        setStatus('Profile created.');
      } catch (err) {
        setStatus(err.message || String(err), true);
      }
    });

    $('saveProfileAccessBtn').addEventListener('click', async () => {
      if (!editingProfileId) return;
      const users = [];
      $('profileUserAccess').querySelectorAll('label').forEach((label) => {
        const cb = label.querySelector('input[type=checkbox]');
        const sel = label.querySelector('select');
        if (cb && cb.checked) {
          users.push({ id: cb.dataset.userId, accessLevel: sel ? sel.value : 'viewer' });
        }
      });
      const groups = [];
      $('profileGroupAccess').querySelectorAll('label').forEach((label) => {
        const cb = label.querySelector('input[type=checkbox]');
        const sel = label.querySelector('select');
        if (cb && cb.checked) {
          groups.push({ id: cb.dataset.groupId, accessLevel: sel ? sel.value : 'viewer' });
        }
      });
      try {
        await Library.setProfileAccess(editingProfileId, { users, groups });
        setStatus('Profile access saved.');
        await refreshAll();
      } catch (err) {
        setStatus(err.message || String(err), true);
      }
    });
    $('cancelProfileAccessBtn').addEventListener('click', () => {
      $('profileAccessCard').hidden = true;
      editingProfileId = null;
    });

    $('publishPackForm').addEventListener('submit', async (ev) => {
      ev.preventDefault();
      try {
        const lib = await Library.loadSharedLibrary();
        const breakdowns = lib.breakdowns || {};
        const curriculaOverlay = lib.curriculaOverlay || {};
        if (!Object.keys(breakdowns).length) {
          throw new Error('You have no saved breakdowns in your account to publish. Save some on Curriculum first.');
        }
        await Library.publishProfilePack(
          $('packProfile').value,
          $('packTitle').value.trim(),
          { breakdowns, curriculaOverlay }
        );
        $('packTitle').value = '';
        setStatus('Profile pack published.');
      } catch (err) {
        setStatus(err.message || String(err), true);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(readThemePref());
    bind();
    init().catch((err) => setStatus(err.message || String(err), true));
  });
})();
