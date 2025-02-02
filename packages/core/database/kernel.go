package database

import (
	"github.com/goravel/framework/contracts/database/schema"
	"github.com/goravel/framework/contracts/database/seeder"
)

type Kernel struct{}

func (kernel Kernel) Migrations() []schema.Migration {
	return []schema.Migration{}
}

func (kernel Kernel) Seeders() []seeder.Seeder {
	return []seeder.Seeder{}
}
