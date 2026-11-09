/**
 * Per-user library sync — Cloudflare Worker + D1/KV (session cookie).
 * CCMU-style profiles / groups admin helpers.
 */
(function (global) {
  'use strict';

  let serverAvailable = false;
  let writesEnabled = false;
  let probeDone = false;
  let lastLibrary = null;

  function Auth() {
    return global.ActivityAuth;
  }

  async function probe() {
    if (probeDone) {
      return { available: serverAvailable, writesEnabled: writesEnabled };
    }
    probeDone = true;
    serverAvailable = false;
    writesEnabled = false;
    const auth = Auth();
    if (!auth) return { available: false, writesEnabled: false };
    const status = await auth.probe();
    serverAvailable = !!status.available;
    if (serverAvailable) {
      await auth.refreshMe();
      writesEnabled = auth.isLoggedIn();
    }
    return { available: serverAvailable, writesEnabled: writesEnabled };
  }

  function isServerAvailable() {
    return serverAvailable;
  }

  function isWritesEnabled() {
    return !!(Auth() && Auth().isLoggedIn());
  }

  function getWriteToken() { return ''; }
  function setWriteToken() {}
  function clearWriteToken() {}

  async function loadSharedLibrary() {
    const status = await probe();
    if (!status.available) {
      return { breakdowns: {}, curriculaOverlay: {}, generatedPacks: {}, profilePacks: [], schoolPacks: [] };
    }
    const auth = Auth();
    if (!auth.isLoggedIn()) {
      return {
        breakdowns: {},
        curriculaOverlay: {},
        generatedPacks: {},
        profilePacks: [],
        schoolPacks: [],
        needsLogin: true
      };
    }
    const data = await auth.api('/api/me/library');
    lastLibrary = data;
    const packs = (data && (data.profilePacks || data.schoolPacks)) || [];
    return {
      breakdowns: (data && data.breakdowns) || {},
      curriculaOverlay: (data && data.curriculaOverlay) || {},
      breakdownMeta: (data && data.breakdownMeta) || {},
      generatedPacks: (data && data.generatedPacks) || {},
      generatedMeta: (data && data.generatedMeta) || {},
      profilePacks: packs,
      schoolPacks: packs,
      needsLogin: false
    };
  }

  function getLastLibrary() {
    return lastLibrary;
  }

  async function saveBreakdownToServer(bookId, breakdown) {
    const auth = Auth();
    if (!auth || !auth.isLoggedIn()) throw new Error('Please log in to save to your cloud library.');
    return auth.api('/api/me/breakdowns/' + encodeURIComponent(bookId), {
      method: 'PUT',
      body: breakdown
    });
  }

  async function publishAllBreakdowns(breakdowns) {
    const auth = Auth();
    if (!auth || !auth.isLoggedIn()) throw new Error('Please log in to publish.');
    const ids = Object.keys(breakdowns || {});
    let saved = 0;
    for (let i = 0; i < ids.length; i++) {
      await saveBreakdownToServer(ids[i], breakdowns[ids[i]]);
      saved += 1;
    }
    return { ok: true, saved: saved };
  }

  async function saveGeneratedToServer(bookId, activityId, payload) {
    const auth = Auth();
    if (!auth || !auth.isLoggedIn()) throw new Error('Please log in to save generated activities.');
    return auth.api(
      '/api/me/generated/' + encodeURIComponent(bookId) + '/' + encodeURIComponent(activityId),
      { method: 'PUT', body: payload }
    );
  }

  async function forkResource(resourceId, title) {
    const auth = Auth();
    if (!auth || !auth.isLoggedIn()) throw new Error('Please log in to fork.');
    return auth.api('/api/me/fork/' + encodeURIComponent(resourceId), {
      method: 'POST',
      body: title ? { title: title } : {}
    });
  }

  async function listUsers() {
    return Auth().api('/api/admin/users');
  }
  async function createUser(payload) {
    return Auth().api('/api/admin/users', { method: 'POST', body: payload });
  }
  async function updateUser(id, payload) {
    return Auth().api('/api/admin/users/' + encodeURIComponent(id), { method: 'PATCH', body: payload });
  }
  async function deleteUser(id) {
    return Auth().api('/api/admin/users/' + encodeURIComponent(id), { method: 'DELETE' });
  }

  async function listGroups() {
    return Auth().api('/api/admin/groups');
  }
  async function createGroup(name) {
    return Auth().api('/api/admin/groups', { method: 'POST', body: { name: name } });
  }
  async function deleteGroup(id) {
    return Auth().api('/api/admin/groups/' + encodeURIComponent(id), { method: 'DELETE' });
  }
  async function setGroupMembers(id, userIds) {
    return Auth().api('/api/admin/groups/' + encodeURIComponent(id) + '/members', {
      method: 'PUT',
      body: { userIds: userIds }
    });
  }

  async function listProfiles() {
    return Auth().api('/api/admin/profiles');
  }
  async function createProfile(name, slug) {
    return Auth().api('/api/admin/profiles', { method: 'POST', body: { name: name, slug: slug } });
  }
  async function deleteProfile(id) {
    return Auth().api('/api/admin/profiles/' + encodeURIComponent(id), { method: 'DELETE' });
  }
  async function getProfileAccess(id) {
    return Auth().api('/api/admin/profiles/' + encodeURIComponent(id) + '/access');
  }
  async function setProfileAccess(id, payload) {
    return Auth().api('/api/admin/profiles/' + encodeURIComponent(id) + '/access', {
      method: 'PUT',
      body: payload
    });
  }
  async function publishProfilePack(profileId, title, payload) {
    return Auth().api('/api/admin/profile-packs', {
      method: 'POST',
      body: { profileId: profileId, title: title, payload: payload }
    });
  }
  async function deleteProfilePack(id) {
    return Auth().api('/api/admin/profile-packs/' + encodeURIComponent(id), { method: 'DELETE' });
  }

  // Legacy aliases
  async function listSchools() { return listProfiles().then((d) => ({ ok: true, schools: d.profiles || [] })); }
  async function createSchool(name, slug) { return createProfile(name, slug); }
  async function deleteSchool(id) { return deleteProfile(id); }
  async function publishSchoolPack(schoolId, title, payload) {
    return publishProfilePack(schoolId, title, payload);
  }
  async function deleteSchoolPack(id) { return deleteProfilePack(id); }

  const Library = {
    probe,
    isServerAvailable,
    isWritesEnabled,
    getWriteToken,
    setWriteToken,
    clearWriteToken,
    loadSharedLibrary,
    getLastLibrary,
    saveBreakdownToServer,
    publishAllBreakdowns,
    saveGeneratedToServer,
    forkResource,
    listUsers,
    createUser,
    updateUser,
    deleteUser,
    listGroups,
    createGroup,
    deleteGroup,
    setGroupMembers,
    listProfiles,
    createProfile,
    deleteProfile,
    getProfileAccess,
    setProfileAccess,
    publishProfilePack,
    deleteProfilePack,
    listSchools,
    createSchool,
    deleteSchool,
    publishSchoolPack,
    deleteSchoolPack
  };

  global.ActivityLibrary = Library;
})(typeof window !== 'undefined' ? window : globalThis);
