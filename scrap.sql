CREATE TABLE general_reports(
    post_id  SERIAL PRIMARY KEY,
    angler_id BIGINT,
    report TEXT,
    created_at VARCHAR(100),
    updated_at VARCHAR(100)
);

CREATE TABLE rivers(
    post_id  SERIAL PRIMARY KEY,
    station_id BIGINT,
    hatches TEXT,
    flies TEXT,
    river_report TEXT,
    created_at VARCHAR(100),
    updated_at VARCHAR(100)
);