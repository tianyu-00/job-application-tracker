DROP TABLE IF EXISTS applications;

CREATE TABLE applications (
  id               SERIAL PRIMARY KEY,
  url              TEXT NOT NULL UNIQUE,
  title            TEXT,
  company          TEXT,
  location         TEXT,
  description      TEXT,
  salary           TEXT,
  employment_type  TEXT,
  work_type        TEXT,
  status           TEXT DEFAULT 'Applied',
  applied_at       TIMESTAMPTZ DEFAULT NOW(),
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);