-- Reconstructed 2026-11 from the live database (already applied there on 2026-09-16).
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL,
  created_by_user_id TEXT
);

CREATE TABLE IF NOT EXISTS profile_members (
  profile_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  access_level TEXT NOT NULL DEFAULT 'viewer' CHECK (access_level IN ('viewer', 'editor')),
  granted_at INTEGER NOT NULL,
  granted_by_user_id TEXT,
  PRIMARY KEY (profile_id, user_id)
);

CREATE TABLE IF NOT EXISTS teacher_groups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  created_by_user_id TEXT
);

CREATE TABLE IF NOT EXISTS group_members (
  group_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  PRIMARY KEY (group_id, user_id)
);

CREATE TABLE IF NOT EXISTS profile_groups (
  profile_id TEXT NOT NULL,
  group_id TEXT NOT NULL,
  access_level TEXT NOT NULL DEFAULT 'viewer' CHECK (access_level IN ('viewer', 'editor')),
  granted_at INTEGER NOT NULL,
  granted_by_user_id TEXT,
  PRIMARY KEY (profile_id, group_id)
);
