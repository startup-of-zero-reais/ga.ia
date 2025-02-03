package evolution

import (
	"time"

	"github.com/goravel/framework/facades"
	fastshot "github.com/opus-domini/fast-shot"
	"github.com/opus-domini/fast-shot/constant/header"
	"github.com/opus-domini/fast-shot/constant/mime"
	"github.com/startup-of-zero-reais/ga.ia/app/http/requests"
	"github.com/startup-of-zero-reais/ga.ia/app/models"
)

type EvolutionService interface {
	CreateInstance(models.User, requests.CreateInstance) (models.Instance, error)
	FetchByToken(models.User, string) (models.HttpInstance, error)
	GetQrCode(models.User, string, string) ([]byte, func(), error)
}

type EvolutionImpl struct {
	http fastshot.ClientHttpMethods
}

var _ EvolutionService = (*EvolutionImpl)(nil)

func NewEvolutionService() *EvolutionImpl {
	baseURL := facades.Config().GetString("http.api.evolution")
	apikey := facades.Config().GetString("auth.evolution_api_key")

	client := fastshot.NewClient(baseURL).
		Header().Set("apikey", apikey). // currently not works as expected
		Header().Set(header.ContentType, string(mime.JSON)).
		Config().SetTimeout(time.Second * 5).
		Build()

	return &EvolutionImpl{
		http: client,
	}
}
