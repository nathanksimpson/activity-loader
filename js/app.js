/**
 * Four-part UI: Activity, Curriculum, Generate, Loader.
 */
(function () {
  'use strict';

  const Catalog = window.ActivityLoaderCatalog;
  const Domain = window.ActivityDomain;
  const Library = window.ActivityLibrary;
  const Auth = window.ActivityAuth;
  const Generate = window.ActivityGenerate;
  const Analyze = window.ActivityAnalyze;
  const Importer = window.ActivityImporter;
  const Styles = window.ActivityStyles;
  const VOCAB_TYPES = { vocabulary: true, teamMatch: true, charades: true, quizQuizTrade: true, fanNPick: true, findSomeoneWho: true, showdown: true, rallyCoach: true };

  const PANELS = ['activity', 'curriculum', 'generate', 'loader'];
  const THEME_STORAGE = 'activityLoader.theme.v1';
  const ONBOARDING_STORAGE = 'activityLoader.onboarding.v1';
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
  const WIZARD_STEPS = [
    {
      title: 'Welcome to Activity Loader',
      body: 'This app has four tabs. Use them in order when you set up a new book: Activity → Curriculum → Generate. In class, jump straight to Loader to open games.',
      panel: null
    },
    {
      title: '4. Loader — play in class',
      body: 'Pick a Rainbow level (for example Green), choose a book, then Open an activity. Built-in games like Jumping OX and Jeopardy work here without generating anything new.',
      panel: 'loader'
    },
    {
      title: '1. Activity — game types',
      body: 'An Activity is the game style (Jumping OX, Jeopardy, Vocabulary, and others). Rules stay the same; only the words change later. You can also add a new style from an HTML file or a short description using AI.',
      panel: 'activity'
    },
    {
      title: '2. Curriculum — books',
      body: 'A Curriculum is a book: units, grammar, vocabulary, and CEFR. Add a missing book or level, then upload a PDF or photos, Analyze with AI, and Save breakdown. A green Parsed mark means you can Generate from that book.',
      panel: 'curriculum'
    },
    {
      title: '3. Generate — make playable files',
      body: 'Mix a game type with a book to download HTML. Vocabulary-style games need a saved breakdown. Jumping OX / Jeopardy can use built-in packs or AI. Use the Theme button anytime to switch Light, Dark, or follow your computer.',
      panel: 'generate'
    }
  ];
  let prefs = { levelId: 'Green', bookId: 'write-now-1', panel: 'loader' };
  let lastGenerated = null;
  const pendingBreakdowns = {};
  let pendingImport = null;
  let pendingStyle = null;
  let allowLocalWithoutLogin = false;
  let wizardStepIndex = 0;
  let wizardReturnPanel = null;
  const els = {};
  const TOAST_TITLES = {
    success: 'Done',
    error: 'Problem',
    info: 'Heads up',
    warning: 'Warning'
  };

  function $(id) { return document.getElementById(id); }
  function clone(v) { return JSON.parse(JSON.stringify(v)); }

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
    const btn = els['theme-toggle'] || $('theme-toggle');
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

  function hasCompletedOnboarding() {
    try {
      return localStorage.getItem(ONBOARDING_STORAGE) === 'done';
    } catch (e) {
      return false;
    }
  }

  function markOnboardingDone() {
    try { localStorage.setItem(ONBOARDING_STORAGE, 'done'); } catch (e) { /* ignore */ }
  }

  function clearWizardTabFocus() {
    PANELS.forEach((panel) => {
      const tab = $('tab-' + panel);
      if (tab) tab.classList.remove('is-wizard-focus');
    });
  }

  function renderWizardStep() {
    const step = WIZARD_STEPS[wizardStepIndex];
    const total = WIZARD_STEPS.length;
    if (!step) return;
    if (els['wizard-step-meta']) {
      els['wizard-step-meta'].textContent = 'Step ' + (wizardStepIndex + 1) + ' of ' + total;
    }
    if (els['wizard-title']) els['wizard-title'].textContent = step.title;
    if (els['wizard-body']) els['wizard-body'].textContent = step.body;
    if (els['wizard-back-btn']) els['wizard-back-btn'].hidden = wizardStepIndex === 0;
    if (els['wizard-next-btn']) {
      els['wizard-next-btn'].textContent = wizardStepIndex === total - 1 ? 'Finish' : 'Next';
    }
    clearWizardTabFocus();
    if (step.panel) {
      showPanel(step.panel);
      const tab = $('tab-' + step.panel);
      if (tab) tab.classList.add('is-wizard-focus');
    }
  }

  function closeWizard(restorePanel) {
    const gate = els['onboarding-wizard'];
    if (gate) gate.hidden = true;
    clearWizardTabFocus();
    if (restorePanel && wizardReturnPanel) showPanel(wizardReturnPanel);
    wizardReturnPanel = null;
  }

  function finishOnboarding() {
    markOnboardingDone();
    closeWizard(true);
  }

  function maybeShowOnboardingWizard() {
    if (hasCompletedOnboarding()) return;
    if (els['login-gate'] && !els['login-gate'].hidden) return;
    const gate = els['onboarding-wizard'];
    if (!gate) return;
    wizardReturnPanel = prefs.panel || 'loader';
    wizardStepIndex = 0;
    gate.hidden = false;
    renderWizardStep();
    if (els['wizard-next-btn']) els['wizard-next-btn'].focus();
  }

  function cacheEls() {
    [
      'band-filter', 'level-chips', 'level-select', 'book-select', 'activity-grid', 'browse-status',
      'tab-activity', 'tab-curriculum', 'tab-generate', 'tab-loader',
      'panel-activity', 'panel-curriculum', 'panel-generate', 'panel-loader',
      'activity-type-grid', 'curriculum-grid', 'curriculum-status', 'curr-ai-provider', 'curr-ai-model', 'curr-api-key',
      'curr-custom-fields', 'curr-custom-url', 'curr-custom-model', 'curr-custom-header-name', 'curr-custom-header-value',
      'add-book-form', 'new-book-title', 'new-book-level', 'new-book-cefr',
      'add-level-form', 'new-level-name', 'new-level-band', 'new-level-color', 'custom-level-list',
      'generate-form', 'gen-activity-list', 'gen-all', 'gen-book', 'gen-cefr', 'gen-save-cefr', 'gen-mode', 'gen-ai-provider', 'gen-ai-model',
      'api-key-field', 'gen-api-key', 'generate-btn', 'open-generated-btn', 'generate-status', 'gen-breakdown-hint',
      'gen-output-folder-label', 'gen-output-folder-hint', 'gen-change-folder-btn',
      'gen-online-field', 'gen-also-download', 'gen-folder-field', 'gen-online-results',
      'gen-custom-fields', 'gen-custom-url', 'gen-custom-model', 'gen-custom-header-name', 'gen-custom-header-value',
      'style-form', 'style-file', 'style-description', 'style-parse-btn', 'style-save-btn', 'style-preview', 'style-preview-frame', 'style-status', 'style-list',
      'style-ai-provider', 'style-ai-model', 'style-api-key',
      'style-custom-fields', 'style-custom-url', 'style-custom-model', 'style-custom-header-name', 'style-custom-header-value',
      'import-form', 'import-file', 'import-book', 'import-type', 'import-title', 'import-inspect-btn', 'import-ai-btn', 'import-save-btn', 'import-preview', 'import-status',
      'activity-form', 'act-id', 'act-title', 'act-book', 'act-type', 'act-path', 'act-status', 'act-unit',
      'edit-mode', 'manage-form-title', 'reset-form-btn', 'reset-overlay-btn', 'toast-region',
      'manage-status', 'manage-list', 'backup-export-btn', 'backup-import-file', 'backup-status',
      'library-status-badge', 'team-library-hint', 'publish-breakdowns-btn', 'team-library-status', 'school-packs-list',
      'login-gate', 'login-form', 'login-username', 'login-password', 'login-status', 'login-local-hint',
      'login-continue-local', 'continue-local-btn', 'account-bar', 'account-label', 'logout-btn', 'admin-link', 'app-shell',
      'active-profile-field', 'active-profile-select', 'edit-profile-btn',
      'active-profile-edit-card', 'active-profile-rename-form', 'active-profile-name', 'active-profile-slug',
      'active-profile-publish-form', 'active-profile-pack-title', 'active-profile-edit-status',
      'theme-toggle', 'onboarding-wizard', 'wizard-step-meta', 'wizard-title', 'wizard-body',
      'wizard-skip-btn', 'wizard-back-btn', 'wizard-next-btn'
    ].forEach((id) => { els[id] = $(id); });
  }

  function showToast(message, type, options) {
    const host = els['toast-region'];
    const text = String(message || '').trim();
    if (!host || !text) return;
    const tone = (type === 'success' || type === 'error' || type === 'warning') ? type : 'info';
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + tone;
    const title = document.createElement('p');
    title.className = 'toast-title';
    title.textContent = (options && options.title) || TOAST_TITLES[tone] || TOAST_TITLES.info;
    const body = document.createElement('p');
    body.className = 'toast-message';
    body.textContent = text;
    toast.appendChild(title);
    toast.appendChild(body);
    host.appendChild(toast);
    const timeout = Math.max(1800, Math.min(7000, Number((options && options.durationMs) || 3200)));
    window.setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, timeout);
  }

  function setStatus(el, message, isErrorOrOptions) {
    if (!el) return;
    el.textContent = message || '';
    const opts = (typeof isErrorOrOptions === 'object' && isErrorOrOptions)
      ? isErrorOrOptions
      : { isError: !!isErrorOrOptions };
    el.classList.toggle('error', !!opts.isError);
    if (opts.toast && message) {
      showToast(message, opts.toastType || (opts.isError ? 'error' : 'success'), opts.toastOptions || {});
    }
  }

  function ensureCloudLogin() {
    if (!Library || !Library.isServerAvailable()) return;
    if (Auth && Auth.isLoggedIn()) return;
    throw new Error('Please log in to save to your cloud library.');
  }

  async function persistBreakdown(bookId, incoming, merge) {
    if (Library && Library.isServerAvailable()) ensureCloudLogin();
    return Domain.saveBreakdownWithLibrary(bookId, incoming, { merge: merge });
  }

  function breakdownSaveMessage(bookTitle) {
    if (Library && Library.isServerAvailable() && Auth && Auth.isLoggedIn()) {
      return 'Saved breakdown for ' + bookTitle + ' to your private cloud library.';
    }
    return 'Saved breakdown for ' + bookTitle + ' in this browser. You can now Generate Vocabulary, Team Match, and Charades games.';
  }

  function updateAccountBar() {
    const bar = els['account-bar'];
    const label = els['account-label'];
    const adminLink = els['admin-link'];
    const field = els['active-profile-field'];
    const select = els['active-profile-select'];
    const editBtn = els['edit-profile-btn'];
    if (!bar || !label) return;
    if (Auth && Auth.isLoggedIn()) {
      const u = Auth.getUser();
      bar.hidden = false;
      label.textContent = u.username + (u.role ? ' · ' + u.role : '');
      if (adminLink) adminLink.hidden = !(Auth.canAccessAdminPage && Auth.canAccessAdminPage());

      const profiles = Auth.getProfiles ? Auth.getProfiles() : (u.profiles || []);
      if (field && select) {
        if (profiles.length) {
          field.hidden = false;
          const activeId = Auth.getActiveProfileId ? Auth.getActiveProfileId() : null;
          select.innerHTML = '';
          profiles.forEach((p) => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.textContent = p.name + (p.accessLevel === 'editor' ? ' (editor)' : '');
            select.appendChild(opt);
          });
          select.value = activeId || profiles[0].id;
        } else {
          field.hidden = true;
          select.innerHTML = '';
        }
      }
      if (editBtn) {
        editBtn.hidden = !(Auth.canEditActiveProfile && Auth.canEditActiveProfile());
      }
      fillActiveProfileEditCard();
    } else {
      bar.hidden = true;
      label.textContent = '';
      if (adminLink) adminLink.hidden = true;
      if (field) field.hidden = true;
      if (editBtn) editBtn.hidden = true;
      if (els['active-profile-edit-card']) els['active-profile-edit-card'].hidden = true;
    }
  }

  function fillActiveProfileEditCard() {
    const card = els['active-profile-edit-card'];
    if (!card) return;
    const canEdit = Auth && Auth.isLoggedIn() && Auth.canEditActiveProfile && Auth.canEditActiveProfile();
    card.hidden = !canEdit;
    if (!canEdit) return;
    const p = Auth.getActiveProfile();
    if (!p) {
      card.hidden = true;
      return;
    }
    if (els['active-profile-name']) els['active-profile-name'].value = p.name || '';
    if (els['active-profile-slug']) els['active-profile-slug'].value = p.slug || '';
  }

  function updateLibraryBadge() {
    const badge = els['library-status-badge'];
    const hint = els['team-library-hint'];
    if (!badge) return;
    badge.classList.remove('is-connected', 'is-local');
    if (Library && Library.isServerAvailable() && Auth && Auth.isLoggedIn()) {
      badge.classList.add('is-connected');
      const count = Object.keys(Domain.readBreakdowns()).filter((id) => Domain.hasBreakdown(id)).length;
      const active = Auth.getActiveProfile && Auth.getActiveProfile();
      badge.textContent = 'Signed in — ' + count + ' parsed book' + (count === 1 ? '' : 's') +
        ' in your private library' +
        (active ? ' · Profile: ' + active.name : '') + '.';
      if (hint) hint.textContent = 'Saves go to your account. Use the header profile dropdown to switch profiles (one at a time).';
    } else if (Library && Library.isServerAvailable()) {
      badge.classList.add('is-local');
      badge.textContent = 'Cloud site ready — please log in to sync your private library.';
      if (hint) hint.textContent = 'Without login, changes stay only in this browser.';
    } else {
      badge.classList.add('is-local');
      badge.textContent = 'This browser only — open the Cloudflare site and log in for permanent cloud storage.';
      if (hint) hint.textContent = 'Cloud library needs the deployed Worker URL.';
    }
    renderSchoolPacks();
  }

  function renderSchoolPacks() {
    const host = els['school-packs-list'];
    if (!host) return;
    host.innerHTML = '';
    const last = Library && Library.getLastLibrary && Library.getLastLibrary();
    const allPacks = last ? (last.profilePacks || last.schoolPacks || []) : [];
    const activeId = Auth && Auth.getActiveProfileId ? Auth.getActiveProfileId() : null;
    const packs = activeId
      ? allPacks.filter((pack) => pack.profileId === activeId)
      : [];
    if (!Auth || !Auth.isLoggedIn()) {
      const li = document.createElement('li');
      li.className = 'hint';
      li.textContent = 'Log in to see profile packs.';
      host.appendChild(li);
      return;
    }
    if (!activeId) {
      const li = document.createElement('li');
      li.className = 'hint';
      li.textContent = 'No profile assigned yet. Ask an admin to grant you profile access.';
      host.appendChild(li);
      return;
    }
    if (!packs.length) {
      const li = document.createElement('li');
      li.className = 'hint';
      li.textContent = 'No packs on this profile yet. Editors can publish one below, or ask an admin.';
      host.appendChild(li);
      return;
    }
    packs.forEach((pack) => {
      const li = document.createElement('li');
      li.className = 'manage-item';
      const left = document.createElement('div');
      left.innerHTML = '<strong></strong><span class="hint"></span>';
      left.querySelector('strong').textContent = pack.title;
      left.querySelector('.hint').textContent = 'Read-only · Fork to edit your own copy';
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-small btn-primary';
      btn.textContent = 'Fork';
      btn.addEventListener('click', () => {
        onForkSchoolPack(pack.id, pack.title).catch((err) => {
          setStatus(els['team-library-status'], err.message || String(err), { isError: true, toast: true, toastType: 'error' });
        });
      });
      li.appendChild(left);
      li.appendChild(btn);
      host.appendChild(li);
    });
  }

  async function onActiveProfileChange() {
    const select = els['active-profile-select'];
    if (!select || !Auth || !Auth.setActiveProfile) return;
    const id = select.value;
    try {
      await Auth.setActiveProfile(id);
      updateAccountBar();
      updateLibraryBadge();
      showToast('Switched to ' + ((Auth.getActiveProfile() && Auth.getActiveProfile().name) || 'profile'), 'success');
    } catch (err) {
      setStatus(els['team-library-status'], err.message || String(err), { isError: true, toast: true, toastType: 'error' });
      updateAccountBar();
    }
  }

  async function onForkSchoolPack(resourceId, title) {
    ensureCloudLogin();
    const result = await Library.forkResource(resourceId, title ? title + ' (my copy)' : null);
    await reloadCloudLibrary();
    setStatus(
      els['team-library-status'],
      'Forked into your library' +
        (result && result.createdBreakdowns != null ? ' (' + result.createdBreakdowns + ' books)' : '') + '.',
      { toast: true, toastType: 'success' }
    );
    renderCurriculum();
    fillGenerateForm();
  }

  async function reloadCloudLibrary() {
    if (!Library || !Library.isServerAvailable() || !Auth || !Auth.isLoggedIn()) return;
    const payload = await Library.loadSharedLibrary();
    Domain.mergeServerLibrary(payload);
    updateLibraryBadge();
  }

  async function onPublishLocalBreakdowns() {
    if (!Library || !Library.isServerAvailable()) {
      throw new Error('Cloud library is only available on the Cloudflare site.');
    }
    ensureCloudLogin();
    const breakdowns = Domain.readBreakdowns();
    const ids = Object.keys(breakdowns).filter((id) => Domain.hasBreakdown(id));
    if (!ids.length) throw new Error('No saved breakdowns in this browser to upload.');
    if (!window.confirm('Upload ' + ids.length + ' saved breakdown(s) to your private cloud account?')) {
      return;
    }
    const payload = {};
    ids.forEach((id) => { payload[id] = breakdowns[id]; });
    const result = await Library.publishAllBreakdowns(payload);
    await reloadCloudLibrary();
    setStatus(
      els['team-library-status'],
      'Uploaded ' + (result && result.saved != null ? result.saved : ids.length) + ' breakdown(s) to your account.',
      { toast: true, toastType: 'success' }
    );
  }

  function setLoginGateVisible(show) {
    if (els['login-gate']) els['login-gate'].hidden = !show;
    if (els['app-shell']) els['app-shell'].style.visibility = show ? 'hidden' : 'visible';
  }

  async function gateAuth() {
    if (!Auth) {
      setLoginGateVisible(false);
      return;
    }
    await Auth.probe();
    if (!Auth.isServerAvailable()) {
      if (els['login-local-hint']) els['login-local-hint'].hidden = false;
      if (els['login-continue-local']) els['login-continue-local'].hidden = false;
      setLoginGateVisible(!allowLocalWithoutLogin);
      if (allowLocalWithoutLogin) updateAccountBar();
      return;
    }
    await Auth.refreshMe();
    if (Auth.isLoggedIn()) {
      setLoginGateVisible(false);
      updateAccountBar();
      return;
    }
    setLoginGateVisible(true);
  }

  async function onLoginSubmit(ev) {
    ev.preventDefault();
    const username = els['login-username'] && els['login-username'].value.trim();
    const password = els['login-password'] && els['login-password'].value;
    try {
      await Auth.login(username, password);
      setLoginGateVisible(false);
      setStatus(els['login-status'], '');
      await startAppAfterLogin();
      showToast('Logged in as ' + Auth.getUser().username, 'success');
    } catch (err) {
      setStatus(els['login-status'], err.message || String(err), { isError: true });
    }
  }

  async function onLogout() {
    if (Auth) await Auth.logout();
    updateAccountBar();
    allowLocalWithoutLogin = false;
    await gateAuth();
  }

  function currentProvider(source) {
    const key = source === 'curriculum'
      ? 'curr-ai-provider'
      : (source === 'style' ? 'style-ai-provider' : 'gen-ai-provider');
    const value = els[key] && els[key].value;
    return Domain.getAiProvider(value).id;
  }

  function fillProviderSelect(selectId) {
    const select = els[selectId];
    if (!select) return;
    const prev = select.value || Domain.getSelectedAiProvider();
    select.innerHTML = '';
    Domain.getAiProviders().forEach((provider) => {
      const opt = document.createElement('option');
      opt.value = provider.id;
      opt.textContent = provider.label;
      select.appendChild(opt);
    });
    select.value = Domain.getAiProvider(prev).id;
  }

  function fillModelSelect(selectId, providerId) {
    const select = els[selectId];
    if (!select) return;
    const provider = Domain.getAiProvider(providerId);
    if (provider.id === 'custom') {
      select.innerHTML = '';
      const model = Domain.getSelectedModel('custom') || Domain.getCustomAiSettings().model || '';
      const opt = document.createElement('option');
      opt.value = model;
      opt.textContent = model || '(type model below)';
      select.appendChild(opt);
      select.value = model;
      select.disabled = true;
      return;
    }
    select.disabled = false;
    const prev = select.value || Domain.getSelectedModel(provider.id);
    select.innerHTML = '';
    Domain.getModelsForProvider(provider.id).forEach((model) => {
      const opt = document.createElement('option');
      opt.value = model.id;
      opt.textContent = model.label;
      select.appendChild(opt);
    });
    const ok = Domain.getModelsForProvider(provider.id).some((model) => model.id === prev);
    select.value = ok ? prev : Domain.getSelectedModel(provider.id);
  }

  function syncCustomFields(source) {
    const prefix = source === 'curriculum' ? 'curr' : (source === 'style' ? 'style' : 'gen');
    const providerId = currentProvider(source);
    const wrap = els[prefix + '-custom-fields'];
    if (wrap) wrap.hidden = providerId !== 'custom';
    if (providerId !== 'custom') return;
    const custom = Domain.getCustomAiSettings();
    if (els[prefix + '-custom-url']) els[prefix + '-custom-url'].value = custom.baseUrl || '';
    if (els[prefix + '-custom-model']) els[prefix + '-custom-model'].value = custom.model || '';
    if (els[prefix + '-custom-header-name']) els[prefix + '-custom-header-name'].value = custom.extraHeaderName || '';
    if (els[prefix + '-custom-header-value']) els[prefix + '-custom-header-value'].value = custom.extraHeaderValue || '';
  }

  function readCustomFields(source) {
    const prefix = source === 'curriculum' ? 'curr' : (source === 'style' ? 'style' : 'gen');
    return {
      baseUrl: els[prefix + '-custom-url'] ? els[prefix + '-custom-url'].value.trim() : '',
      model: els[prefix + '-custom-model'] ? els[prefix + '-custom-model'].value.trim() : '',
      extraHeaderName: els[prefix + '-custom-header-name'] ? els[prefix + '-custom-header-name'].value.trim() : '',
      extraHeaderValue: els[prefix + '-custom-header-value'] ? els[prefix + '-custom-header-value'].value.trim() : ''
    };
  }

  function persistCustomFields(source) {
    if (currentProvider(source) !== 'custom') return;
    Domain.setCustomAiSettings(readCustomFields(source));
  }

  function syncAiControls(source) {
    const providerSelectId = source === 'curriculum'
      ? 'curr-ai-provider'
      : (source === 'style' ? 'style-ai-provider' : 'gen-ai-provider');
    const selected = Domain.getSelectedAiProvider();
    if (els[providerSelectId]) els[providerSelectId].value = selected;
    const providerId = Domain.getAiProvider(selected).id;
    const modelId = source === 'curriculum'
      ? 'curr-ai-model'
      : (source === 'style' ? 'style-ai-model' : 'gen-ai-model');
    const keyId = source === 'curriculum'
      ? 'curr-api-key'
      : (source === 'style' ? 'style-api-key' : 'gen-api-key');
    fillModelSelect(modelId, providerId);
    if (els[keyId]) els[keyId].value = Domain.getApiKey(providerId);
    syncCustomFields(source);
  }

  function syncAllAiControls() {
    syncAiControls('curriculum');
    syncAiControls('generate');
    syncAiControls('style');
  }

  function mapLegacyPanel(name) {
    if (name === 'browse' || name === 'manage') return 'loader';
    if (name === 'create') return 'generate';
    return PANELS.indexOf(name) >= 0 ? name : 'loader';
  }

  function levelMatchesBand(level, band) {
    if (!band || band === 'all') return true;
    if (band === 'elementary' || band === 'middle') return level.band === band;
    if (band === 'juniorRainbow') return level.programTrack === 'juniorRainbow';
    return true;
  }

  function visibleLevels() {
    return Catalog.getLevels().filter((l) => levelMatchesBand(l, els['band-filter'].value));
  }

  function fillLevelSelect() {
    const levels = visibleLevels();
    const select = els['level-select'];
    select.innerHTML = '';
    levels.forEach((level) => {
      const opt = document.createElement('option');
      opt.value = level.id;
      opt.textContent = level.grade ? level.name + ' (' + level.grade + ')' : level.name;
      select.appendChild(opt);
    });
    if (!levels.some((l) => l.id === prefs.levelId)) {
      prefs.levelId = levels[0] ? levels[0].id : '';
    }
    select.value = prefs.levelId;
  }

  function fillNewBookLevelSelect() {
    const select = els['new-book-level'];
    if (!select) return;
    const prev = select.value;
    select.innerHTML = '';
    Catalog.getLevels().forEach((level) => {
      const opt = document.createElement('option');
      opt.value = level.id;
      const stats = levelParseStats(level.id);
      let label = level.grade ? level.name + ' (' + level.grade + ')' : level.name;
      if (stats.parsedCount > 0) {
        label += ' · parsed';
      }
      opt.textContent = label;
      select.appendChild(opt);
    });
    if (prev && Catalog.getLevel(prev)) select.value = prev;
    else if (prefs.levelId && Catalog.getLevel(prefs.levelId)) select.value = prefs.levelId;
  }

  function fillNewBookCefrSelect() {
    const select = els['new-book-cefr'];
    if (!select) return;
    const prev = select.value;
    select.innerHTML = '';
    Domain.getCefrOptions().forEach((opt) => {
      const o = document.createElement('option');
      o.value = opt;
      o.textContent = opt;
      select.appendChild(o);
    });
    if (prev) select.value = prev;
    else select.value = 'A1';
  }

  function refreshAfterCatalogEdit() {
    fillNewBookLevelSelect();
    fillLevelSelect();
    renderLevelChips();
    fillBookSelect();
    fillImportSelects();
    fillManageBookAndTypeSelects();
    fillGenerateForm();
    renderCustomLevelList();
    renderCurriculum();
    renderActivityGrid();
    renderManageList();
  }

  function renderCustomLevelList() {
    const list = els['custom-level-list'];
    if (!list) return;
    list.innerHTML = '';
    const extra = Catalog.getLevels().filter((level) => !Catalog.isFactoryLevel(level.id));
    if (!extra.length) {
      list.innerHTML = '<li class="empty-state">No extra levels yet. The Rainbow list is already built in.</li>';
      return;
    }
    extra.forEach((level) => {
      const li = document.createElement('li');
      li.className = 'manage-item';
      const info = document.createElement('div');
      const name = document.createElement('strong');
      name.textContent = level.name;
      const meta = document.createElement('span');
      meta.textContent = level.band === 'middle' ? 'Middle school' : 'Elementary';
      info.appendChild(name);
      info.appendChild(meta);
      const stats = levelParseStats(level.id);
      const badge = parseStatusBadge(stats.parsedCount, stats.bookCount);
      info.appendChild(badge);
      if (stats.parsedCount > 0) li.classList.add('is-parsed');
      const actions = document.createElement('div');
      actions.className = 'card-actions';
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'btn btn-danger';
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', () => {
        try {
          Catalog.removeAddedLevel(level.id);
          if (prefs.levelId === level.id) {
            const next = Catalog.getLevels()[0];
            prefs.levelId = next ? next.id : '';
          }
          persistPrefs();
          refreshAfterCatalogEdit();
          setStatus(els['curriculum-status'], 'Removed level ' + level.name + '.', { toast: true, toastType: 'success' });
        } catch (err) {
          setStatus(els['curriculum-status'], err.message || String(err), { isError: true, toast: true, toastType: 'error' });
        }
      });
      actions.appendChild(removeBtn);
      li.appendChild(info);
      li.appendChild(actions);
      list.appendChild(li);
    });
  }

  function onAddBook(event) {
    event.preventDefault();
    const title = els['new-book-title'].value.trim();
    const levelId = els['new-book-level'].value;
    const cefr = els['new-book-cefr'].value;
    try {
      const id = Catalog.slugifyId(title);
      Catalog.addBook({ id: id, title: title, levelIds: [levelId], cefr: cefr });
      try {
        Domain.addBook({ id: id, title: title, levelIds: [levelId], cefr: cefr });
      } catch (domainErr) {
        Catalog.removeAddedBook(id);
        throw domainErr;
      }
      prefs.levelId = levelId;
      prefs.bookId = id;
      persistPrefs();
      els['new-book-title'].value = '';
      refreshAfterCatalogEdit();
      setStatus(
        els['curriculum-status'],
        'Added “' + title + '” under ' + levelId + '. Upload pages on that card, then Save, then Generate.',
        { toast: true, toastType: 'success' }
      );
    } catch (err) {
      setStatus(els['curriculum-status'], err.message || String(err), { isError: true, toast: true, toastType: 'error' });
    }
  }

  function onAddLevel(event) {
    event.preventDefault();
    const name = els['new-level-name'].value.trim();
    const band = els['new-level-band'].value;
    const color = els['new-level-color'].value;
    try {
      Catalog.addLevel({
        name: name,
        band: band,
        color: color,
        programTrack: band === 'middle' ? 'seniorWaterflow' : 'juniorRainbow'
      });
      if (els['band-filter']) els['band-filter'].value = 'all';
      prefs.levelId = name;
      persistPrefs();
      els['new-level-name'].value = '';
      refreshAfterCatalogEdit();
      setStatus(
        els['curriculum-status'],
        'Added level “' + name + '”. Now add a book and pick this level.',
        { toast: true, toastType: 'success' }
      );
    } catch (err) {
      setStatus(els['curriculum-status'], err.message || String(err), { isError: true, toast: true, toastType: 'error' });
    }
  }

  function renderLevelChips() {
    const host = els['level-chips'];
    host.innerHTML = '';
    visibleLevels().forEach((level) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip' + (level.id === prefs.levelId ? ' is-selected' : '');
      const dot = document.createElement('span');
      dot.className = 'chip-dot';
      dot.style.background = level.color || '#9aa3b5';
      btn.appendChild(dot);
      btn.appendChild(document.createTextNode(level.name));
      btn.addEventListener('click', () => {
        prefs.levelId = level.id;
        els['level-select'].value = level.id;
        onLevelChanged();
      });
      host.appendChild(btn);
    });
  }

  function fillBookSelect() {
    const books = Catalog.getBooksForLevel(prefs.levelId);
    const select = els['book-select'];
    select.innerHTML = '';
    if (!books.length) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'No books registered for this level yet';
      select.appendChild(opt);
      prefs.bookId = '';
      return;
    }
    books.forEach((book) => {
      const opt = document.createElement('option');
      opt.value = book.id;
      const cur = Domain.getBook(book.id);
      opt.textContent = book.title + (cur && cur.cefr ? ' · ' + cur.cefr : '');
      select.appendChild(opt);
    });
    if (!books.some((b) => b.id === prefs.bookId)) prefs.bookId = books[0].id;
    select.value = prefs.bookId;
  }

  function typeLabel(typeId) {
    const found = Catalog.getActivityTypes().find((t) => t.id === typeId);
    return found ? found.label : typeId;
  }

  function statusBadgeClass(status) {
    if (status === 'ready') return 'badge badge-ready';
    if (status === 'draft') return 'badge badge-draft';
    if (status === 'missing') return 'badge badge-missing';
    return 'badge';
  }

  /* ---------- Online play & share links ---------- */

  const ALSO_DOWNLOAD_PREF = 'activityLoader.alsoDownload.v1';

  function isOnlineLibrary() {
    return !!(Library && Library.isServerAvailable && Library.isServerAvailable() && Auth && Auth.isLoggedIn());
  }

  function onlineMeta(bookId, activityId) {
    return isOnlineLibrary() && Library.getGeneratedMeta ? Library.getGeneratedMeta(bookId, activityId) : null;
  }

  function playOnline(meta) {
    window.open(Library.absoluteUrl(meta.playPath), '_blank', 'noopener');
  }

  function alsoDownloadWanted() {
    if (!isOnlineLibrary()) return true;
    return !!(els['gen-also-download'] && els['gen-also-download'].checked);
  }

  function syncGenerateSaveOptions() {
    const online = isOnlineLibrary();
    if (els['gen-online-field']) els['gen-online-field'].hidden = !online;
    if (els['gen-also-download']) {
      let stored = false;
      try { stored = localStorage.getItem(ALSO_DOWNLOAD_PREF) === '1'; } catch (e) { /* private mode */ }
      els['gen-also-download'].checked = stored;
    }
    if (els['gen-folder-field']) els['gen-folder-field'].hidden = online && !alsoDownloadWanted();
  }

  function onAlsoDownloadChanged() {
    try { localStorage.setItem(ALSO_DOWNLOAD_PREF, els['gen-also-download'].checked ? '1' : '0'); } catch (e) { /* private mode */ }
    if (els['gen-folder-field']) els['gen-folder-field'].hidden = !alsoDownloadWanted();
  }

  let shareDialog = null;

  function openShareDialog(bookId, activityId, title) {
    if (!shareDialog) {
      shareDialog = document.createElement('dialog');
      shareDialog.className = 'share-dialog';
      shareDialog.innerHTML =
        '<form method="dialog" class="share-dialog-inner">' +
        '<div class="share-head"><h2 class="section-title share-title"></h2>' +
        '<button type="submit" class="btn btn-ghost share-close" aria-label="Close">✕</button></div>' +
        '<p class="hint share-explain">Anyone with this link can play the game in a browser — no account needed. ' +
        'Send it to students or put it on the class page. Turn it off any time.</p>' +
        '<div class="share-link-row"><input class="input share-url" readonly aria-label="Share link">' +
        '<button type="button" class="btn btn-primary share-copy">Copy</button></div>' +
        '<div class="share-actions">' +
        '<button type="button" class="btn share-open">Open link</button>' +
        '<button type="button" class="btn btn-danger share-off">Turn off link</button>' +
        '<button type="button" class="btn btn-primary share-on">Make share link</button></div>' +
        '<p class="share-note" aria-live="polite"></p></form>';
      document.body.appendChild(shareDialog);
      shareDialog.addEventListener('click', (e) => { if (e.target === shareDialog) shareDialog.close(); });
    }
    const d = shareDialog;
    const q = (sel) => d.querySelector(sel);
    const note = (text, isError) => {
      q('.share-note').textContent = text || '';
      q('.share-note').classList.toggle('is-error', !!isError);
    };
    const render = (meta) => {
      const on = !!(meta && meta.sharePath);
      const url = on ? Library.absoluteUrl(meta.sharePath) : '';
      q('.share-url').value = url;
      q('.share-link-row').hidden = !on;
      q('.share-open').hidden = !on;
      q('.share-off').hidden = !on;
      q('.share-on').hidden = on;
      q('.share-explain').textContent = on
        ? 'Anyone with this link can play the game in a browser — no account needed. Send it to students or put it on the class page.'
        : 'The share link for this game is off. Make one to let students play it without an account.';
    };
    const run = async (fn) => {
      note('');
      try { render(await fn()); } catch (err) { note(err && err.message ? err.message : String(err), true); }
    };
    q('.share-title').textContent = 'Share: ' + (title || activityId);
    q('.share-copy').onclick = async () => {
      const input = q('.share-url');
      try {
        await navigator.clipboard.writeText(input.value);
        note('Link copied.');
      } catch (e) {
        input.select();
        note('Press Ctrl+C to copy.');
      }
    };
    q('.share-open').onclick = () => window.open(q('.share-url').value, '_blank', 'noopener');
    q('.share-off').onclick = () => {
      if (!window.confirm('Turn off this link? Students who have it will no longer be able to open the game.')) return;
      run(() => Library.unshareGenerated(bookId, activityId)).then(() => {
        if (!q('.share-note').classList.contains('is-error')) note('Link turned off.');
        renderActivityGrid();
      });
    };
    q('.share-on').onclick = () => run(() => Library.shareGenerated(bookId, activityId)).then(renderActivityGrid);
    render(onlineMeta(bookId, activityId));
    note('');
    if (!d.open) d.showModal();
    if (!(onlineMeta(bookId, activityId) || {}).sharePath) {
      run(() => Library.shareGenerated(bookId, activityId)).then(renderActivityGrid);
    }
  }

  function renderOnlineResults(items) {
    const list = els['gen-online-results'];
    if (!list) return;
    list.innerHTML = '';
    list.hidden = !items.length;
    items.forEach((item) => {
      const li = document.createElement('li');
      const name = document.createElement('span');
      name.className = 'online-result-title';
      name.textContent = item.title;
      const actions = document.createElement('span');
      actions.className = 'online-result-actions';
      if (item.meta) {
        const play = document.createElement('button');
        play.type = 'button';
        play.className = 'btn btn-primary btn-small';
        play.textContent = 'Play online';
        play.addEventListener('click', () => playOnline(item.meta));
        const share = document.createElement('button');
        share.type = 'button';
        share.className = 'btn btn-small';
        share.textContent = 'Share link';
        share.addEventListener('click', () => openShareDialog(item.bookId, item.activityId, item.title));
        actions.appendChild(play);
        actions.appendChild(share);
      } else {
        const warn = document.createElement('span');
        warn.className = 'online-result-error';
        warn.textContent = item.error || 'Not saved online';
        actions.appendChild(warn);
      }
      li.appendChild(name);
      li.appendChild(actions);
      list.appendChild(li);
    });
  }

  function openActivity(activity) {
    const hasBuiltin = Generate && activity && Generate.hasBuiltinPack &&
      Generate.hasBuiltinPack(activity.bookId, activity.type);
    if (Generate && activity && !hasBuiltin) {
      const saved = Generate.getSavedPack(activity.bookId, activity.type);
      if (saved && saved.html && activity.generated) {
        Generate.openHtml(saved.html);
        return;
      }
    }
    if (!activity || !activity.entryHtml) {
      setStatus(els['browse-status'], 'This activity has no file path.', { isError: true, toast: true, toastType: 'error' });
      return;
    }
    window.open(activity.entryHtml, '_blank', 'noopener');
  }

  function renderActivityGrid() {
    const grid = els['activity-grid'];
    grid.innerHTML = '';
    if (!prefs.bookId) {
      grid.innerHTML = '<div class="empty-state">Pick a level that has books, or add books later.</div>';
      setStatus(els['browse-status'], '');
      return;
    }
    const book = Catalog.getBook(prefs.bookId);
    const activities = Catalog.getActivitiesForBook(prefs.bookId, { includeHidden: false });
    if (!activities.length) {
      grid.innerHTML = '<div class="empty-state">No activities for <strong>' +
        (book ? book.title : prefs.bookId) +
        '</strong> yet. Use <strong>Generate</strong> or register a file below.</div>';
      setStatus(els['browse-status'], 'Level ' + prefs.levelId + ' · ' + (book ? book.title : prefs.bookId) + ' · 0 activities');
      return;
    }
    activities.forEach((act) => {
      const card = document.createElement('article');
      card.className = 'card';
      const title = document.createElement('h3');
      title.textContent = act.title;
      const path = document.createElement('p');
      path.textContent = act.entryHtml;
      const meta = document.createElement('div');
      meta.className = 'card-meta';
      meta.innerHTML =
        '<span class="badge">' + typeLabel(act.type) + '</span>' +
        '<span class="' + statusBadgeClass(act.status) + '">' + (act.status || 'draft') + '</span>' +
        (act.cefr ? '<span class="badge">' + act.cefr + '</span>' : '');
      const actions = document.createElement('div');
      actions.className = 'card-actions';
      const openBtn = document.createElement('button');
      openBtn.type = 'button';
      openBtn.className = 'btn btn-primary';
      openBtn.textContent = 'Open';
      openBtn.addEventListener('click', () => openActivity(act));
      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'btn';
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', () => {
        fillManageForm(act);
        const fold = document.querySelector('.manage-fold');
        if (fold) fold.open = true;
      });
      const online = act.generated ? onlineMeta(act.bookId, act.type) : null;
      if (online) {
        const playBtn = document.createElement('button');
        playBtn.type = 'button';
        playBtn.className = 'btn btn-primary';
        playBtn.textContent = 'Play online';
        playBtn.addEventListener('click', () => playOnline(online));
        const shareBtn = document.createElement('button');
        shareBtn.type = 'button';
        shareBtn.className = 'btn';
        shareBtn.textContent = online.sharePath ? 'Share link · on' : 'Share link';
        shareBtn.addEventListener('click', () => openShareDialog(act.bookId, act.type, act.title));
        openBtn.className = 'btn';
        openBtn.textContent = 'Open file';
        actions.appendChild(playBtn);
        actions.appendChild(shareBtn);
      }
      actions.appendChild(openBtn);
      actions.appendChild(editBtn);
      card.appendChild(title);
      card.appendChild(path);
      card.appendChild(meta);
      card.appendChild(actions);
      grid.appendChild(card);
    });
    setStatus(
      els['browse-status'],
      'Level ' + prefs.levelId + ' · ' + book.title + ' · ' + activities.length +
        (activities.length === 1 ? ' activity' : ' activities')
    );
  }

  function persistPrefs() {
    Catalog.savePrefs({ levelId: prefs.levelId, bookId: prefs.bookId, panel: prefs.panel });
  }

  function onLevelChanged() {
    prefs.levelId = els['level-select'].value;
    fillBookSelect();
    renderLevelChips();
    renderActivityGrid();
    persistPrefs();
  }

  function onBookChanged() {
    prefs.bookId = els['book-select'].value;
    renderActivityGrid();
    persistPrefs();
  }

  function showPanel(name) {
    prefs.panel = mapLegacyPanel(name);
    PANELS.forEach((panel) => {
      const panelEl = $('panel-' + panel);
      const tabEl = $('tab-' + panel);
      if (!panelEl || !tabEl) return;
      const active = panel === prefs.panel;
      panelEl.classList.toggle('is-active', active);
      panelEl.hidden = !active;
      tabEl.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    if (prefs.panel === 'activity') renderActivityTypes();
    if (prefs.panel === 'curriculum') renderCurriculum();
    if (prefs.panel === 'generate') fillGenerateForm();
    if (prefs.panel === 'loader') {
      renderManageList();
      fillManageBookAndTypeSelects();
      renderActivityGrid();
      renderSchoolPacks();
    }
    persistPrefs();
  }

  function renderActivityTypes() {
    const grid = els['activity-type-grid'];
    grid.innerHTML = '';
    Domain.getTypes().forEach((type) => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML =
        '<h3>' + type.name + '</h3>' +
        '<p>' + (type.description || '') + '</p>' +
        '<div class="card-meta">' +
        '<span class="badge">' + type.id + '</span>' +
        (type.template ? '<span class="badge badge-ready">template ready</span>' : '<span class="badge">manual HTML</span>') +
        '</div>';
      grid.appendChild(card);
    });
    Domain.getSavedStyles().forEach((style) => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML =
        '<h3>' + style.name + '</h3>' +
        '<p>' + (style.description || 'Custom style saved in this browser.') + '</p>' +
        '<div class="card-meta">' +
        '<span class="badge">' + style.id + '</span>' +
        '<span class="badge badge-ready">' + style.contentSchema + '</span>' +
        '<span class="badge">saved style</span>' +
        '</div>';
      grid.appendChild(card);
    });
    renderStyleList();
  }

  function renderStyleList() {
    const list = els['style-list'];
    if (!list) return;
    list.innerHTML = '';
    const styles = Domain.getSavedStyles();
    if (!styles.length) {
      list.innerHTML = '<li class="empty-state">No custom styles yet. Parse one above, then Save.</li>';
      return;
    }
    styles.forEach((style) => {
      const li = document.createElement('li');
      li.className = 'manage-item';
      const info = document.createElement('div');
      info.innerHTML = '<strong>' + style.name + '</strong><span>' + style.contentSchema + ' · ' + (style.source || 'ai') + '</span>';
      const actions = document.createElement('div');
      actions.className = 'card-actions';
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'btn btn-danger';
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', () => {
        Domain.removeSavedStyle(style.id);
        renderActivityTypes();
        fillGenerateForm();
        setStatus(els['style-status'], 'Removed style “' + style.name + '”.', { toast: true, toastType: 'success' });
      });
      actions.appendChild(removeBtn);
      li.appendChild(info);
      li.appendChild(actions);
      list.appendChild(li);
    });
  }

  function renderStylePreview(parsed) {
    const host = els['style-preview'];
    const frame = els['style-preview-frame'];
    if (!host) return;
    if (!parsed) {
      host.innerHTML = '<p class="hint">No style parsed yet.</p>';
      if (frame) {
        frame.hidden = true;
        frame.removeAttribute('srcdoc');
      }
      if (els['style-save-btn']) els['style-save-btn'].disabled = true;
      return;
    }
    host.innerHTML =
      '<h3>' + parsed.name + '</h3>' +
      '<p>' + (parsed.description || '') + '</p>' +
      '<p>Schema: <strong>' + parsed.contentSchema + '</strong> · Source: ' + parsed.source +
      (parsed.confidence != null ? ' · Confidence: ' + Math.round(parsed.confidence * 100) + '%' : '') + '</p>' +
      (parsed.reason ? '<p>' + parsed.reason + '</p>' : '') +
      '<p class="hint">Check the live preview below. If it looks blank or broken, do not save — try again with a clearer description or another HTML file.</p>';
    if (frame) {
      frame.hidden = false;
      frame.srcdoc = parsed.previewHtml || '';
    }
    if (els['style-save-btn']) els['style-save-btn'].disabled = false;
  }

  async function onParseStyle(event) {
    event.preventDefault();
    if (!Styles) {
      setStatus(els['style-status'], 'Style parser is not loaded.', { isError: true, toast: true, toastType: 'error' });
      return;
    }
    persistCustomFields('style');
    const providerId = currentProvider('style');
    Domain.setSelectedAiProvider(providerId);
    const modelId = providerId === 'custom'
      ? Domain.getCustomAiSettings().model
      : (els['style-ai-model'] && els['style-ai-model'].value);
    Domain.setSelectedModel(providerId, modelId);
    const apiKey = (els['style-api-key'] && els['style-api-key'].value.trim()) || Domain.getApiKey(providerId);
    Domain.setApiKey(providerId, apiKey);
    const file = els['style-file'] && els['style-file'].files && els['style-file'].files[0];
    const description = els['style-description'] ? els['style-description'].value.trim() : '';
    if (!file && !description) {
      setStatus(els['style-status'], 'Choose an HTML file or write a short description first.', { isError: true, toast: true, toastType: 'error' });
      return;
    }
    if (els['style-parse-btn']) els['style-parse-btn'].disabled = true;
    if (els['style-save-btn']) els['style-save-btn'].disabled = true;
    setStatus(els['style-status'], 'Parsing with AI…');
    try {
      const opts = { provider: providerId, model: modelId, apiKey: apiKey };
      pendingStyle = file
        ? await Styles.parseHtmlFile(file, opts)
        : await Styles.parseDescription(description, opts);
      if (!pendingStyle.previewHtml || pendingStyle.previewHtml.length < 40) {
        throw new Error('Preview looks empty. Try again with a clearer description or another file.');
      }
      renderStylePreview(pendingStyle);
      setStatus(
        els['style-status'],
        'Parsed “' + pendingStyle.name + '”. Check the preview, then Save style.',
        { toast: true, toastType: 'success' }
      );
    } catch (err) {
      pendingStyle = null;
      renderStylePreview(null);
      const msg = (window.ActivityAI && window.ActivityAI.friendlyError)
        ? window.ActivityAI.friendlyError(err)
        : (err.message || String(err));
      setStatus(els['style-status'], msg, { isError: true, toast: true, toastType: 'error' });
    } finally {
      if (els['style-parse-btn']) els['style-parse-btn'].disabled = false;
    }
  }

  function onSaveStyle() {
    try {
      if (!pendingStyle) throw new Error('Parse a style first, then Save.');
      const saved = Styles.saveParsed(pendingStyle);
      pendingStyle = null;
      if (els['style-file']) els['style-file'].value = '';
      if (els['style-description']) els['style-description'].value = '';
      renderStylePreview(null);
      renderActivityTypes();
      fillGenerateForm();
      setStatus(
        els['style-status'],
        'Saved style “' + saved.name + '”. It now appears in Generate.',
        { toast: true, toastType: 'success' }
      );
    } catch (err) {
      setStatus(els['style-status'], err.message || String(err), { isError: true, toast: true, toastType: 'error' });
    }
  }

  function syncApiKeys(fromId) {
    let source = 'generate';
    if (fromId === 'curr-api-key') source = 'curriculum';
    if (fromId === 'style-api-key') source = 'style';
    const providerId = currentProvider(source);
    const value = (els[fromId] && els[fromId].value) || '';
    Domain.setApiKey(providerId, value);
    ['curr-api-key', 'gen-api-key', 'style-api-key'].forEach((id) => {
      if (!els[id] || id === fromId) return;
      const otherSource = id === 'curr-api-key' ? 'curriculum' : (id === 'style-api-key' ? 'style' : 'generate');
      if (currentProvider(otherSource) === providerId) els[id].value = value;
    });
  }

  function selectedActivityIds() {
    return Array.prototype.map.call(
      document.querySelectorAll('.gen-activity-check:checked'),
      (el) => el.value
    );
  }

  function booksForLevel(levelId) {
    return Domain.getBooks().filter((book) => (book.levelIds || []).indexOf(levelId) >= 0);
  }

  function levelParseStats(levelId) {
    const books = booksForLevel(levelId);
    let parsedCount = 0;
    books.forEach((book) => {
      if (Domain.hasBreakdown(book.id)) parsedCount += 1;
    });
    return { bookCount: books.length, parsedCount: parsedCount };
  }

  function parseStatusBadge(parsedCount, bookCount) {
    const badge = document.createElement('span');
    badge.className = 'badge';
    if (!bookCount) {
      badge.textContent = 'No books yet';
      return badge;
    }
    if (parsedCount >= bookCount) {
      badge.classList.add('badge-ready');
      badge.textContent = bookCount === 1 ? 'Parsed' : 'All parsed';
      return badge;
    }
    if (parsedCount > 0) {
      badge.classList.add('badge-draft');
      badge.textContent = parsedCount + ' of ' + bookCount + ' parsed';
      return badge;
    }
    badge.textContent = 'Not parsed yet';
    return badge;
  }

  function renderBreakdownPreview(host, breakdown) {
    host.innerHTML = '';
    if (!breakdown || !Array.isArray(breakdown.units) || !breakdown.units.length) {
      host.hidden = true;
      return;
    }
    host.hidden = false;
    breakdown.units.forEach((unit) => {
      const h = document.createElement('h4');
      h.textContent = unit.title;
      host.appendChild(h);
      const ul = document.createElement('ul');
      (unit.grammar || []).forEach((g) => {
        const li = document.createElement('li');
        li.textContent = g.point + (g.example ? ' — ' + g.example : '');
        ul.appendChild(li);
      });
      if (ul.childNodes.length) host.appendChild(ul);
      const words = document.createElement('div');
      (unit.vocabulary || []).forEach((w) => {
        const chip = document.createElement('span');
        chip.className = 'vocab-chip';
        chip.textContent = w.en + (w.ko ? ' / ' + w.ko : '');
        words.appendChild(chip);
      });
      if (words.childNodes.length) host.appendChild(words);
    });
  }

  function renderCurriculum() {
    const host = els['curriculum-grid'];
    host.innerHTML = '';
    syncAiControls('curriculum');
    const assigned = {};
    Catalog.getLevels().forEach((level) => {
      const books = booksForLevel(level.id).filter((book) => !assigned[book.id]);
      books.forEach((book) => { assigned[book.id] = true; });
      if (!books.length) return;
      host.appendChild(renderCurriculumLevel(level, books));
    });
    const leftover = Domain.getBooks().filter((book) => !assigned[book.id]);
    if (leftover.length) {
      host.appendChild(renderCurriculumLevel({ id: 'other', name: 'Other books' }, leftover));
    }
  }

  function renderCurriculumLevel(level, books) {
    const section = document.createElement('section');
    section.className = 'curriculum-level';
    const head = document.createElement('div');
    head.className = 'curriculum-level-head';
    const title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = level.name;
    const parsedCount = books.filter((book) => Domain.hasBreakdown(book.id)).length;
    head.appendChild(title);
    head.appendChild(parseStatusBadge(parsedCount, books.length));
    section.appendChild(head);
    const grid = document.createElement('div');
    grid.className = 'card-grid curriculum-grid';
    books.forEach((book) => {
      grid.appendChild(renderCurriculumBookCard(book));
    });
    section.appendChild(grid);
    return section;
  }

  function renderCurriculumBookCard(book) {
      const saved = Domain.getBreakdown(book.id);
      const pending = pendingBreakdowns[book.id];
      const card = document.createElement('article');
      card.className = 'card';
      if (pending) card.classList.add('is-pending');
      else if (saved) card.classList.add('is-parsed');
      const head = document.createElement('div');
      head.className = 'card-head';
      const title = document.createElement('h3');
      title.textContent = book.title;
      const status = document.createElement('span');
      status.className = 'badge';
      if (pending) {
        status.classList.add('badge-draft');
        status.textContent = 'Check then Save';
      } else if (saved) {
        status.classList.add('badge-ready');
        status.textContent = 'Parsed';
      } else {
        status.textContent = 'Not parsed yet';
      }
      head.appendChild(title);
      head.appendChild(status);
      const p = document.createElement('p');
      const parts = [(book.levelIds || []).join(', ') || 'No level'];
      if (book.cefr) parts.push(book.cefr);
      parts.push(book.units && book.units.length ? book.units.length + ' units' : 'no units yet');
      if (saved) parts.push(Domain.countBreakdownWords(saved) + ' words saved');
      p.textContent = parts.join(' · ');
      const parseNote = document.createElement('p');
      parseNote.className = 'parse-meta';
      if (pending) {
        parseNote.textContent = 'New list is ready to review. Scroll this card and click Save if it looks right.';
      } else if (saved) {
        parseNote.textContent = 'Word list is already saved. Generate can use this book now.';
      } else {
        parseNote.textContent = 'Upload pages and Analyze to create a word list for this book.';
      }
      const field = document.createElement('div');
      field.className = 'field';
      const lab = document.createElement('label');
      lab.textContent = 'CEFR';
      const sel = document.createElement('select');
      sel.className = 'select';
      Domain.getCefrOptions().forEach((opt) => {
        const o = document.createElement('option');
        o.value = opt;
        o.textContent = opt;
        if (opt === book.cefr) o.selected = true;
        sel.appendChild(o);
      });
      sel.addEventListener('change', () => {
        Domain.setBookCefr(book.id, sel.value);
        setStatus(els['curriculum-status'], 'Saved CEFR ' + sel.value + ' for ' + book.title, { toast: true, toastType: 'success' });
        fillGenerateForm();
        fillBookSelect();
      });
      field.appendChild(lab);
      field.appendChild(sel);

      if (!Domain.isFactoryBook(book.id) && !Catalog.isFactoryBook(book.id)) {
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn btn-danger';
        removeBtn.textContent = 'Remove book';
        removeBtn.addEventListener('click', () => {
          if (!window.confirm('Remove “' + book.title + '” from this browser? Saved word lists for this book will also be deleted.')) {
            return;
          }
          try {
            Catalog.removeAddedBook(book.id);
            Domain.removeAddedBook(book.id);
            delete pendingBreakdowns[book.id];
            if (prefs.bookId === book.id) prefs.bookId = '';
            persistPrefs();
            refreshAfterCatalogEdit();
            setStatus(els['curriculum-status'], 'Removed “' + book.title + '”.', { toast: true, toastType: 'success' });
          } catch (err) {
            setStatus(els['curriculum-status'], err.message || String(err), { isError: true, toast: true, toastType: 'error' });
          }
        });
        field.appendChild(removeBtn);
      }

      const box = document.createElement('div');
      box.className = 'analyze-box';
      const fileLab = document.createElement('label');
      fileLab.textContent = 'PDF or page photos';
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.className = 'file-input';
      fileInput.accept = '.pdf,image/jpeg,image/png,.jpg,.jpeg,.png';
      fileInput.multiple = true;
      const shrinkStatus = document.createElement('p');
      shrinkStatus.className = 'analyze-shrink';
      shrinkStatus.textContent = 'Upload a PDF or photos. The app keeps the words and shrinks the file before sending.';
      const progressWrap = document.createElement('div');
      progressWrap.className = 'analyze-progress';
      progressWrap.hidden = true;
      const progressLabel = document.createElement('p');
      progressLabel.className = 'analyze-progress-label';
      const progressTrack = document.createElement('div');
      progressTrack.className = 'analyze-progress-track';
      const progressFill = document.createElement('div');
      progressFill.className = 'analyze-progress-fill';
      progressTrack.appendChild(progressFill);
      progressWrap.appendChild(progressLabel);
      progressWrap.appendChild(progressTrack);

      function showProgress(payload) {
        var msg = typeof payload === 'string' ? payload : (payload && payload.message || '');
        var current = payload && payload.current;
        var total = payload && payload.total;
        progressWrap.hidden = false;
        progressLabel.textContent = msg;
        if (total && total > 0 && current != null) {
          progressWrap.classList.remove('is-indeterminate');
          progressFill.style.width = Math.round((current / total) * 100) + '%';
        } else {
          progressWrap.classList.add('is-indeterminate');
          progressFill.style.width = '';
        }
      }
      function hideProgress() {
        progressWrap.hidden = true;
        progressWrap.classList.remove('is-indeterminate');
        progressFill.style.width = '0%';
        progressLabel.textContent = '';
      }

      const note = document.createElement('input');
      note.className = 'input';
      note.placeholder = 'Optional note, e.g. this is Units 1–2';
      const actions = document.createElement('div');
      actions.className = 'card-actions';
      const analyzeBtn = document.createElement('button');
      analyzeBtn.type = 'button';
      analyzeBtn.className = 'btn btn-primary';
      analyzeBtn.textContent = 'Analyze';
      const saveBtn = document.createElement('button');
      saveBtn.type = 'button';
      saveBtn.className = 'btn';
      saveBtn.textContent = 'Save breakdown';
      saveBtn.disabled = !pending;
      const mergeBtn = document.createElement('button');
      mergeBtn.type = 'button';
      mergeBtn.className = 'btn';
      mergeBtn.textContent = 'Add more pages';
      mergeBtn.disabled = !pending || !saved;
      const downloadTxtBtn = document.createElement('button');
      downloadTxtBtn.type = 'button';
      downloadTxtBtn.className = 'btn';
      downloadTxtBtn.textContent = 'Download text';
      downloadTxtBtn.disabled = true;
      actions.appendChild(analyzeBtn);
      actions.appendChild(saveBtn);
      actions.appendChild(mergeBtn);
      actions.appendChild(downloadTxtBtn);
      const preview = document.createElement('div');
      preview.className = 'breakdown-preview';
      renderBreakdownPreview(preview, pending || saved);

      let inspectInfo = null;
      fileInput.addEventListener('change', async () => {
        inspectInfo = null;
        downloadTxtBtn.disabled = true;
        if (!fileInput.files || !fileInput.files.length) {
          shrinkStatus.textContent = 'Upload a PDF or photos. The app keeps the words and shrinks the file before sending.';
          return;
        }
        shrinkStatus.textContent = 'Reading file…';
        try {
          inspectInfo = await Analyze.inspectFiles(fileInput.files, function (payload) {
            showProgress(payload);
            shrinkStatus.textContent = typeof payload === 'string' ? payload : (payload && payload.message || '');
          });
          hideProgress();
          shrinkStatus.textContent = inspectInfo.summary;
          downloadTxtBtn.disabled = !inspectInfo.downloadText;
        } catch (err) {
          hideProgress();
          inspectInfo = null;
          shrinkStatus.textContent = (Analyze && Analyze.friendlyError) ? Analyze.friendlyError(err) : (err.message || String(err));
        }
      });
      downloadTxtBtn.addEventListener('click', () => {
        if (!inspectInfo || !inspectInfo.downloadText) return;
        Analyze.downloadText(inspectInfo.downloadName, inspectInfo.downloadText);
      });

      analyzeBtn.addEventListener('click', async () => {
        const providerId = currentProvider('curriculum');
        persistCustomFields('curriculum');
        const modelId = providerId === 'custom'
          ? Domain.getCustomAiSettings().model
          : els['curr-ai-model'].value;
        const apiKey = (els['curr-api-key'] && els['curr-api-key'].value.trim()) || Domain.getApiKey(providerId);
        Domain.setSelectedAiProvider(providerId);
        Domain.setSelectedModel(providerId, modelId);
        Domain.setApiKey(providerId, apiKey);
        analyzeBtn.disabled = true;
        downloadTxtBtn.disabled = true;
        setStatus(els['curriculum-status'], 'Reading pages with ' + Domain.getAiProvider(providerId).label + '…');
        try {
          const result = await Analyze.analyze({
            book: book,
            files: fileInput.files,
            note: note.value,
            apiKey: apiKey,
            provider: providerId,
            model: modelId,
            onProgress: function (payload) {
              var msg = typeof payload === 'string' ? payload : (payload && payload.message || '');
              showProgress(payload);
              shrinkStatus.textContent = msg;
              setStatus(els['curriculum-status'], msg);
            }
          });
          hideProgress();
          pendingBreakdowns[book.id] = result;
          setStatus(
            els['curriculum-status'],
            'Check the list for ' + book.title + ', then Save. Found ' +
              result.units.length + ' units and ' + Domain.countBreakdownWords(result) + ' words.',
            { toast: true, toastType: 'success' }
          );
          renderCurriculum();
          fillGenerateForm();
        } catch (err) {
          hideProgress();
          const msg = (Analyze && Analyze.friendlyError) ? Analyze.friendlyError(err) : (err.message || String(err));
          setStatus(els['curriculum-status'], msg, { isError: true, toast: true, toastType: 'error' });
          analyzeBtn.disabled = false;
          downloadTxtBtn.disabled = !(inspectInfo && inspectInfo.downloadText);
        }
      });
      saveBtn.addEventListener('click', () => {
        const incoming = pendingBreakdowns[book.id];
        if (!incoming) {
          setStatus(els['curriculum-status'], 'Analyze first, then Save.', { isError: true, toast: true, toastType: 'error' });
          return;
        }
        saveBtn.disabled = true;
        persistBreakdown(book.id, incoming, false).then(() => {
          delete pendingBreakdowns[book.id];
          setStatus(els['curriculum-status'], breakdownSaveMessage(book.title), { toast: true, toastType: 'success' });
          updateLibraryBadge();
          renderCurriculum();
          fillGenerateForm();
          fillBookSelect();
          Array.prototype.forEach.call(document.querySelectorAll('.gen-activity-check'), (el) => { el.checked = true; });
          if (els['gen-all']) els['gen-all'].checked = true;
        }).catch((err) => {
          setStatus(els['curriculum-status'], err.message || String(err), { isError: true, toast: true, toastType: 'error' });
        }).finally(() => {
          saveBtn.disabled = false;
        });
      });
      mergeBtn.addEventListener('click', () => {
        const incoming = pendingBreakdowns[book.id];
        if (!incoming) {
          setStatus(els['curriculum-status'], 'Analyze the new pages first, then Add more pages.', { isError: true, toast: true, toastType: 'error' });
          return;
        }
        mergeBtn.disabled = true;
        persistBreakdown(book.id, incoming, true).then(() => {
          delete pendingBreakdowns[book.id];
          setStatus(els['curriculum-status'], 'Merged extra units into ' + book.title + (Library && Library.isServerAvailable() && Library.getWriteToken() ? ' on the team library.' : '.'), { toast: true, toastType: 'success' });
          updateLibraryBadge();
          renderCurriculum();
          fillGenerateForm();
          fillBookSelect();
          Array.prototype.forEach.call(document.querySelectorAll('.gen-activity-check'), (el) => { el.checked = true; });
          if (els['gen-all']) els['gen-all'].checked = true;
        }).catch((err) => {
          setStatus(els['curriculum-status'], err.message || String(err), { isError: true, toast: true, toastType: 'error' });
        }).finally(() => {
          mergeBtn.disabled = false;
        });
      });

      box.appendChild(fileLab);
      box.appendChild(fileInput);
      box.appendChild(shrinkStatus);
      box.appendChild(progressWrap);
      box.appendChild(note);
      box.appendChild(actions);
      box.appendChild(preview);
      card.appendChild(head);
      card.appendChild(p);
      card.appendChild(parseNote);
      card.appendChild(field);
      card.appendChild(box);
      return card;
  }

  function fillActivityChecks(bookId) {
    const host = els['gen-activity-list'];
    if (!host) return;
    const prev = {};
    Array.prototype.forEach.call(document.querySelectorAll('.gen-activity-check'), (el) => {
      prev[el.value] = el.checked;
    });
    host.innerHTML = '';
    const hasPrev = Object.keys(prev).length > 0;
    const hasBreakdown = Domain.hasBreakdown(bookId);
    Domain.getGeneratableTypes().forEach((t) => {
      const lab = document.createElement('label');
      lab.className = 'check-line';
      const box = document.createElement('input');
      box.type = 'checkbox';
      box.className = 'gen-activity-check';
      box.value = t.id;
      if (hasPrev) box.checked = !!prev[t.id];
      else box.checked = hasBreakdown ? true : (t.id === 'jumpingOx');
      lab.appendChild(box);
      lab.appendChild(document.createTextNode(t.name));
      host.appendChild(lab);
    });
    const checks = document.querySelectorAll('.gen-activity-check');
    if (els['gen-all']) {
      els['gen-all'].checked = checks.length > 0 && Array.prototype.every.call(checks, (c) => c.checked);
    }
  }

  function updateGenerateHint() {
    const hint = els['gen-breakdown-hint'];
    if (!hint) return;
    var bookId = els['gen-book'].value;
    if (Domain.hasBreakdown(bookId)) {
      var b = Domain.getBreakdown(bookId);
      hint.textContent = 'Saved breakdown: ' + b.units.length + ' units, ' +
        Domain.countBreakdownWords(b) + ' words. ' +
        'Vocabulary / Team Match / Charades use these words directly. ' +
        'Jumping OX / Jeopardy use built-in packs unless you pick AI mode. ' +
        'Sentence Scramble / Gap Fill / Writing Card Spinner use AI when a key is pasted, otherwise the grammar examples.';
    } else {
      hint.textContent = 'No saved breakdown for this book. ' +
        'Vocabulary / Team Match / Charades need Analyze + Save first (Curriculum tab). ' +
        'Jumping OX / Jeopardy can still generate from a built-in pack if one exists, or via AI mode. ' +
        'Sentence Scramble / Gap Fill / Writing Card Spinner need Analyze + Save (or a built-in pack).';
    }
  }

  function fillGenerateForm() {
    syncGenerateSaveOptions();
    const bookSel = els['gen-book'];
    const cefrSel = els['gen-cefr'];
    const prevBook = bookSel.value;
    bookSel.innerHTML = '';
    Domain.getBooks().forEach((b) => {
      const o = document.createElement('option');
      o.value = b.id;
      o.textContent = b.title + ' (' + (b.cefr || 'A1') + ')' +
        (!(b.units && b.units.length) ? ' — analyze first' : '');
      bookSel.appendChild(o);
    });
    if (prevBook) bookSel.value = prevBook;
    else if (prefs.bookId) bookSel.value = prefs.bookId;
    fillActivityChecks(bookSel.value);
    cefrSel.innerHTML = '';
    Domain.getCefrOptions().forEach((c) => {
      const o = document.createElement('option');
      o.value = c;
      o.textContent = c;
      cefrSel.appendChild(o);
    });
    syncGenerateCefr();
    syncAiControls('generate');
    toggleApiField();
    updateGenerateHint();
    refreshOutputFolderLabel();
  }

  function refreshOutputFolderLabel() {
    const label = els['gen-output-folder-label'];
    const hint = els['gen-output-folder-hint'];
    const btn = els['gen-change-folder-btn'];
    if (!label || !Generate.getOutputFolderInfo) return;
    const info = Generate.getOutputFolderInfo();
    if (!info.supported) {
      label.textContent = 'Output folder: not available in this browser (files download instead)';
      if (hint) hint.textContent = 'This browser cannot remember a save folder. Generated files go to your Downloads folder.';
      if (btn) btn.disabled = true;
      return;
    }
    if (btn) btn.disabled = false;
    label.textContent = info.name
      ? ('Output folder: ' + info.name)
      : 'Output folder: not set yet';
    if (hint) {
      hint.textContent = info.name
        ? 'Generate writes HTML files into this folder. Use Change folder to pick a different one.'
        : 'First Generate asks once where to save. Later runs reuse that folder.';
    }
  }

  async function onChangeOutputFolder() {
    if (!Generate.pickOutputFolder) return;
    const info = Generate.getOutputFolderInfo();
    if (!info.supported) {
      setStatus(els['generate-status'], 'This browser cannot pick a save folder.', {
        isError: true,
        toast: true,
        toastType: 'error'
      });
      return;
    }
    try {
      await Generate.pickOutputFolder();
      refreshOutputFolderLabel();
      const next = Generate.getOutputFolderInfo();
      setStatus(els['generate-status'], 'Output folder set to “' + (next.name || 'selected folder') + '”.', {
        toast: true,
        toastType: 'success'
      });
    } catch (err) {
      const msg = err && err.message ? err.message : String(err);
      if (msg.indexOf('cancelled') !== -1) {
        setStatus(els['generate-status'], 'Folder pick cancelled. Previous folder kept.', {
          toast: true,
          toastType: 'warning'
        });
        return;
      }
      setStatus(els['generate-status'], msg, { isError: true, toast: true, toastType: 'error' });
    }
  }

  function syncGenerateCefr() {
    const book = Domain.getBook(els['gen-book'].value);
    if (book && book.cefr) els['gen-cefr'].value = book.cefr;
    updateGenerateHint();
  }

  function toggleApiField() {
    if (els['api-key-field']) els['api-key-field'].hidden = false;
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function onGenerate(event) {
    event.preventDefault();
    const bookId = els['gen-book'].value;
    const activityIds = selectedActivityIds();
    const cefr = els['gen-cefr'].value;
    const mode = els['gen-mode'].value;
    const providerId = currentProvider('generate');
    persistCustomFields('generate');
    const modelId = providerId === 'custom'
      ? Domain.getCustomAiSettings().model
      : els['gen-ai-model'].value;
    const apiKey = els['gen-api-key'].value.trim();
    if (!activityIds.length) {
      setStatus(els['generate-status'], 'Tick at least one activity.', { isError: true, toast: true, toastType: 'error' });
      return;
    }
    els['generate-btn'].disabled = true;
    Domain.setSelectedAiProvider(providerId);
    Domain.setSelectedModel(providerId, modelId);
    Domain.setApiKey(providerId, apiKey);
    if (els['gen-save-cefr'].checked) Domain.setBookCefr(bookId, cefr);
    const book = Domain.getBook(bookId);
    const ok = [];
    const fail = [];
    let savedToFolder = '';
    let usedDownload = false;
    const saveFiles = alsoDownloadWanted();
    const onlineItems = [];
    renderOnlineResults([]);
    try {
      for (let i = 0; i < activityIds.length; i++) {
        const activityId = activityIds[i];
        let usedMode = mode;
        if (!VOCAB_TYPES[activityId] && mode === 'builtin' && Generate.hasBuiltinPack && !Generate.hasBuiltinPack(bookId, activityId)) {
          if (apiKey) usedMode = 'ai';
        }
        setStatus(
          els['generate-status'],
          (i + 1) + '/' + activityIds.length + ' ' +
            (VOCAB_TYPES[activityId] ? 'Baking ' : (usedMode === 'ai' ? 'Calling ' + Domain.getAiProvider(providerId).label + ' for ' : 'Baking ')) +
            activityId + '…'
        );
        try {
          const result = await Generate.generate({
            bookId: bookId,
            activityId: activityId,
            cefr: cefr,
            mode: usedMode,
            apiKey: apiKey,
            provider: providerId,
            model: modelId
          });
          lastGenerated = result;
          Catalog.upsertActivity({
            id: result.id,
            bookId: bookId,
            type: activityId,
            title: result.pack.title || ((book && book.title) + ' ' + activityId),
            entryHtml: result.path,
            status: 'ready',
            cefr: cefr,
            generated: true
          });
          const filename = result.filename || result.path.split('/').pop();
          const cloud = Generate.cloudSaveFor ? Generate.cloudSaveFor(bookId, activityId) : null;
          if (cloud) {
            const gameTitle = result.pack.title || ((book && book.title) + ' ' + activityId);
            try {
              await cloud;
              onlineItems.push({ bookId: bookId, activityId: activityId, title: gameTitle, meta: Library.getGeneratedMeta(bookId, activityId) });
            } catch (cloudErr) {
              onlineItems.push({ bookId: bookId, activityId: activityId, title: gameTitle, error: 'Not saved online: ' + (cloudErr && cloudErr.message ? cloudErr.message : cloudErr) });
            }
          }
          if (saveFiles || !cloud) {
            const saveResult = await Generate.saveHtml(filename, result.html, { pickIfMissing: true });
            if (saveResult && saveResult.method === 'folder') {
              savedToFolder = saveResult.folderName || Generate.getOutputFolderInfo().name || savedToFolder;
            } else {
              usedDownload = true;
            }
          }
          ok.push(cloud && !saveFiles ? (result.pack.title || filename) : filename);
          if (i < activityIds.length - 1) await sleep(450);
        } catch (err) {
          const msg = err && err.message ? err.message : String(err);
          if (msg.indexOf('cancelled') !== -1) {
            fail.push(activityId + ': ' + msg);
            break;
          }
          fail.push(activityId + ': ' + msg);
        }
      }
      refreshOutputFolderLabel();
      renderOnlineResults(onlineItems);
      const onlineOk = onlineItems.filter((item) => item.meta).length;
      let msg = ok.length
        ? (onlineOk && !savedToFolder && !usedDownload)
          ? ('Saved ' + onlineOk + ' game(s) to your account. Play them online below or from Loader.')
          : ((savedToFolder && !usedDownload)
          ? ('Saved ' + ok.length + ' file(s) to “' + savedToFolder + '”: ' + ok.join(', ') + '.')
          : (savedToFolder
            ? ('Saved/downloaded ' + ok.length + ' file(s): ' + ok.join(', ') + '. Folder: “' + savedToFolder + '”.')
            : ('Downloaded ' + ok.length + ' file(s): ' + ok.join(', ') + '.')))
        : 'Nothing saved.';
      if (ok.length && onlineOk && (savedToFolder || usedDownload)) msg += ' Also saved online — play below or from Loader.';
      if (fail.length) msg += ' Failed: ' + fail.join(' | ');
      setStatus(els['generate-status'], msg, {
        isError: fail.length > 0 && !ok.length,
        toast: true,
        toastType: fail.length ? (ok.length ? 'warning' : 'error') : 'success',
        toastOptions: {
          title: fail.length ? (ok.length ? 'Partial success' : 'Generate failed') : 'Generate complete'
        }
      });
      fillBookSelect();
      renderActivityGrid();
      renderManageList();
      renderCurriculum();
    } finally {
      els['generate-btn'].disabled = false;
    }
  }

  function renderImportPreview(result) {
    const host = els['import-preview'];
    if (!host) return;
    if (!result) {
      host.innerHTML = '<p class="hint">No file inspected yet.</p>';
      return;
    }
    const confidence = Math.round((Number(result.confidence || 0)) * 100);
    const items = [];
    items.push('<li><strong>Detected schema:</strong> ' + (result.schema || 'unknown') + '</li>');
    items.push('<li><strong>Suggested type:</strong> ' + (result.detectedType || 'unknown') + '</li>');
    items.push('<li><strong>Confidence:</strong> ' + confidence + '%</li>');
    items.push('<li><strong>Source:</strong> ' + (result.source || 'local') + '</li>');
    if (result.evidence) items.push('<li><strong>Why:</strong> ' + result.evidence + '</li>');
    host.innerHTML =
      '<h3>' + (result.title || 'Imported activity') + '</h3>' +
      '<ul>' + items.join('') + '</ul>';
  }

  function fillImportSelects() {
    if (!els['import-book'] || !els['import-type']) return;
    const currentBook = els['import-book'].value;
    els['import-book'].innerHTML = '';
    (Catalog.catalog.books || []).forEach((book) => {
      const opt = document.createElement('option');
      opt.value = book.id;
      opt.textContent = book.title + ' (' + (book.levelIds || []).join(', ') + ')';
      els['import-book'].appendChild(opt);
    });
    if (currentBook) els['import-book'].value = currentBook;
    else if (prefs.bookId) els['import-book'].value = prefs.bookId;

    const currentType = els['import-type'].value;
    els['import-type'].innerHTML = '';
    Domain.getGeneratableTypes().forEach((type) => {
      const opt = document.createElement('option');
      opt.value = type.id;
      opt.textContent = type.name;
      els['import-type'].appendChild(opt);
    });
    if (currentType) els['import-type'].value = currentType;
  }

  async function onInspectImport(event) {
    event.preventDefault();
    try {
      const file = els['import-file'].files && els['import-file'].files[0];
      pendingImport = await Importer.inspectFile(file);
      els['import-title'].value = pendingImport.title || '';
      if (pendingImport.detectedType) els['import-type'].value = pendingImport.detectedType;
      renderImportPreview(pendingImport);
      setStatus(
        els['import-status'],
        'Inspected ' + pendingImport.fileName + '. Confidence ' + Math.round(pendingImport.confidence * 100) + '%.',
        { toast: true, toastType: pendingImport.confidence >= 0.8 ? 'success' : 'warning' }
      );
    } catch (err) {
      pendingImport = null;
      renderImportPreview(null);
      setStatus(els['import-status'], err.message || String(err), { isError: true, toast: true, toastType: 'error' });
    }
  }

  async function onImportAiHelp() {
    try {
      if (!pendingImport) throw new Error('Inspect the HTML file first.');
      const providerId = Domain.getSelectedAiProvider();
      const modelId = Domain.getSelectedModel(providerId);
      const apiKey = Domain.getApiKey(providerId);
      pendingImport = await Importer.improveWithApi(pendingImport, {
        provider: providerId,
        model: modelId,
        apiKey: apiKey
      });
      els['import-title'].value = pendingImport.title || '';
      if (pendingImport.detectedType) els['import-type'].value = pendingImport.detectedType;
      renderImportPreview(pendingImport);
      setStatus(els['import-status'], 'AI helper mapped this file into ' + pendingImport.schema + '.', { toast: true, toastType: 'success' });
    } catch (err) {
      setStatus(els['import-status'], err.message || String(err), { isError: true, toast: true, toastType: 'error' });
    }
  }

  function onSaveImportedTemplate() {
    try {
      if (!pendingImport) throw new Error('Inspect an HTML file first.');
      const bookId = els['import-book'].value;
      const activityId = els['import-type'].value;
      const requiredSchema = {
        jumpingOx: 'unitQuestions',
        jeopardy: 'unitClues',
        vocabulary: 'vocabByUnit',
        teamMatch: 'vocabByUnit',
        charades: 'vocabByUnit',
        quizQuizTrade: 'vocabByUnit',
        fanNPick: 'vocabByUnit',
        findSomeoneWho: 'vocabByUnit',
        showdown: 'vocabByUnit',
        rallyCoach: 'vocabByUnit',
        sentenceScramble: 'unitSentences',
        gapFill: 'unitPassages',
        writingCards: 'writingCards'
      }[activityId] || '';
      const book = Domain.getBook(bookId) || Catalog.getBook(bookId);
      if (!book) throw new Error('Choose a book for this imported sample.');
      if (requiredSchema && pendingImport.schema !== requiredSchema) {
        throw new Error('This imported file looks like ' + pendingImport.schema + '. Choose a matching activity type first.');
      }
      const title = els['import-title'].value.trim() || pendingImport.title || 'Imported Activity';
      const templateAsset = {
        fileName: pendingImport.fileName,
        schema: pendingImport.schema,
        title: title,
        templateHtml: pendingImport.templateHtml,
        samplePack: pendingImport.pack,
        confidence: pendingImport.confidence,
        source: pendingImport.source
      };
      Importer.saveTemplate(activityId, templateAsset);
      const pack = clone(pendingImport.pack);
      pack.title = title;
      const html = Generate.renderHtml(activityId, pack, bookId);
      Generate.savePack(bookId, activityId, pack, html, book && book.cefr ? book.cefr : 'A1', 'imported-template');
      Catalog.upsertActivity({
        id: 'imported-' + Catalog.slugifyId(bookId + '-' + activityId),
        bookId: bookId,
        type: activityId,
        title: title,
        entryHtml: Generate.entryPath(bookId, activityId),
        status: 'ready',
        generated: true,
        cefr: book && book.cefr ? book.cefr : null
      });
      fillBookSelect();
      renderActivityGrid();
      renderManageList();
      fillGenerateForm();
      setStatus(
        els['import-status'],
        'Saved imported template for ' + typeLabel(activityId) + '. A sample activity was also registered for ' + book.title + '.',
        { toast: true, toastType: 'success' }
      );
    } catch (err) {
      setStatus(els['import-status'], err.message || String(err), { isError: true, toast: true, toastType: 'error' });
    }
  }

  function fillManageBookAndTypeSelects() {
    const bookSelect = els['act-book'];
    const typeSelect = els['act-type'];
    const currentBook = bookSelect.value;
    const currentType = typeSelect.value;
    bookSelect.innerHTML = '';
    (Catalog.catalog.books || []).forEach((book) => {
      const opt = document.createElement('option');
      opt.value = book.id;
      opt.textContent = book.title + ' (' + (book.levelIds || []).join(', ') + ')';
      bookSelect.appendChild(opt);
    });
    typeSelect.innerHTML = '';
    Catalog.getActivityTypes().forEach((t) => {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = t.label;
      typeSelect.appendChild(opt);
    });
    if (currentBook) bookSelect.value = currentBook;
    else if (prefs.bookId) bookSelect.value = prefs.bookId;
    if (currentType) typeSelect.value = currentType;
  }

  function clearManageForm() {
    els['edit-mode'].value = 'add';
    els['manage-form-title'].textContent = 'Add activity';
    els['act-id'].value = '';
    els['act-id'].readOnly = false;
    els['act-title'].value = '';
    els['act-path'].value = '';
    els['act-status'].value = 'ready';
    els['act-unit'].value = '';
    fillManageBookAndTypeSelects();
    if (prefs.bookId) els['act-book'].value = prefs.bookId;
    setStatus(els['manage-status'], '');
  }

  function fillManageForm(activity) {
    fillManageBookAndTypeSelects();
    els['edit-mode'].value = 'edit';
    els['manage-form-title'].textContent = 'Edit activity';
    els['act-id'].value = activity.id;
    els['act-id'].readOnly = true;
    els['act-title'].value = activity.title || '';
    els['act-book'].value = activity.bookId || '';
    els['act-type'].value = activity.type || 'vocabulary';
    els['act-path'].value = activity.entryHtml || '';
    els['act-status'].value = activity.status || 'draft';
    els['act-unit'].value = activity.unitFilter == null ? '' : activity.unitFilter;
    setStatus(els['manage-status'], 'Editing “' + activity.title + '”');
  }

  function renderManageList() {
    const list = els['manage-list'];
    list.innerHTML = '';
    const activities = Catalog.getAllActivities({ includeHidden: true });
    if (!activities.length) {
      list.innerHTML = '<li class="empty-state">No activities registered.</li>';
      return;
    }
    activities.forEach((act) => {
      const book = Catalog.getBook(act.bookId);
      const li = document.createElement('li');
      li.className = 'manage-item';
      const info = document.createElement('div');
      info.innerHTML =
        '<strong>' + act.title + (act.hidden ? ' (hidden)' : '') + '</strong>' +
        '<span>' + (book ? book.title : act.bookId) + ' · ' + typeLabel(act.type) +
        ' · ' + (act.status || 'draft') + (act.cefr ? ' · ' + act.cefr : '') + '</span>';
      const actions = document.createElement('div');
      actions.className = 'card-actions';
      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'btn';
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', () => fillManageForm(act));
      const hideBtn = document.createElement('button');
      hideBtn.type = 'button';
      hideBtn.className = 'btn';
      hideBtn.textContent = act.hidden ? 'Unhide' : 'Hide';
      hideBtn.addEventListener('click', () => {
        Catalog.setActivityHidden(act.id, !act.hidden);
        renderManageList();
        renderActivityGrid();
      });
      actions.appendChild(editBtn);
      actions.appendChild(hideBtn);
      if (!Catalog.isFactoryActivity(act.id)) {
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn btn-danger';
        removeBtn.textContent = 'Remove';
        removeBtn.addEventListener('click', () => {
          Catalog.removeAddedActivity(act.id);
          renderManageList();
          renderActivityGrid();
          clearManageForm();
        });
        actions.appendChild(removeBtn);
      }
      li.appendChild(info);
      li.appendChild(actions);
      list.appendChild(li);
    });
  }

  function collectBackupData() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || key.indexOf('activityLoader.') !== 0) continue;
      data[key] = localStorage.getItem(key);
    }
    return {
      app: 'activity-loader',
      version: 1,
      exportedAt: new Date().toISOString(),
      data: data
    };
  }

  function applyBackupData(payload) {
    const bag = payload && payload.data && typeof payload.data === 'object' ? payload.data : payload;
    if (!bag || typeof bag !== 'object') throw new Error('This file is not an Activity Loader backup.');
    const keys = Object.keys(bag).filter((key) => key.indexOf('activityLoader.') === 0);
    if (!keys.length) throw new Error('This backup has no Activity Loader data.');
    keys.forEach((key) => {
      const value = bag[key];
      if (value == null) localStorage.removeItem(key);
      else localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    });
  }

  function downloadBackupFile() {
    const payload = collectBackupData();
    const stamp = String(payload.exportedAt || '').slice(0, 10) || 'backup';
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'activity-loader-backup-' + stamp + '.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
    const count = Object.keys(payload.data || {}).length;
    setStatus(
      els['backup-status'],
      'Downloaded backup with ' + count + ' saved item' + (count === 1 ? '' : 's') + '. Keep this file private if it includes API keys.',
      { toast: true, toastType: 'success' }
    );
  }

  function restoreAfterBackup() {
    Catalog.reloadMerged();
    Domain.applyCurriculaOverlay();
    prefs = Catalog.getPrefs();
    prefs.panel = mapLegacyPanel(prefs.panel);
    fillProviderSelect('curr-ai-provider');
    fillProviderSelect('gen-ai-provider');
    fillProviderSelect('style-ai-provider');
    syncAllAiControls();
    fillNewBookLevelSelect();
    fillNewBookCefrSelect();
    renderCustomLevelList();
    fillLevelSelect();
    renderLevelChips();
    fillBookSelect();
    fillImportSelects();
    fillManageBookAndTypeSelects();
    fillGenerateForm();
    renderCurriculum();
    renderActivityGrid();
    renderManageList();
    renderActivityTypes();
  }

  function onRestoreBackup(event) {
    const file = event.target.files && event.target.files[0];
    event.target.value = '';
    if (!file) return;
    if (!window.confirm('Replace this browser’s Activity Loader data with the backup file? Current books, packs, templates, and keys in this browser will be overwritten where the file has them.')) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || ''));
        applyBackupData(parsed);
        restoreAfterBackup();
        setStatus(els['backup-status'], 'Restored backup from “' + file.name + '”. Reloading…', { toast: true, toastType: 'success' });
        window.setTimeout(() => window.location.reload(), 600);
      } catch (err) {
        setStatus(els['backup-status'], err.message || String(err), { isError: true, toast: true, toastType: 'error' });
      }
    };
    reader.onerror = () => {
      setStatus(els['backup-status'], 'Could not read that backup file.', { isError: true, toast: true, toastType: 'error' });
    };
    reader.readAsText(file);
  }

  function onSubmitActivity(event) {
    event.preventDefault();
    try {
      let id = els['act-id'].value.trim();
      if (!id) {
        id = Catalog.slugifyId(els['act-title'].value);
        els['act-id'].value = id;
      }
      Catalog.upsertActivity({
        id: id,
        title: els['act-title'].value,
        bookId: els['act-book'].value,
        type: els['act-type'].value,
        entryHtml: els['act-path'].value,
        status: els['act-status'].value,
        unitFilter: els['act-unit'].value
      });
      setStatus(els['manage-status'], 'Saved “' + els['act-title'].value + '”. Changes stay in this browser until reset.', { toast: true, toastType: 'success' });
      renderManageList();
      if (prefs.bookId === els['act-book'].value || !prefs.bookId) prefs.bookId = els['act-book'].value;
      fillBookSelect();
      renderActivityGrid();
      els['edit-mode'].value = 'edit';
      els['act-id'].readOnly = true;
      els['manage-form-title'].textContent = 'Edit activity';
    } catch (err) {
      setStatus(els['manage-status'], err.message || String(err), { isError: true, toast: true, toastType: 'error' });
    }
  }

  function bindEvents() {
    if (els['theme-toggle']) {
      els['theme-toggle'].addEventListener('click', cycleTheme);
    }
    if (els['wizard-skip-btn']) {
      els['wizard-skip-btn'].addEventListener('click', finishOnboarding);
    }
    if (els['wizard-back-btn']) {
      els['wizard-back-btn'].addEventListener('click', () => {
        if (wizardStepIndex > 0) {
          wizardStepIndex -= 1;
          renderWizardStep();
        }
      });
    }
    if (els['wizard-next-btn']) {
      els['wizard-next-btn'].addEventListener('click', () => {
        if (wizardStepIndex >= WIZARD_STEPS.length - 1) {
          finishOnboarding();
          return;
        }
        wizardStepIndex += 1;
        renderWizardStep();
      });
    }
    els['band-filter'].addEventListener('change', () => {
      fillLevelSelect();
      renderLevelChips();
      onLevelChanged();
    });
    els['level-select'].addEventListener('change', onLevelChanged);
    els['book-select'].addEventListener('change', onBookChanged);
    PANELS.forEach((panel) => {
      $('tab-' + panel).addEventListener('click', () => showPanel(panel));
    });
    if (els['import-form']) els['import-form'].addEventListener('submit', onInspectImport);
    if (els['import-ai-btn']) els['import-ai-btn'].addEventListener('click', onImportAiHelp);
    if (els['import-save-btn']) els['import-save-btn'].addEventListener('click', onSaveImportedTemplate);
    if (els['backup-export-btn']) els['backup-export-btn'].addEventListener('click', downloadBackupFile);
    if (els['backup-import-file']) els['backup-import-file'].addEventListener('change', onRestoreBackup);
    if (els['publish-breakdowns-btn']) {
      els['publish-breakdowns-btn'].addEventListener('click', () => {
        onPublishLocalBreakdowns().catch((err) => {
          setStatus(els['team-library-status'], err.message || String(err), { isError: true, toast: true, toastType: 'error' });
        });
      });
    }
    if (els['login-form']) els['login-form'].addEventListener('submit', onLoginSubmit);
    if (els['logout-btn']) els['logout-btn'].addEventListener('click', () => {
      onLogout().catch((err) => console.warn(err));
    });
    if (els['active-profile-select']) {
      els['active-profile-select'].addEventListener('change', () => {
        onActiveProfileChange().catch((err) => console.warn(err));
      });
    }
    if (els['edit-profile-btn']) {
      els['edit-profile-btn'].addEventListener('click', () => {
        showPanel('loader');
        fillActiveProfileEditCard();
        if (els['active-profile-edit-card'] && !els['active-profile-edit-card'].hidden) {
          els['active-profile-edit-card'].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    }
    if (els['active-profile-rename-form']) {
      els['active-profile-rename-form'].addEventListener('submit', async (ev) => {
        ev.preventDefault();
        const p = Auth.getActiveProfile && Auth.getActiveProfile();
        if (!p) return;
        try {
          await Auth.renameProfile(
            p.id,
            els['active-profile-name'].value.trim(),
            els['active-profile-slug'].value.trim()
          );
          updateAccountBar();
          updateLibraryBadge();
          setStatus(els['active-profile-edit-status'], 'Profile name saved.', { toast: true, toastType: 'success' });
        } catch (err) {
          setStatus(els['active-profile-edit-status'], err.message || String(err), { isError: true, toast: true, toastType: 'error' });
        }
      });
    }
    if (els['active-profile-publish-form']) {
      els['active-profile-publish-form'].addEventListener('submit', async (ev) => {
        ev.preventDefault();
        const p = Auth.getActiveProfile && Auth.getActiveProfile();
        if (!p) return;
        try {
          const breakdowns = Domain.readBreakdowns();
          const ids = Object.keys(breakdowns).filter((id) => Domain.hasBreakdown(id));
          if (!ids.length) throw new Error('Save at least one book breakdown on Curriculum first.');
          const curriculaOverlay = {};
          ids.forEach((bookId) => {
            const bd = breakdowns[bookId];
            const patch = {};
            if (bd && Array.isArray(bd.units)) {
              patch.units = bd.units.map((u) => u.title).filter(Boolean);
            }
            if (bd && bd.cefr) patch.cefr = bd.cefr;
            if (Object.keys(patch).length) curriculaOverlay[bookId] = patch;
          });
          const payload = {};
          ids.forEach((id) => { payload[id] = breakdowns[id]; });
          await Library.publishProfilePack(
            p.id,
            els['active-profile-pack-title'].value.trim(),
            { breakdowns: payload, curriculaOverlay }
          );
          els['active-profile-pack-title'].value = '';
          await reloadCloudLibrary();
          setStatus(els['active-profile-edit-status'], 'Pack published to ' + p.name + '.', { toast: true, toastType: 'success' });
        } catch (err) {
          setStatus(els['active-profile-edit-status'], err.message || String(err), { isError: true, toast: true, toastType: 'error' });
        }
      });
    }
    if (els['continue-local-btn']) {
      els['continue-local-btn'].addEventListener('click', () => {
        allowLocalWithoutLogin = true;
        setLoginGateVisible(false);
        startAppAfterLogin().catch((err) => {
          console.error(err);
          setStatus(els['login-status'], err.message || String(err), { isError: true });
        });
      });
    }
    els['activity-form'].addEventListener('submit', onSubmitActivity);
    els['reset-form-btn'].addEventListener('click', clearManageForm);
    els['reset-overlay-btn'].addEventListener('click', () => {
      if (window.confirm('Remove all activities and edits you added in this browser? Built-in catalog will return. Books and levels you added will stay.')) {
        Catalog.resetOverlay();
        clearManageForm();
        renderManageList();
        fillBookSelect();
        renderActivityGrid();
        setStatus(els['manage-status'], 'Browser catalog changes cleared.', { toast: true, toastType: 'success' });
      }
    });
    els['act-title'].addEventListener('blur', () => {
      if (els['edit-mode'].value === 'add' && !els['act-id'].value.trim() && els['act-title'].value.trim()) {
        els['act-id'].value = Catalog.slugifyId(els['act-title'].value);
      }
    });
    els['generate-form'].addEventListener('submit', onGenerate);
    if (els['gen-also-download']) els['gen-also-download'].addEventListener('change', onAlsoDownloadChanged);
    if (els['gen-change-folder-btn']) {
      els['gen-change-folder-btn'].addEventListener('click', onChangeOutputFolder);
    }
    els['gen-book'].addEventListener('change', () => {
      fillActivityChecks(els['gen-book'].value);
      syncGenerateCefr();
    });
    els['gen-mode'].addEventListener('change', toggleApiField);
    els['gen-all'].addEventListener('change', () => {
      const on = els['gen-all'].checked;
      Array.prototype.forEach.call(document.querySelectorAll('.gen-activity-check'), (el) => {
        el.checked = on;
      });
    });
    els['gen-activity-list'].addEventListener('change', () => {
      const checks = document.querySelectorAll('.gen-activity-check');
      els['gen-all'].checked = checks.length > 0 && Array.prototype.every.call(checks, (c) => c.checked);
    });
    if (els['curr-ai-provider']) {
      els['curr-ai-provider'].addEventListener('change', () => {
        const providerId = els['curr-ai-provider'].value;
        Domain.setSelectedAiProvider(providerId);
        syncAllAiControls();
      });
    }
    if (els['curr-ai-model']) {
      els['curr-ai-model'].addEventListener('change', () => {
        Domain.setSelectedModel(currentProvider('curriculum'), els['curr-ai-model'].value);
        syncAllAiControls();
      });
    }
    if (els['curr-api-key']) {
      els['curr-api-key'].addEventListener('change', () => syncApiKeys('curr-api-key'));
    }
    if (els['add-book-form']) els['add-book-form'].addEventListener('submit', onAddBook);
    if (els['add-level-form']) els['add-level-form'].addEventListener('submit', onAddLevel);
    if (els['gen-ai-provider']) {
      els['gen-ai-provider'].addEventListener('change', () => {
        const providerId = els['gen-ai-provider'].value;
        Domain.setSelectedAiProvider(providerId);
        syncAllAiControls();
      });
    }
    if (els['gen-ai-model']) {
      els['gen-ai-model'].addEventListener('change', () => {
        Domain.setSelectedModel(currentProvider('generate'), els['gen-ai-model'].value);
        syncAllAiControls();
      });
    }
    els['gen-api-key'].addEventListener('change', () => syncApiKeys('gen-api-key'));
    if (els['style-form']) els['style-form'].addEventListener('submit', onParseStyle);
    if (els['style-save-btn']) els['style-save-btn'].addEventListener('click', onSaveStyle);
    if (els['style-ai-provider']) {
      els['style-ai-provider'].addEventListener('change', () => {
        Domain.setSelectedAiProvider(els['style-ai-provider'].value);
        syncAllAiControls();
      });
    }
    if (els['style-ai-model']) {
      els['style-ai-model'].addEventListener('change', () => {
        Domain.setSelectedModel(currentProvider('style'), els['style-ai-model'].value);
        syncAllAiControls();
      });
    }
    if (els['style-api-key']) {
      els['style-api-key'].addEventListener('change', () => syncApiKeys('style-api-key'));
    }
    ['curriculum', 'generate', 'style'].forEach((source) => {
      const prefix = source === 'curriculum' ? 'curr' : (source === 'style' ? 'style' : 'gen');
      ['custom-url', 'custom-model', 'custom-header-name', 'custom-header-value'].forEach((suffix) => {
        const id = prefix + '-' + suffix;
        if (!els[id]) return;
        els[id].addEventListener('change', () => {
          persistCustomFields(source);
          syncAllAiControls();
        });
      });
    });
    els['open-generated-btn'].addEventListener('click', () => {
      if (lastGenerated && lastGenerated.html) {
        Generate.openHtml(lastGenerated.html);
        return;
      }
      const bookId = els['gen-book'].value;
      const first = selectedActivityIds()[0];
      const saved = first ? Generate.getSavedPack(bookId, first) : null;
      if (saved && saved.html) Generate.openHtml(saved.html);
      else setStatus(els['generate-status'], 'Generate once first, or open from Loader.', { isError: true, toast: true, toastType: 'error' });
    });
  }

  async function main() {
    cacheEls();
    applyTheme(readThemePref());
    await gateAuth();
    if (els['login-gate'] && !els['login-gate'].hidden && Auth && Auth.isServerAvailable() && !Auth.isLoggedIn()) {
      // Stay on login gate; still init light UI behind it once they log in / continue local.
      bindEvents();
      return;
    }
    await Catalog.init();
    await Domain.init();
    if (Auth && Auth.isLoggedIn()) {
      try { await reloadCloudLibrary(); } catch (e) { console.warn(e); }
    }
    updateAccountBar();
    updateLibraryBadge();
    try { await Generate.init(); } catch (e) {
      console.warn('Templates not fetched (file://). Built-in HTML files still open from Loader.', e);
    }
    prefs = Catalog.getPrefs();
    prefs.panel = mapLegacyPanel(prefs.panel);
    if (!prefs.levelId) prefs.levelId = 'Green';
    if (!prefs.bookId) prefs.bookId = 'write-now-1';
    fillProviderSelect('curr-ai-provider');
    fillProviderSelect('gen-ai-provider');
    fillProviderSelect('style-ai-provider');
    syncAllAiControls();
    bindEvents();
    fillNewBookLevelSelect();
    fillNewBookCefrSelect();
    renderCustomLevelList();
    fillLevelSelect();
    renderLevelChips();
    fillBookSelect();
    renderActivityGrid();
    fillImportSelects();
    renderImportPreview(null);
    fillManageBookAndTypeSelects();
    clearManageForm();
    fillGenerateForm();
    renderActivityTypes();
    renderStylePreview(null);
    showPanel(prefs.panel);
    maybeShowOnboardingWizard();
  }

  async function startAppAfterLogin() {
    await Catalog.init();
    await Domain.init();
    if (Auth && Auth.isLoggedIn()) {
      try { await reloadCloudLibrary(); } catch (e) { console.warn(e); }
    }
    updateAccountBar();
    updateLibraryBadge();
    try { await Generate.init(); } catch (e) {
      console.warn('Templates not fetched (file://). Built-in HTML files still open from Loader.', e);
    }
    prefs = Catalog.getPrefs();
    prefs.panel = mapLegacyPanel(prefs.panel);
    if (!prefs.levelId) prefs.levelId = 'Green';
    if (!prefs.bookId) prefs.bookId = 'write-now-1';
    fillProviderSelect('curr-ai-provider');
    fillProviderSelect('gen-ai-provider');
    fillProviderSelect('style-ai-provider');
    syncAllAiControls();
    fillNewBookLevelSelect();
    fillNewBookCefrSelect();
    renderCustomLevelList();
    fillLevelSelect();
    renderLevelChips();
    fillBookSelect();
    renderActivityGrid();
    fillImportSelects();
    renderImportPreview(null);
    fillManageBookAndTypeSelects();
    clearManageForm();
    fillGenerateForm();
    renderActivityTypes();
    renderStylePreview(null);
    showPanel(prefs.panel);
    maybeShowOnboardingWizard();
  }

  document.addEventListener('DOMContentLoaded', () => {
    main().catch((err) => {
      console.error(err);
      document.body.innerHTML =
        '<p style="padding:2rem;font-family:sans-serif;color:#f0b8b8;">Failed to start: ' +
        (err && err.message ? err.message : String(err)) + '</p>';
    });
  });
})();
