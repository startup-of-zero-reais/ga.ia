package controllers

import (
	"github.com/goravel/framework/contracts/http"
	"github.com/startup-of-zero-reais/ga.ia/app/models"
	"github.com/startup-of-zero-reais/ga.ia/app/services/plans"
)

type PlansController struct {
	plans.Plans
}

func NewPlansController() *PlansController {
	return &PlansController{
		Plans: plans.NewPlansService(),
	}
}

func (r *PlansController) Index(ctx http.Context) http.Response {
	rel := ctx.Request().QueryArray("rel")

	plans, err := r.FindPlans(rel)
	if err != nil {
		ctx.Request().AbortWithStatusJson(http.StatusNotFound, http.Json{
			"error": err.Error(),
		})

		return nil
	}

	return ctx.Response().Success().Json(plans)
}

// Destroy implements http.ResourceController.
func (r *PlansController) Destroy(http.Context) http.Response {
	panic("unimplemented")
}

// Show implements http.ResourceController.
func (r *PlansController) Show(http.Context) http.Response {
	panic("unimplemented")
}

// Store implements http.ResourceController.
func (r *PlansController) Store(ctx http.Context) http.Response {
	user := ctx.Request().Session().Get("user").(models.User)

	plan, err := r.FindMyPlan(user)
	if err != nil {
		ctx.Request().AbortWithStatusJson(http.StatusNotFound, http.Json{
			"error": err.Error(),
		})

		return nil
	}

	return ctx.Response().Success().Json(plan)
}

// Update implements http.ResourceController.
func (r *PlansController) Update(http.Context) http.Response {
	panic("unimplemented")
}
