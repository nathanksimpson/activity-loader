/**
 * Auth client — login session against Cloudflare Worker API.
 */
(function (global) {
  'use strict';

  const LOCAL_ACTIVE_PROFILE = 'activityLoader.activeProfileId.v1';

  let currentUser = null;
  let probeDone = false;
  let serverAvailable = false;

  async function api(path, options) {
    const opts = Object.assign({ credentials: 'same-origin', cache: 'no-store' }, options || {});
    if (opts.body && typeof opts.body === 'object' && !(opts.body instanceof FormData)) {
      opts.headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
      opts.body = JSON.stringify(opts.body);
    }
    const res = await fetch(path, opts);
    let data = null;
    try {
      data = await res.json();
    } catch (e) {
      data = null;
    }
    if (!res.ok) {
      const err = new Error((data && data.error) || ('Request failed (' + res.status + ')'));
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  async function probe() {
    if (probeDone) return { available: serverAvailable };
    probeDone = true;
    serverAvailable = false;
    if (global.location && global.location.protocol === 'file:') {
      return { available: false };
    }
    try {
      const data = await api('/api/health');
      serverAvailable = !!(data && data.ok && data.auth);
    } catch (e) {
      serverAvailable = false;
    }
    return { available: serverAvailable };
  }

  function isServerAvailable() {
    return serverAvailable;
  }

  function getUser() {
    return currentUser;
  }

  function isLoggedIn() {
    return !!(currentUser && currentUser.id);
  }

  function isAdmin() {
    const u = currentUser;
    if (!u) return false;
    if (u.role === 'admin' || u.role === 'super_admin') return true;
    return !!(u.permissions && u.permissions.indexOf('access_admin_page') >= 0);
  }

  function canAccessAdminPage() {
    return isAdmin();
  }

  function getProfiles() {
    return (currentUser && Array.isArray(currentUser.profiles)) ? currentUser.profiles : [];
  }

  function getActiveProfileId() {
    if (!currentUser) return null;
    if (currentUser.activeProfileId) return currentUser.activeProfileId;
    try {
      const local = localStorage.getItem(LOCAL_ACTIVE_PROFILE);
      if (local && getProfiles().some((p) => p.id === local)) return local;
    } catch (e) { /* ignore */ }
    const profiles = getProfiles();
    return profiles.length ? profiles[0].id : null;
  }

  function getActiveProfile() {
    const id = getActiveProfileId();
    if (!id) return null;
    return getProfiles().find((p) => p.id === id) || null;
  }

  function canEditActiveProfile() {
    const p = getActiveProfile();
    if (!p) return false;
    if (p.accessLevel === 'editor') return true;
    const perms = (currentUser && currentUser.permissions) || [];
    return perms.indexOf('manage_profile_access') >= 0 || perms.indexOf('view_all_profiles') >= 0;
  }

  function rememberLocalActive(id) {
    try {
      if (id) localStorage.setItem(LOCAL_ACTIVE_PROFILE, id);
      else localStorage.removeItem(LOCAL_ACTIVE_PROFILE);
    } catch (e) { /* ignore */ }
  }

  function applyUser(user) {
    currentUser = user || null;
    if (currentUser && currentUser.activeProfileId) {
      rememberLocalActive(currentUser.activeProfileId);
    }
    return currentUser;
  }

  async function refreshMe() {
    await probe();
    if (!serverAvailable) {
      currentUser = null;
      return null;
    }
    try {
      const data = await api('/api/auth/me');
      return applyUser(data.user || null);
    } catch (e) {
      currentUser = null;
      return null;
    }
  }

  async function login(username, password) {
    await probe();
    if (!serverAvailable) throw new Error('Server login is only available on the Cloudflare site.');
    const data = await api('/api/auth/login', {
      method: 'POST',
      body: { username: username, password: password }
    });
    return applyUser(data.user || null);
  }

  async function logout() {
    try {
      await api('/api/auth/logout', { method: 'POST', body: {} });
    } catch (e) { /* ignore */ }
    currentUser = null;
  }

  async function setActiveProfile(profileId) {
    if (!isLoggedIn()) throw new Error('Please log in.');
    const data = await api('/api/me/active-profile', {
      method: 'PUT',
      body: { profileId: profileId }
    });
    if (data.user) applyUser(data.user);
    else if (currentUser) {
      currentUser.activeProfileId = data.activeProfileId || profileId;
      rememberLocalActive(currentUser.activeProfileId);
    }
    return getActiveProfile();
  }

  async function renameProfile(profileId, name, slug) {
    if (!isLoggedIn()) throw new Error('Please log in.');
    const body = { name: name };
    if (slug != null) body.slug = slug;
    const data = await api('/api/me/profiles/' + encodeURIComponent(profileId), {
      method: 'PATCH',
      body: body
    });
    await refreshMe();
    return data.profile;
  }

  const Auth = {
    api,
    probe,
    isServerAvailable,
    getUser,
    isLoggedIn,
    isAdmin,
    canAccessAdminPage,
    getProfiles,
    getActiveProfileId,
    getActiveProfile,
    canEditActiveProfile,
    setActiveProfile,
    renameProfile,
    refreshMe,
    login,
    logout
  };

  global.ActivityAuth = Auth;
})(typeof window !== 'undefined' ? window : globalThis);
