package routes

import (
	"github.com/goravel/framework/contracts/route"
	"github.com/goravel/framework/facades"
	"github.com/goravel/framework/session/middleware"

	"github.com/startup-of-zero-reais/ga.ia/app/http/controllers"
	"github.com/startup-of-zero-reais/ga.ia/app/http/middleware/utils"
	"github.com/startup-of-zero-reais/ga.ia/app/services/user"
)

func Api() {
	facades.Route().Prefix("/api").Middleware(middleware.StartSession()).Group(router)
}

func router(base route.Router) {
	userService := user.NewUserService()

	base.Prefix("/v1/auth").Group(signinGroup)
	base.Prefix("/v1").Middleware(utils.GrantAuth(userService.FindByID)).Group(authGroup)
	base.Group(webhookRoutes)
}

func signinGroup(router route.Router) {
	controller := controllers.NewAuthController()

	router.Get("/google", controller.RedirectToGoogle)
	router.Get("/callback", controller.HandleGoogleCallback)
	router.Middleware(utils.GrantAuth(controller.UserService.FindByID)).Any("/me", controller.Me)
}

func authGroup(router route.Router) {
	onboarding := controllers.NewOnboardingController()

	router.Post("/onboarding", onboarding.Set)
	router.Get("/onboarding", onboarding.Get)
}

func webhookRoutes(router route.Router) {
	controller := controllers.NewWebhookController()
	router.Any("/v1/webhook", controller.Receive)
}
