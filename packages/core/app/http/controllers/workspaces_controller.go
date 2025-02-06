package controllers

import (
	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/facades"
	"github.com/startup-of-zero-reais/ga.ia/app/helpers"
	"github.com/startup-of-zero-reais/ga.ia/app/http/requests"
	"github.com/startup-of-zero-reais/ga.ia/app/http/responses"
	"github.com/startup-of-zero-reais/ga.ia/app/models"
	"github.com/startup-of-zero-reais/ga.ia/app/services/workspace"
)

type WorkspaceController struct {
	workspace.Workspace
}

func NewWorkspaceController() *WorkspaceController {
	return &WorkspaceController{
		Workspace: workspace.NewWorkspaceService(),
	}
}

func (r *WorkspaceController) Store(ctx http.Context) http.Response {
	var cw requests.CreateWorkspace

	if aborted := helpers.BindAndValidate(ctx, &cw); aborted {
		return nil
	}

	usr := ctx.Request().Session().Get("user").(models.User)

	workspace, err := r.Create(usr, cw)
	if err != nil {
		facades.Log().Errorf("failed to create workspace: %v", err)
		ctx.Request().AbortWithStatus(http.StatusInternalServerError)
		return nil
	}

	return ctx.Response().Status(http.StatusCreated).Json(workspace)
}

func (r *WorkspaceController) Index(ctx http.Context) http.Response {
	slug := ctx.Request().Route("slug")

	workspace, err := r.FindBySlug(slug)
	if err != nil {
		status := http.StatusUnprocessableEntity
		if err == responses.ErrWorkspaceNotFound {
			status = http.StatusNotFound
		}

		facades.Log().Errorf("failed to find workspace: %v", err)
		ctx.Request().AbortWithStatus(status)
		return nil
	}

	return ctx.Response().Success().Json(workspace)
}

func (r *WorkspaceController) Show(ctx http.Context) http.Response {
	slug := ctx.Request().Query("workspace")

	usr := ctx.Request().Session().Get("user").(models.User)
	workspace, err := r.FindByID(usr.ID, slug)
	if err != nil {
		status := http.StatusUnprocessableEntity
		if err == responses.ErrWorkspaceNotFound {
			status = http.StatusNotFound
		}

		facades.Log().Errorf("failed to find workspace: %v", err)
		ctx.Request().AbortWithStatus(status)
		return nil
	}

	return ctx.Response().Success().Json(workspace)
}
