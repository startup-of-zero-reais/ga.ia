package controllers

import (
	"github.com/goravel/framework/contracts/http"
)

type PlansController struct {
	// Dependent services
}

func NewPlansController() *PlansController {
	return &PlansController{
		// Inject services
	}
}

func (r *PlansController) Index(ctx http.Context) http.Response {
	return nil
}	
