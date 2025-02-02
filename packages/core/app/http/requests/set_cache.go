package requests

import (
	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/contracts/validation"
)

type SetCache struct {
	Key   string `form:"key" json:"key"`
	Value string `form:"value" json:"value"`
	TTL   uint   `form:"ttl" json:"ttl"`
}

func (r *SetCache) Authorize(ctx http.Context) error { return nil }

func (r *SetCache) Rules(ctx http.Context) map[string]string {
	return map[string]string{
		"key":   "required",
		"value": "required",
		"ttl":   "uint",
	}
}

func (r *SetCache) Messages(ctx http.Context) map[string]string {
	return map[string]string{
		"key.required":   "key should have a valid string",
		"value.required": "value should have a valid string",
	}
}

func (r *SetCache) Attributes(ctx http.Context) map[string]string {
	return map[string]string{}
}

func (r *SetCache) PrepareForValidation(ctx http.Context, data validation.Data) error {
	return nil
}
