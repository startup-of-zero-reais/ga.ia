package controllers

import (
	"github.com/goravel/framework/contracts/http"
)

type WorkspaceController struct {
	// Dependent services
}

func NewWorkspaceController() *WorkspaceController {
	return &WorkspaceController{
		// Inject services
	}
}

func (r *WorkspaceController) Index(ctx http.Context) http.Response {
	return nil
}
