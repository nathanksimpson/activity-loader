-- Public share links for generated games (/s/<token>).
CREATE TABLE IF NOT EXISTS share_links (
  token       TEXT PRIMARY KEY,
  resource_id TEXT NOT NULL,
  created_by  TEXT NOT NULL,
  created_at  INTEGER NOT NULL,
  revoked_at  INTEGER
);
CREATE INDEX IF NOT EXISTS share_links_resource ON share_links(resource_id, revoked_at);
