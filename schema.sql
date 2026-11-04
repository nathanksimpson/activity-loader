-- Activity Loader service database (Cloudflare D1).
-- Keep in step with migrations/. A new table or column goes in BOTH places.

CREATE TABLE IF NOT EXISTS users (
  id          TEXT PRIMARY KEY,
  email       TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL DEFAULT '',
  picture     TEXT NOT NULL DEFAULT '',
  created_at  INTEGER NOT NULL,
  last_seen   INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash  TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  INTEGER NOT NULL,
  expires_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_user ON sessions(user_id);

-- A workspace holds books, breakdowns, styles and games.
-- kind: 'solo' (one teacher, made at first sign-in) or 'team' (an academy).
-- ai_mode: 'included' (site key, monthly cap) or 'byok' (members paste their own key).
CREATE TABLE IF NOT EXISTS workspaces (
  id               TEXT PRIMARY KEY,
  name             TEXT NOT NULL,
  kind             TEXT NOT NULL CHECK (kind IN ('solo', 'team')),
  owner_id         TEXT NOT NULL REFERENCES users(id),
  ai_mode          TEXT NOT NULL DEFAULT 'included' CHECK (ai_mode IN ('included', 'byok')),
  ai_monthly_limit INTEGER,            -- NULL = use the site default (AI_MONTHLY_LIMIT)
  created_at       INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS members (
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role         TEXT NOT NULL CHECK (role IN ('owner', 'member')),
  joined_at    INTEGER NOT NULL,
  PRIMARY KEY (workspace_id, user_id)
);
CREATE INDEX IF NOT EXISTS members_user ON members(user_id);

CREATE TABLE IF NOT EXISTS invites (
  token        TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  created_by   TEXT NOT NULL REFERENCES users(id),
  created_at   INTEGER NOT NULL,
  expires_at   INTEGER NOT NULL,
  used_by      TEXT,
  used_at      INTEGER
);

-- The app's saved data, one row per top-level entry of each saved item
-- (for example one row per book in breakdowns, one per game in generatedPacks).
-- value NULL = deleted (kept so other devices learn about the delete).
CREATE TABLE IF NOT EXISTS workspace_data (
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  key          TEXT NOT NULL,
  item         TEXT NOT NULL,
  value        TEXT,
  version      INTEGER NOT NULL,
  updated_by   TEXT,
  updated_at   INTEGER NOT NULL,
  PRIMARY KEY (workspace_id, key, item)
);
CREATE INDEX IF NOT EXISTS workspace_data_updated ON workspace_data(workspace_id, updated_at);

CREATE TABLE IF NOT EXISTS ai_usage (
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  month        TEXT NOT NULL,          -- 'YYYY-MM' in Korea time
  calls        INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (workspace_id, month)
);
