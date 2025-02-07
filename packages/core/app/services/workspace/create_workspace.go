package workspace

import (
	"github.com/goravel/framework/database/orm"
	"github.com/goravel/framework/facades"
	"github.com/startup-of-zero-reais/ga.ia/app/http/requests"
	"github.com/startup-of-zero-reais/ga.ia/app/models"
)

// Create implements Workspace.
func (w *Impl) Create(usr models.User, cw requests.CreateWorkspace) (models.Workspace, error) {
	var workspace models.Workspace
	workspace.Name = cw.Name
	workspace.Slug = cw.Slug
	workspace.UserID = usr.ID

	workspace.Users = []models.WorkspaceUser{
		{
			UserID: usr.ID,
			Role:   "owner",
		},
	}

	err := facades.Orm().Query().Select(orm.Associations).Create(&workspace)
	if err != nil {
		return models.Workspace{}, err
	}

	return workspace, nil
}
