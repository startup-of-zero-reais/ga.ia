package controllers

import (
	"github.com/goravel/framework/contracts/http"
)

type AgentsController struct {
	// Dependent services
}

func NewAgentsController() *AgentsController {
	return &AgentsController{
		// Inject services
	}
}

func (r *AgentsController) Index(ctx http.Context) http.Response {
	return nil
}	
