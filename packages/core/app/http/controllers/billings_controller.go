package controllers

import (
	"github.com/goravel/framework/contracts/http"
)

type BillingsController struct {
	// Dependent services
}

func NewBillingsController() *BillingsController {
	return &BillingsController{
		// Inject services
	}
}

func (r *BillingsController) Index(ctx http.Context) http.Response {
	return nil
}	
