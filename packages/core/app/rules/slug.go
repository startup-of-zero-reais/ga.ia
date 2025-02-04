package rules

import (
	"regexp"

	"github.com/goravel/framework/contracts/validation"
)

type Slug struct{}

// Signature The name of the rule.
func (receiver *Slug) Signature() string {
	return "slug"
}

var slugRegex = regexp.MustCompile(`^[a-z0-9]+(?:-[a-z0-9]+)*$`)

// Passes Determine if the validation rule passes.
func (receiver *Slug) Passes(data validation.Data, val any, options ...any) bool {
	return slugRegex.MatchString(val.(string))
}

// Message Get the validation error message.
func (receiver *Slug) Message() string {
	return "The :attribute must be a valid slug"
}
