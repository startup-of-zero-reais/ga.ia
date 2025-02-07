package agent

import (
	"github.com/PumpkinSeed/errors"
	"github.com/goravel/framework/facades"
	"github.com/gosimple/slug"
	"github.com/startup-of-zero-reais/ga.ia/app/http/requests"
	"github.com/startup-of-zero-reais/ga.ia/app/http/responses"
	"github.com/startup-of-zero-reais/ga.ia/app/models"
)

// Create implements Agent.
func (a *Impl) Create(usr models.User, ca requests.CreateAgent) (models.Agent, error) {
	var agent models.Agent
	agent.Name = ca.Name
	agent.Description = ca.Description
	agent.Slug = slug.Make(ca.Name)

	err := agent.Config.Read(ca.Config)
	if err != nil {
		return agent, errors.Wrap(err, responses.ErrFailedToCreateAgent)
	}

	workspace, err := a.Workspace.FindByIDOrSlug(usr, ca.Workspace)
	if err != nil {
		return agent, errors.Wrap(err, responses.ErrWorkspaceNotFound)
	}

	agent.WorkspaceID = workspace.ID
	err = facades.Orm().Query().Create(&agent)
	if err != nil {
		return agent, errors.Wrap(err, responses.ErrFailedToCreateAgent)
	}

	return agent, nil
}
