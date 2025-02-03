package controllers

import (
	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/facades"
	"github.com/opus-domini/fast-shot/constant/mime"
	"github.com/startup-of-zero-reais/ga.ia/app/helpers"
	"github.com/startup-of-zero-reais/ga.ia/app/http/requests"
	"github.com/startup-of-zero-reais/ga.ia/app/models"
	"github.com/startup-of-zero-reais/ga.ia/app/services/evolution"
)

type EvolutionController struct {
	evolution.EvolutionService
}

func NewEvolutionController() *EvolutionController {
	return &EvolutionController{
		EvolutionService: evolution.NewEvolutionService(),
	}
}

func (r *EvolutionController) Index(ctx http.Context) http.Response {
	user := ctx.Request().Session().Get("user").(models.User)

	var userInstances []models.UserInstances

	err := facades.Orm().
		Query().
		With("Instance").
		Where("user_id = ?", user.ID).
		Find(&userInstances)
	if err != nil {
		ctx.Request().AbortWithStatusJson(http.StatusNotFound, http.Json{"error": err.Error()})
		return nil
	}

	return ctx.Response().Success().Json(userInstances)
}

func (r EvolutionController) Show(ctx http.Context) http.Response {
	user := ctx.Request().Session().Get("user").(models.User)

	apikey := ctx.Request().Route("token")

	instance, err := r.FetchByToken(user, apikey)
	if err != nil {
		ctx.Request().AbortWithStatusJson(http.StatusBadRequest, http.Json{"error": err.Error()})
		return nil
	}

	return ctx.Response().Success().Json(instance)
}

func (r *EvolutionController) Store(ctx http.Context) http.Response {
	var ci requests.CreateInstance

	aborted := helpers.BindAndValidate(ctx, &ci)
	if aborted {
		return nil
	}

	user := ctx.Request().Session().Get("user").(models.User)

	instance, err := r.CreateInstance(user, ci)
	if err != nil {
		ctx.Request().AbortWithStatusJson(http.StatusInternalServerError, http.Json{
			"error": err.Error(),
		})
		return nil
	}

	return ctx.Response().Status(http.StatusCreated).Json(instance)
}

func (r *EvolutionController) Connect(ctx http.Context) http.Response {
	user := ctx.Request().Session().Get("user").(models.User)

	instanceName := ctx.Request().Query("name")
	token := ctx.Request().Route("token")

	imageData, close, err := r.GetQrCode(user, token, instanceName)
	if err != nil {
		ctx.Request().AbortWithStatusJson(http.StatusInternalServerError, http.Json{
			"error": err.Error(),
		})
		return nil
	}

	go close()

	return ctx.Response().Success().Data(string(mime.Text), imageData)
}
