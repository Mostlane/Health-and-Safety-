-- D1 schema for the Mostlane H&S plan job store
CREATE TABLE IF NOT EXISTS jobs (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  data       TEXT NOT NULL,      -- the job's answers, as a JSON string
  updated_at TEXT NOT NULL       -- ISO timestamp
);
CREATE INDEX IF NOT EXISTS idx_jobs_updated ON jobs(updated_at);
