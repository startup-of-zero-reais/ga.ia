package plans

import "github.com/startup-of-zero-reais/ga.ia/app/models"

type Plans interface {
	FindPlans(name string, rel []string) ([]models.Plan, error)
	FindMyPlan(user models.User) (models.Plan, error)
	FindPlanByID(planID string) (models.Plan, error)
}

type Impl struct{}

// FindPlanByID implements Plans.
func (i *Impl) FindPlanByID(planID string) (models.Plan, error) {
	panic("unimplemented")
}

var _ Plans = (*Impl)(nil)

func NewPlansService() *Impl {
	return &Impl{}
}
