package workspace

import (
	"github.com/PumpkinSeed/errors"
	"github.com/google/uuid"
	"github.com/goravel/framework/facades"
	"github.com/startup-of-zero-reais/ga.ia/app/http/responses"
	"github.com/startup-of-zero-reais/ga.ia/app/models"
)

func (w *Impl) FindByIDOrSlug(user models.User, idOrSlug string) (models.Workspace, error) {
	var workspace models.Workspace

	isID := uuid.Validate(idOrSlug) == nil

	query := facades.
		Orm().
		Query().
		Join(`INNER JOIN workspace_users w ON w.workspace_id = workspaces.id`).
		Where(`w.user_id = ?`, user.ID)

	if isID {
		query = query.Where(`workspaces.id = ?`, idOrSlug)
	} else {
		query = query.Where(`workspaces.slug = ?`, idOrSlug)
	}

	err := query.First(&workspace)
	if err != nil {
		return models.Workspace{}, errors.Wrap(err, responses.ErrWorkspaceNotFound)
	}

	if workspace.ID == "" {
		return workspace, responses.ErrWorkspaceNotFound
	}

	return workspace, nil
}
