package plans

import (
	"github.com/PumpkinSeed/errors"
	"github.com/goravel/framework/facades"
	"github.com/startup-of-zero-reais/ga.ia/app/http/responses"
	"github.com/startup-of-zero-reais/ga.ia/app/models"
)

// FindMyPlan implements Plans.
func (i *Impl) FindMyPlan(user models.User) (models.Plan, error) {
	var plan models.Plan

	err := facades.
		Orm().
		Query().
		With("PlanFeatures").
		Join(`INNER JOIN subscriptions s ON s.plan_id = plans.id`).
		Join(`INNER JOIN users u ON u.id = s.user_id`).
		Where(`u.id = ?`, user.ID).
		First(&plan)
	if err != nil {
		return plan, errors.Wrap(err, responses.ErrFailedToFindMyPlan)
	}

	return plan, nil
}
