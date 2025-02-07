package workspace

import (
	"github.com/startup-of-zero-reais/ga.ia/app/http/requests"
	"github.com/startup-of-zero-reais/ga.ia/app/models"
)

type Workspace interface {
	Create(user models.User, cWorkspace requests.CreateWorkspace) (models.Workspace, error)
	FindByID(userID string, wID string) (models.Workspace, error)
	FindBySlug(slug string) (models.Workspace, error)
	FindByIDOrSlug(user models.User, idOrSlug string) (models.Workspace, error)
}

type Impl struct{}

var _ Workspace = (*Impl)(nil)

func NewWorkspaceService() *Impl {
	return &Impl{}
}
