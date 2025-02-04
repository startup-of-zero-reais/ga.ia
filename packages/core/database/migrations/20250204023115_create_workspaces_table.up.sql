CREATE TABLE IF NOT EXISTS workspaces (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID NOT NULL,
    name       VARCHAR(150) NOT NULL,
    slug       VARCHAR(150),

    CONSTRAINT fk_workspaces_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) INHERITS (_timestamps);

CREATE UNIQUE INDEX idx_workspaces_slug ON workspaces(slug);

CREATE OR REPLACE TRIGGER set_updated_at_workspaces
BEFORE UPDATE ON workspaces FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- breakpoint

CREATE TYPE workspace_user_role AS ENUM('owner', 'collaborator', 'viewer');

CREATE TABLE IF NOT EXISTS workspace_users (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id   UUID NOT NULL,
    user_id        UUID NOT NULL,
    role           workspace_user_role DEFAULT 'viewer',

    CONSTRAINT fk_workspace_users_workspace FOREIGN KEY (workspace_id) REFERENCES workspaces (id) ON DELETE CASCADE,
    CONSTRAINT fk_workspace_users_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) INHERITS (_timestamps);

CREATE UNIQUE INDEX IF NOT EXISTS uq_workspace_user ON workspace_users(workspace_id, user_id);

CREATE OR REPLACE TRIGGER set_updated_at_workspace_users
BEFORE UPDATE ON workspace_users FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

