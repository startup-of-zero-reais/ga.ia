package requests

import (
	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/contracts/validation"
)

type CreateInstance struct {
	Name   string `form:"name" json:"name"`
	Token  string `form:"token" json:"token"`
	Number string `form:"number" json:"number"`
}

func (r *CreateInstance) Authorize(ctx http.Context) error {
	return nil
}

func (r *CreateInstance) Filters(ctx http.Context) map[string]string {
	return map[string]string{}
}

func (r *CreateInstance) Rules(ctx http.Context) map[string]string {
	return map[string]string{
		"name":  "required",
		"token": "required|min_len:36",
	}
}

func (r *CreateInstance) Messages(ctx http.Context) map[string]string {
	return map[string]string{
		"name.required":  "name should be not empty",
		"token.required": "token should be not empty",
		"token.min_len":  "token should have at least 36 bytes",
	}
}

func (r *CreateInstance) Attributes(ctx http.Context) map[string]string {
	return map[string]string{}
}

func (r *CreateInstance) PrepareForValidation(ctx http.Context, data validation.Data) error {
	return nil
}
