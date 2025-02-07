package requests

import (
	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/contracts/validation"
)

type CreateAgent struct {
	Name        string `form:"name"        json:"name"`
	Description string `form:"description" json:"description"`
	Workspace   string `form:"workspace"   json:"workspace"`
	Config      any    `form:"config"      json:"config"`
}

func (r *CreateAgent) Authorize(ctx http.Context) error {
	return nil
}

func (r *CreateAgent) Filters(ctx http.Context) map[string]string {
	return map[string]string{}
}

func (r *CreateAgent) Rules(ctx http.Context) map[string]string {
	return map[string]string{
		"name":      "string|required",
		"workspace": "string|required",
	}
}

func (r *CreateAgent) Messages(ctx http.Context) map[string]string {
	return map[string]string{
		"name.string":        "name should be a valid text.",
		"name.required":      "name is required.",
		"workspace.string":   "workspace should be valid text.",
		"workspace.required": "workspace is required. It can be an id or slug.",
	}
}

func (r *CreateAgent) Attributes(ctx http.Context) map[string]string {
	return map[string]string{}
}

func (r *CreateAgent) PrepareForValidation(ctx http.Context, data validation.Data) error {
	return nil
}
