CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  event_name TEXT NOT NULL,
  event_target TEXT,
  visitor_id TEXT,
  ip_address TEXT,
  country TEXT,
  region TEXT,
  city TEXT,
  timezone TEXT,
  colo TEXT,
  asn INTEGER,
  as_organization TEXT,
  user_agent TEXT,
  referrer TEXT,
  page_url TEXT,
  page_path TEXT,
  page_title TEXT,
  link_url TEXT,
  text TEXT,
  language TEXT,
  screen_width INTEGER,
  screen_height INTEGER,
  viewport_width INTEGER,
  viewport_height INTEGER,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  extra_json TEXT
);

CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);
CREATE INDEX IF NOT EXISTS idx_events_ip_address ON events(ip_address);
CREATE INDEX IF NOT EXISTS idx_events_visitor_id ON events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_events_name_target ON events(event_name, event_target);
CREATE INDEX IF NOT EXISTS idx_events_utm_campaign ON events(utm_campaign);
