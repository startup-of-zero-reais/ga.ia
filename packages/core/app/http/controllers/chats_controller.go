package controllers

import (
	"github.com/goravel/framework/contracts/http"
)

type ChatsController struct {
	// Dependent services
}

func NewChatsController() *ChatsController {
	return &ChatsController{
		// Inject services
	}
}

func (r *ChatsController) Index(ctx http.Context) http.Response {
	return nil
}	
