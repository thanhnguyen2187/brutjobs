CREATE TABLE jobs
(
    id TEXT PRIMARY KEY,
    title TEXT,
    company TEXT,
    location_type TEXT,
    location_country TEXT,
    level TEXT,
    domains TEXT,
    date_posted_timestamp_ms INTEGER,
    date_updated_timestamp_ms INTEGER
);

