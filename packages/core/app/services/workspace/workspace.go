package workspace

import (
	"github.com/startup-of-zero-reais/ga.ia/app/http/requests"
	"github.com/startup-of-zero-reais/ga.ia/app/models"
)

type Workspace interface {
	Create(models.User, requests.CreateWorkspace) (models.Workspace, error)
	FindByID(string, string) (models.Workspace, error)
	FindBySlug(string) (models.Workspace, error)
}

type WorkspaceImpl struct{}

var _ Workspace = (*WorkspaceImpl)(nil)

func NewWorkspaceService() *WorkspaceImpl {
	return &WorkspaceImpl{}
}
