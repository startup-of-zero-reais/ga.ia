package evolution

import (
	"errors"
	"slices"

	"github.com/goravel/framework/facades"
	"github.com/startup-of-zero-reais/ga.ia/app/models"
)

// FetchByToken implements EvolutionService.
func (e *EvolutionImpl) FetchByToken(usr models.User, token string) (models.HttpInstance, error) {
	var instances []models.HttpInstance
	var instance models.HttpInstance

	if token == "" {
		return instance, errors.New("token can not be empty")
	}

	resp, err := e.http.GET("/instance/fetchInstances").
		Header().Set("apikey", token).
		Send()
	if err != nil {
		return instance, err
	}

	if resp.Status().IsError() {
		errString, _ := resp.Body().AsString()
		return instance, errors.New(errString)
	}

	err = resp.Body().AsJSON(&instances)
	if err != nil {
		return instance, err
	}

	var relation models.UserInstances

	idx := slices.IndexFunc(instances, func(i models.HttpInstance) bool {
		return i.Token == token
	})
	if idx < 0 {
		return instance, errors.New("no instance with this token")
	}

	instance = instances[idx]

	err = facades.Orm().
		Query().
		Where("user_id = ?", usr.ID).
		Where("instance_id = ?", instance.ID).
		Find(&relation)
	if err != nil {
		return instance, err
	}

	if relation.UserID == "" || relation.InstanceID == "" {
		return instance, errors.New("instance was not found")
	}

	return instance, nil
}
