package evolution

import (
	"errors"
	"time"

	"github.com/goravel/framework/facades"
	"github.com/startup-of-zero-reais/ga.ia/app/http/requests"
	"github.com/startup-of-zero-reais/ga.ia/app/models"
)

// CreateInstance implements EvolutionService.
func (e EvolutionImpl) CreateInstance(user models.User, ci requests.CreateInstance) (models.Instance, error) {
	var instance models.Instance

	payload := map[string]any{
		"instanceName": ci.Name,
		"token":        ci.Token,
		"integration":  "WHATSAPP-BAILEYS",
	}

	if instance.Number != "" {
		payload["number"] = ci.Number
	}

	resp, err := e.http.POST("/instance/create").
		Body().AsJSON(payload).
		Send()
	if err != nil {
		return instance, err
	}

	if resp.Status().IsError() {
		str, _ := resp.Body().AsString()
		return instance, errors.New(str)
	}

	type createdInstance struct {
		Instance struct {
			ID string `json:"instanceId"`
		} `json:"instance"`
	}

	var created createdInstance

	err = resp.Body().AsJSON(&created)
	if err != nil {
		return instance, err
	}

	relation := models.UserInstances{
		UserID:     user.ID,
		InstanceID: created.Instance.ID,
	}

	err = facades.Orm().Query().Create(&relation)
	if err != nil {
		// rollback
		go delayedRollback(time.Second, func(args ...any) {
			logger := facades.Log()

			instanceName := args[0].(string)

			resp, err := e.http.DELETE("/instance/delete/" + instanceName).Send()
			if err != nil {
				logger.WithTrace().Error(err)
				return
			}

			if resp.Status().IsError() {
				str, _ := resp.Body().AsString()
				logger.WithTrace().Errorf("%v: %s", err, str)
				return
			}
		}, ci.Name)

		return instance, err
	}

	instance.ID = created.Instance.ID
	err = facades.Orm().Query().Find(&instance)
	if err != nil {
		return instance, err
	}

	return instance, nil
}

func delayedRollback(delay time.Duration, rollback func(...any), args ...any) {
	time.Sleep(delay)
	rollback(args...)
}
