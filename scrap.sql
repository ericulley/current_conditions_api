CREATE TABLE general_reports(
    id  SERIAL PRIMARY KEY,
    angler_id BIGINT,
    report TEXT,
    created_at VARCHAR(100),
    updated_at VARCHAR(100)
);

CREATE TABLE rivers(
    id  SERIAL PRIMARY KEY,
    river_name VARCHAR(32),
    station_id BIGINT,
    hatches VARCHAR(140),
    flies VARCHAR(140),
    river_report TEXT,
    created_at VARCHAR(100),
    updated_at VARCHAR(100)
);

CREATE TABLE lakes(
    id  SERIAL PRIMARY KEY,
    lake_name VARCHAR(32),
    station_id BIGINT,
    hatches VARCHAR(140),
    flies VARCHAR(140),
    lake_report TEXT,
    created_at VARCHAR(100),
    updated_at VARCHAR(100)
);

-- Haven't updated the tables/river & lake name length yet