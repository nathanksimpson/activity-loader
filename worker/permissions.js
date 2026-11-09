// Roles and permissions for Activity Loader accounts.

export const PERMS = {
  MANAGE_USERS: 'manage_users',
  MANAGE_GROUPS: 'manage_groups',
  MANAGE_PROFILE_ACCESS: 'manage_profile_access',
  VIEW_ALL_PROFILES: 'view_all_profiles',
  PUBLISH_PROFILE_PACKS: 'publish_profile_packs',
  ACCESS_ADMIN_PAGE: 'access_admin_page',
  USE_APP: 'use_app'
};

const ALL_PERMS = Object.values(PERMS);

export const ROLE_PRESETS = {
  super_admin: ALL_PERMS,
  admin: ALL_PERMS, // legacy alias
  user_admin: [PERMS.MANAGE_USERS, PERMS.MANAGE_GROUPS, PERMS.ACCESS_ADMIN_PAGE, PERMS.USE_APP],
  head_teacher: [
    PERMS.MANAGE_GROUPS,
    PERMS.MANAGE_PROFILE_ACCESS,
    PERMS.VIEW_ALL_PROFILES,
    PERMS.PUBLISH_PROFILE_PACKS,
    PERMS.ACCESS_ADMIN_PAGE,
    PERMS.USE_APP
  ],
  settings_admin: [PERMS.ACCESS_ADMIN_PAGE, PERMS.USE_APP],
  teacher: [PERMS.USE_APP],
  viewer: [PERMS.USE_APP]
};

export const ASSIGNABLE_ROLES = ['super_admin', 'user_admin', 'head_teacher', 'teacher', 'viewer'];

export function normalizeRole(role) {
  const r = String(role || 'teacher').trim();
  if (r === 'admin') return 'super_admin';
  return r;
}

export function permissionsForRole(role) {
  const key = normalizeRole(role);
  return (ROLE_PRESETS[key] || ROLE_PRESETS.teacher).slice();
}

export function hasPerm(user, perm) {
  if (!user) return false;
  const list = user.permissions || permissionsForRole(user.role);
  return list.indexOf(perm) >= 0;
}

export function publicUserShape(row, profiles) {
  const role = normalizeRole(row.role);
  return {
    id: row.id,
    username: row.username,
    role,
    active: row.active == null ? true : !!row.active,
    permissions: permissionsForRole(role),
    profiles: profiles || []
  };
}
