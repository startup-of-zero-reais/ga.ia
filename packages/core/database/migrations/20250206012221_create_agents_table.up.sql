CREATE TABLE IF NOT EXISTS agents (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id  UUID NOT NULL,
    name          VARCHAR(150) NOT NULL,
    slug          VARCHAR(150),
	description   TEXT DEFAULT NULL,
    config        JSONB,  -- pode ser TEXT, mas JSONB facilita queries

    CONSTRAINT fk_agents_workspace FOREIGN KEY (workspace_id) REFERENCES workspaces (id) ON DELETE CASCADE
) INHERITS (_timestamps);

CREATE UNIQUE INDEX idx_agent_name ON agents(name);
CREATE UNIQUE INDEX idx_agent_slug ON agents(slug);

CREATE OR REPLACE TRIGGER set_updated_at_agents
BEFORE UPDATE ON agents FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

