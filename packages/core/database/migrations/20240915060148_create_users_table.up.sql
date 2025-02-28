CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS _timestamps (
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) DEFAULT NULL,
    email VARCHAR(255) NOT NULL,
    email_verified_at TIMESTAMP,
    source VARCHAR(255),

    UNIQUE (id)
) INHERITS (_timestamps);

CREATE INDEX IF NOT EXISTS deletet_at_idx ON users(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_users_updated_at ON users(updated_at DESC);

CREATE OR REPLACE TRIGGER set_updated_at_users
BEFORE UPDATE ON users FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

