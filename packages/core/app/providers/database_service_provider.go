package providers

import (
	"github.com/goravel/framework/contracts/foundation"
	"github.com/goravel/framework/facades"

	"github.com/startup-of-zero-reais/ga.ia/database"
)

type DatabaseServiceProvider struct{}

func (receiver *DatabaseServiceProvider) Register(app foundation.Application) {
}

func (receiver *DatabaseServiceProvider) Boot(app foundation.Application) {
	kernel := database.Kernel{}
	facades.Schema().Register(kernel.Migrations())
	facades.Seeder().Register(kernel.Seeders())
}
