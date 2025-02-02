package helpers

import "github.com/goravel/framework/contracts/http"

func BindAndValidate(ctx http.Context, input http.FormRequest) (aborted bool) {
	validationError, err := ctx.Request().ValidateRequest(input)
	if err != nil {
		aborted = true

		ctx.Request().AbortWithStatusJson(http.StatusInternalServerError, http.Json{
			"error": err.Error(),
			"code":  "EV0001",
		})
		return
	}

	if validationError != nil {
		aborted = true

		ctx.Request().AbortWithStatusJson(http.StatusBadRequest, validationError.All())
		return
	}

	return
}
