package providers

import (
	"github.com/goravel/framework/contracts/foundation"
	"github.com/goravel/framework/contracts/validation"
	"github.com/goravel/framework/facades"
	"github.com/startup-of-zero-reais/ga.ia/app/rules"
)

type ValidationServiceProvider struct{}

func (receiver *ValidationServiceProvider) Register(app foundation.Application) {
}

func (receiver *ValidationServiceProvider) Boot(app foundation.Application) {
	if err := facades.Validation().AddRules(receiver.rules()); err != nil {
		facades.Log().Errorf("add rules error: %+v", err)
	}
	if err := facades.Validation().AddFilters(receiver.filters()); err != nil {
		facades.Log().Errorf("add filters error: %+v", err)
	}
}

func (receiver *ValidationServiceProvider) rules() []validation.Rule {
	return []validation.Rule{
		&rules.Slug{},
	}
}

func (receiver *ValidationServiceProvider) filters() []validation.Filter {
	return []validation.Filter{}
}
