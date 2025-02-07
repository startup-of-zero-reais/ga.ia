package agent

import (
	"github.com/PumpkinSeed/errors"
	"github.com/goravel/framework/facades"
	"github.com/startup-of-zero-reais/ga.ia/app/http/responses"
	"github.com/startup-of-zero-reais/ga.ia/app/models"
)

// FindByID implements Agent.
func (a *Impl) FindByID(user models.User, id string) (models.Agent, error) {
	var agent models.Agent

	err := facades.
		Orm().
		Query().
		Join(`INNER JOIN workspace_users w ON w.workspace_id = agents.workspace_id`).
		Where("w.user_id = ?", user.ID).
		Where("agents.id = ?", id).
		Find(&agent)
	if err != nil {
		return agent, errors.Wrap(err, responses.ErrAgentNotFound)
	}

	return agent, nil
}
