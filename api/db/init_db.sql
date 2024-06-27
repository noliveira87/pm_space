-- init_db.sql

CREATE TABLE IF NOT EXISTS team_members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100),
    vacation_days INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE,
    original_estimate INTEGER,
    remaining_work INTEGER
);

CREATE TABLE IF NOT EXISTS allocations (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id),
    member_id INTEGER REFERENCES team_members(id),
    allocated_hours INTEGER
);
