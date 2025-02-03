package evolution

import (
	"errors"
	"fmt"
	"time"

	"github.com/goravel/framework/facades"
	"github.com/startup-of-zero-reais/ga.ia/app/models"
)

// GetQrCode implements EvolutionService.
func (e *EvolutionImpl) GetQrCode(usr models.User, token, name string) ([]byte, func(), error) {
	getState := func() bool {
		resp, err := e.http.GET("/instance/connectionState/"+name).
			Header().Set("apikey", token).
			Send()
		if err != nil {
			return false
		}

		if resp.Status().IsError() {
			return false
		}

		var result map[string]map[string]string
		err = resp.Body().AsJSON(&result)
		if err != nil {
			return false
		}

		return result["instance"]["state"] == "open"
	}

	close := func() {
		ticker := time.NewTicker(300 * time.Millisecond)
		defer ticker.Stop()

		timeout := time.After(time.Second * 40)

		for {
			select {
			case <-ticker.C:
				isConnected := getState()
				if isConnected {
					return
				}
			case <-timeout:
				e.http.DELETE("/instance/logout/"+name).
					Header().Set("apikey", token).
					Send()
				return
			}
		}
	}

	var instance models.Instance
	err := facades.Orm().Query().Where("token = ?", token).Find(&instance)
	if err != nil {
		return nil, func() {}, err
	}

	if instance.ID == "" {
		return nil, func() {}, fmt.Errorf("instance not found")
	}

	var userInstance models.UserInstances
	err = facades.Orm().Query().
		Where("instance_id = ?", instance.ID).
		Where("user_id = ?", usr.ID).
		Find(&userInstance)
	if err != nil {
		return nil, func() {}, err
	}

	if userInstance.InstanceID == "" {
		return nil, func() {}, fmt.Errorf("forbidden")
	}

	resp, err := e.http.GET("/instance/connect/"+name).
		Header().Set("apikey", token).
		Send()
	if err != nil {
		return nil, close, err
	}

	if resp.Status().IsError() {
		str, _ := resp.Body().AsString()
		return nil, close, errors.New(str)
	}

	type qrCodeResult struct {
		Code string `json:"code"`
		// Base64 image/png encoded with headers
		Base64 string `json:"base64"`
	}

	var result qrCodeResult
	err = resp.Body().AsJSON(&result)
	if err != nil {
		return nil, close, err
	}

	// parts := strings.Split(result.Base64, ",")
	// encoded := parts[1]

	// image, err := base64.StdEncoding.DecodeString(encoded)
	// if err != nil {
	// 	return nil, close, err
	// }

	return []byte(result.Base64), close, nil
}
