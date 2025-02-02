package user

import (
	"github.com/goravel/framework/facades"
	"github.com/startup-of-zero-reais/ga.ia/app/http/responses"
	"github.com/startup-of-zero-reais/ga.ia/app/models"
)

func (u *UserImpl) FindByID(id string) (models.User, error) {
	var user models.User

	err := facades.Orm().Query().
		Where("id", id).
		First(&user)
	if err != nil {
		facades.Log().
			Hint("find by id database error").
			Error(err)

		return models.User{}, responses.ErrUnhandledPgError
	}

	if user.ID == "" {
		return models.User{}, responses.ErrUserNotFound
	}

	return user, nil
}
