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

// authGroup are routes who should be authenticated to be able to request resources
func authGroup(router route.Router) {
	redis := controllers.NewRedisRestController()
	onboarding := controllers.NewOnboardingController()

	router.Post("/onboarding", onboarding.Set)
	router.Get("/onboarding", onboarding.Get)

	router.Post("/redis", redis.Set)
	router.Get("/redis", redis.Get)

	router.Prefix("/wpp").Group(evolutionGroup)
	router.Prefix("/agents").Group(agentsGroup)
	router.Prefix("/chats").Group(chatsGroup)
	router.Prefix("/datastores").Group(datastoresGroup)
	router.Prefix("/notifications").Group(notificationsGroup)
	router.Prefix("/workspaces").Group(workspacesGroup)
	router.Prefix("/billings").Group(billingsGroup)
	router.Prefix("/plans").Group(plansGroup)
}

func evolutionGroup(router route.Router) {
	controller := controllers.NewEvolutionController()

	router.Get("/instance", controller.Index)
	router.Get("/instance/{token}", controller.Show)
	router.Post("/instance", controller.Store)
	router.Get("/instance/connect/{token}", controller.Connect)
}

func webhookRoutes(router route.Router) {
	controller := controllers.NewWebhookController()
	router.Any("/v1/webhook", controller.Receive)
}

func agentsGroup(router route.Router) {
	controller := controllers.NewAgentsController()
	router.Any("/", controller.Index)
}

func chatsGroup(router route.Router) {
	controller := controllers.NewChatsController()
	router.Any("/", controller.Index)
}

func datastoresGroup(router route.Router) {
	controller := controllers.NewDatastoresController()
	router.Any("/", controller.Index)
}

func notificationsGroup(router route.Router) {
	controller := controllers.NewNotificationsController()
	router.Any("/", controller.Index)
}

func workspacesGroup(router route.Router) {
	controller := controllers.NewWorkspaceController()
	router.Post("/", controller.Store)
	router.Get("/{workspaceID}", controller.Index)
}

func billingsGroup(router route.Router) {
	controller := controllers.NewBillingsController()
	router.Any("/", controller.Index)
}

func plansGroup(router route.Router) {
	controller := controllers.NewPlansController()
	router.Any("/", controller.Index)
}
