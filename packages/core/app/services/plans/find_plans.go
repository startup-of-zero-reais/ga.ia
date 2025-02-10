package plans

import (
	"github.com/PumpkinSeed/errors"
	"github.com/goravel/framework/facades"
	"github.com/startup-of-zero-reais/ga.ia/app/helpers"
	"github.com/startup-of-zero-reais/ga.ia/app/http/responses"
	"github.com/startup-of-zero-reais/ga.ia/app/models"
)

const (
	PlansPageSize = 10
)

// FindPlans implements Plans.
func (i *Impl) FindPlans(name string, relations []string) ([]models.Plan, error) {
	var plans []models.Plan

	query := facades.Orm().Query().Limit(PlansPageSize).OrderBy("created_at")

	if name != "" {
		query = query.Where("name = ?", name)
	}

	for _, rel := range helpers.ConvertToStructNameList(relations) {
		query = query.With(rel)
	}

	err := query.Find(&plans)
	if err != nil {
		return nil, errors.Wrap(err, responses.ErrFailedToFindPlans)
	}

	return plans, nil
}
