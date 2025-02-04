package requests

import (
	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/contracts/validation"
	"github.com/gosimple/slug"
)

type CreateWorkspace struct {
	Name string `form:"name" json:"name"`
	Slug string `form:"slug" json:"slug"`
}

func (r *CreateWorkspace) Authorize(ctx http.Context) error {
	return nil
}

func (r *CreateWorkspace) Filters(ctx http.Context) map[string]string {
	return map[string]string{}
}

func (r *CreateWorkspace) Rules(ctx http.Context) map[string]string {
	return map[string]string{
		"name": "string|required",
		"slug": "required|slug",
	}
}

func (r *CreateWorkspace) Messages(ctx http.Context) map[string]string {
	return map[string]string{
		"name.required": "you should provide a name for workspace",
		"slug.required": "you should provide a name for workspace",
		"slug.slug":     "the slug should be valid",
	}
}

func (r *CreateWorkspace) Attributes(ctx http.Context) map[string]string {
	return map[string]string{}
}

func (r *CreateWorkspace) PrepareForValidation(ctx http.Context, data validation.Data) error {
	if _, exists := data.Get("slug"); !exists {
		name, isNameSet := data.Get("name")
		if isNameSet {
			data.Set("slug", slug.Make(name.(string)))
		}
	}

	return nil
}
