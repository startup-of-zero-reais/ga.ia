package workspace

import (
	"github.com/goravel/framework/facades"
	"github.com/startup-of-zero-reais/ga.ia/app/http/responses"
	"github.com/startup-of-zero-reais/ga.ia/app/models"
)

// FindBySlug implements Workspace.
func (w *Impl) FindBySlug(slug string) (models.Workspace, error) {
	var workspace models.Workspace

	err := facades.Orm().Query().
		Where("slug = ?", slug).
		Find(&workspace)
	if err != nil {
		return models.Workspace{}, err
	}

	if workspace.ID == "" {
		return models.Workspace{}, responses.ErrWorkspaceNotFound
	}

	return workspace, nil
}
