package workspace

import (
	"github.com/goravel/framework/facades"
	"github.com/startup-of-zero-reais/ga.ia/app/http/responses"
	"github.com/startup-of-zero-reais/ga.ia/app/models"
)

// FindByID implements Workspace.
func (w *Impl) FindByID(usrID, wID string) (models.Workspace, error) {
	var workspace models.Workspace

	err := facades.Orm().Query().
		Table("workspaces").
		Join(`INNER JOIN "workspace_users" ON "workspace_users"."workspace_id" = "workspaces"."id"`).
		Where(`"workspace_users"."user_id" = ?`, usrID).
		Where(`"workspace_users"."workspace_id" = ?`, wID).
		Find(&workspace)
	if err != nil {
		return models.Workspace{}, err
	}

	if workspace.ID == "" {
		return models.Workspace{}, responses.ErrWorkspaceNotFound
	}

	return workspace, nil
}
