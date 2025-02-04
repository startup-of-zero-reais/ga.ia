package workspace

import (
	"fmt"

	"github.com/goravel/framework/facades"
	"github.com/startup-of-zero-reais/ga.ia/app/models"
)

// FindByID implements Workspace.
func (w *WorkspaceImpl) FindByID(usrID, wID string) (models.Workspace, error) {
	var userWorkspaces models.WorkspaceUser

	err := facades.Orm().Query().
		With("Workspace").
		Where("user_id = ?", usrID).
		Where("workspace_id = ?", wID).
		Find(&userWorkspaces)
	if err != nil {
		return models.Workspace{}, err
	}

	if userWorkspaces.Workspace == nil {
		return models.Workspace{}, fmt.Errorf("workspace not found")
	}

	// flip relation
	workspace := *userWorkspaces.Workspace
	workspace.Users = append(workspace.Users, userWorkspaces)
	workspace.Users[0].Workspace = nil

	return workspace, nil
}
