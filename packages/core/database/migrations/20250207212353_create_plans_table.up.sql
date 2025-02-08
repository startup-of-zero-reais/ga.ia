CREATE TABLE IF NOT EXISTS plans (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name        VARCHAR(100) NOT NULL,
	description TEXT
) INHERITS (_timestamps);

CREATE OR REPLACE TRIGGER set_updated_at_plans
BEFORE UPDATE ON plans FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- breakpoint

CREATE TABLE IF NOT EXISTS plan_features (
	id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id      UUID NOT NULL,
    feature_code VARCHAR(100) NOT NULL,
    limit_value  INT,

	CONSTRAINT fx_plan_features_plan FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE
) INHERITS (_timestamps);

CREATE UNIQUE INDEX IF NOT EXISTS uq_planid_featurecode ON plan_features (plan_id, feature_code);

CREATE OR REPLACE TRIGGER set_updated_at_plan_features
BEFORE UPDATE ON plan_features FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- breakpoint

CREATE TABLE IF NOT EXISTS subscriptions (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID,
    plan_id     UUID NOT NULL,
    start_date  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_date    TIMESTAMP WITH TIME ZONE,  -- se tiver renovação automática, etc.

    CONSTRAINT fk_subscriptions_plan FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
	CONSTRAINT fk_subscriptions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) INHERITS (_timestamps);

CREATE INDEX IF NOT EXISTS idx_subscription_active
ON subscriptions (user_id, start_date, end_date)
WHERE deleted_at IS NULL;

CREATE OR REPLACE TRIGGER set_updated_at_subscriptions
BEFORE UPDATE ON subscriptions FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- breakpoint

CREATE TABLE IF NOT EXISTS subscription_features_overrides (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id   UUID NOT NULL,
    feature_code      VARCHAR(100) NOT NULL,
    limit_value       INT,

    CONSTRAINT fk_sub_features_overrides_subscription FOREIGN KEY (subscription_id) REFERENCES subscriptions (id) ON DELETE CASCADE
) INHERITS (_timestamps);

CREATE UNIQUE INDEX IF NOT EXISTS uq_subscription_feature ON subscription_features_overrides (subscription_id, feature_code);

CREATE OR REPLACE TRIGGER set_updated_at_subscription_features_overrides
BEFORE UPDATE ON subscription_features_overrides FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- breakpoint

-- CREATE FREE PLAN

INSERT INTO plans (name, description) VALUES ( 'Gratuito', 'Plano gratuito' );
INSERT INTO plan_features (feature_code, limit_value, plan_id) VALUES ('MAX_WORKSPACES', 1, (SELECT p.id FROM plans p WHERE p.name = 'Gratuito' LIMIT 1));
INSERT INTO plan_features (feature_code, limit_value, plan_id) VALUES ('MAX_AGENTS', 2, (SELECT p.id FROM plans p WHERE p.name = 'Gratuito' LIMIT 1));
INSERT INTO plan_features (feature_code, limit_value, plan_id) VALUES ('MAX_TEAM_USERS', 2, (SELECT p.id FROM plans p WHERE p.name = 'Gratuito' LIMIT 1));

-- CREATE BASIC PLAN

INSERT INTO plans (name, description) VALUES ( 'Básico', 'Plano básico' );
INSERT INTO plan_features (feature_code, limit_value, plan_id) VALUES ('MAX_WORKSPACES', 2, (SELECT p.id FROM plans p WHERE p.name = 'Básico' LIMIT 1));
INSERT INTO plan_features (feature_code, limit_value, plan_id) VALUES ('MAX_AGENTS', 5, (SELECT p.id FROM plans p WHERE p.name = 'Básico' LIMIT 1));
INSERT INTO plan_features (feature_code, limit_value, plan_id) VALUES ('MAX_TEAM_USERS', 5, (SELECT p.id FROM plans p WHERE p.name = 'Básico' LIMIT 1));

-- CREATE PREMIUM PLAN

INSERT INTO plans (name, description) VALUES ( 'Profissional', 'Plano profissional' );
INSERT INTO plan_features (feature_code, limit_value, plan_id) VALUES ('MAX_WORKSPACES', 5, (SELECT p.id FROM plans p WHERE p.name = 'Profissional' LIMIT 1));
INSERT INTO plan_features (feature_code, limit_value, plan_id) VALUES ('MAX_AGENTS', 10, (SELECT p.id FROM plans p WHERE p.name = 'Profissional' LIMIT 1));
INSERT INTO plan_features (feature_code, limit_value, plan_id) VALUES ('MAX_TEAM_USERS', 10, (SELECT p.id FROM plans p WHERE p.name = 'Profissional' LIMIT 1));

-- breakpoint

CREATE OR REPLACE FUNCTION add_free_plan_to_new_user()
RETURNS TRIGGER AS $$
DECLARE
	free_plan_id uuid;
BEGIN
	-- Get the free plan id
	SELECT id INTO free_plan_id
	FROM plans
	WHERE name = 'Gratuito'
	LIMIT 1;

	IF free_plan_id IS NOT NULL THEN
		INSERT INTO subscriptions (user_id, plan_id) VALUES (NEW.id, free_plan_id);
	END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_assign_free_plan
AFTER INSERT ON users FOR EACH ROW
EXECUTE PROCEDURE add_free_plan_to_new_user();

INSERT INTO subscriptions (user_id, plan_id)
	SELECT u.id, p.id FROM users u CROSS JOIN plans p
	WHERE p.name = 'Gratuito'
	AND NOT EXISTS (
		SELECT 1 FROM subscriptions s WHERE s.user_id = u.id
);

