package controllers

import (
	"fmt"
	"time"

	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/facades"
	"github.com/startup-of-zero-reais/ga.ia/app/models"
)

type OnboardingController struct{}

func NewOnboardingController() *OnboardingController {
	return &OnboardingController{}
}

func (o OnboardingController) Get(ctx http.Context) http.Response {
	user := ctx.Request().Session().Get("user").(models.User)
	onboardingStepKey := fmt.Sprintf("onboarding:%s", user.ID)
	result := facades.Cache().Store("redis").GetString(onboardingStepKey)
	return ctx.Response().Success().Data("text/plain", []byte(result))
}

func (o OnboardingController) Set(ctx http.Context) http.Response {
	user := ctx.Request().Session().Get("user").(models.User)
	onboardingStepKey := fmt.Sprintf("onboarding:%s", user.ID)
	stepPath := ctx.Request().Query("path")

	if err := facades.Cache().Store("redis").Put(onboardingStepKey, stepPath, time.Hour*24); err != nil {
		ctx.Request().AbortWithStatus(http.StatusUnprocessableEntity)
		return nil
	}

	return ctx.Response().NoContent()
}
