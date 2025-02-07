package agent

import (
	"github.com/startup-of-zero-reais/ga.ia/app/http/requests"
	"github.com/startup-of-zero-reais/ga.ia/app/models"
	"github.com/startup-of-zero-reais/ga.ia/app/services/workspace"
)

type Agent interface {
	Create(user models.User, cAgent requests.CreateAgent) (models.Agent, error)
	FindByID(user models.User, id string) (models.Agent, error)
}

type Impl struct {
	workspace.Workspace
}

var _ Agent = (*Impl)(nil)

func NewAgentService() *Impl {
	return &Impl{
		Workspace: workspace.NewWorkspaceService(),
	}
}
