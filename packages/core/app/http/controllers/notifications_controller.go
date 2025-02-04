package controllers

import (
	"github.com/goravel/framework/contracts/http"
)

type NotificationsController struct {
	// Dependent services
}

func NewNotificationsController() *NotificationsController {
	return &NotificationsController{
		// Inject services
	}
}

func (r *NotificationsController) Index(ctx http.Context) http.Response {
	return nil
}	
