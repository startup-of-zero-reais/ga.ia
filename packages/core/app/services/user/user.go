package user

import (
	"github.com/startup-of-zero-reais/ga.ia/app/http/requests"
	"github.com/startup-of-zero-reais/ga.ia/app/models"
)

type User interface {
	Create(requests.CreateUser) (models.User, error)
	FindByID(string) (models.User, error)
}

type UserImpl struct{}

var _ User = (*UserImpl)(nil)

func NewUserService() *UserImpl {
	return &UserImpl{}
}
