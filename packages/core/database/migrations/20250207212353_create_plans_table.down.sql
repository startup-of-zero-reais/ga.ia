DROP TRIGGER IF EXISTS tr_assign_free_plan ON users;
DROP FUNCTION IF EXISTS add_free_plan_to_new_user;

DROP TRIGGER IF EXISTS set_updated_at_subscriptions_overrides ON subscription_features_overrides;
DROP TABLE IF EXISTS subscription_features_overrides;

DROP TRIGGER IF EXISTS set_updated_at_subscriptions ON subscriptions;
DROP TABLE IF EXISTS subscriptions;

DROP TRIGGER IF EXISTS set_updated_at_plan_features ON plan_features;
DROP TABLE IF EXISTS plan_features;

DROP TRIGGER IF EXISTS set_updated_at_plans ON plans;
DROP TABLE IF EXISTS plans;
