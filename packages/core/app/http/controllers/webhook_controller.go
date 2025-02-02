package controllers

import "github.com/goravel/framework/contracts/http"

type WebhookController struct{}

func NewWebhookController() *WebhookController {
	return &WebhookController{}
}

func (w WebhookController) Receive(ctx http.Context) http.Response {
	return ctx.Response().Success().Json(http.Json{})
}
