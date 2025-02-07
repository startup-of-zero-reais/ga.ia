package agent

import (
	"github.com/PumpkinSeed/errors"
	"github.com/google/uuid"
	"github.com/goravel/framework/facades"
	"github.com/startup-of-zero-reais/ga.ia/app/http/responses"
	"github.com/startup-of-zero-reais/ga.ia/app/models"
)

// FindByIDOrSlug implements Agent.
func (a *Impl) FindByIDOrSlug(user models.User, idOrSlug string) (models.Agent, error) {
	var agent models.Agent

	isID := uuid.Validate(idOrSlug) == nil

	query := facades.
		Orm().
		Query().
		Join(`INNER JOIN workspace_users w ON w.workspace_id = agents.workspace_id`).
		Where("w.user_id = ?", user.ID)

	if isID {
		query = query.Where("agents.id = ?", idOrSlug)
	} else {
		query = query.Where("agents.slug = ?", idOrSlug)
	}

	err := query.Find(&agent)
	if err != nil {
		return agent, errors.Wrap(err, responses.ErrAgentNotFound)
	}

	return agent, nil
}
