package controllers

import (
	"fmt"
	"time"

	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/facades"
	"github.com/startup-of-zero-reais/ga.ia/app/helpers"
	"github.com/startup-of-zero-reais/ga.ia/app/http/requests"
	"github.com/startup-of-zero-reais/ga.ia/app/models"
)

type RedisRestController struct{}

func NewRedisRestController() *RedisRestController {
	return &RedisRestController{}
}

func (r RedisRestController) Set(ctx http.Context) http.Response {
	var input requests.SetCache

	aborted := helpers.BindAndValidate(ctx, &input)
	if aborted {
		return nil
	}

	user := ctx.Request().Session().Get("user").(models.User)
	key := fmt.Sprintf("%s:%s", user.ID, input.Key)

	if input.TTL == 0 {
		input.TTL = 3600
	}

	err := facades.Cache().Store("redis").Put(key, input.Value, time.Second*time.Duration(input.TTL))
	if err != nil {
		ctx.Request().AbortWithStatus(http.StatusUnprocessableEntity)
		return nil
	}

	return ctx.Response().NoContent()
}

func (r RedisRestController) Get(ctx http.Context) http.Response {
	inputKey := ctx.Request().Query("key")
	if inputKey == "" {
		ctx.Request().AbortWithStatus(http.StatusBadRequest)
		return nil
	}

	user := ctx.Request().Session().Get("user").(models.User)
	key := fmt.Sprintf("%s:%s", user.ID, inputKey)
	result := facades.Cache().Store("redis").GetString(key)

	return ctx.Response().Success().Data("text/plain", []byte(result))
}
