CREATE TABLE user_instances (
	user_id UUID NOT NULL DEFAULT uuid_generate_v4(),
	instance_id VARCHAR(100) NOT NULL DEFAULT uuid_generate_v4(),

	PRIMARY KEY(user_id, instance_id),
	CONSTRAINT fk_user_instances_user_id FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
	CONSTRAINT fk_user_instances_instance_id FOREIGN KEY(instance_id) REFERENCES "Instance"(id) ON DELETE CASCADE
) INHERITS (_timestamps);

CREATE OR REPLACE TRIGGER set_updated_at_user_instances
BEFORE UPDATE ON user_instances FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

