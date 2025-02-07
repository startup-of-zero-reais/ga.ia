package controllers

import (
	"github.com/goravel/framework/contracts/http"
	"github.com/startup-of-zero-reais/ga.ia/app/helpers"
	"github.com/startup-of-zero-reais/ga.ia/app/http/requests"
	"github.com/startup-of-zero-reais/ga.ia/app/models"
	"github.com/startup-of-zero-reais/ga.ia/app/services/agent"
)

type AgentsController struct {
	agent.Agent
}

func NewAgentsController() *AgentsController {
	return &AgentsController{
		Agent: agent.NewAgentService(),
	}
}

// Index implements http.ResourceController.
func (r *AgentsController) Index(ctx http.Context) http.Response {
	return nil
}

// Store implements http.ResourceController.
func (r *AgentsController) Store(ctx http.Context) http.Response {
	var ca requests.CreateAgent
	if helpers.BindAndValidate(ctx, &ca) {
		return nil
	}

	usr := ctx.Request().Session().Get("user").(models.User)

	agent, err := r.Create(usr, ca)
	if err != nil {
		ctx.Request().AbortWithStatus(http.StatusUnprocessableEntity)
		return nil
	}

	return ctx.Response().Status(http.StatusCreated).Json(agent)
}

// Destroy implements http.ResourceController.
func (r *AgentsController) Destroy(http.Context) http.Response {
	return nil
}

// Show implements http.ResourceController.
func (r *AgentsController) Show(ctx http.Context) http.Response {
	id := ctx.Request().Route("id")
	usr := ctx.Request().Session().Get("user").(models.User)

	agent, err := r.FindByIDOrSlug(usr, id)
	if err != nil {
		ctx.Request().AbortWithStatus(http.StatusUnprocessableEntity)
		return nil
	}

	return ctx.Response().Success().Json(agent)
}

// Update implements http.ResourceController.
// Update handles PUT and PATCH methods
func (r *AgentsController) Update(ctx http.Context) http.Response {
	return nil
}
