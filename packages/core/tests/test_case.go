package tests

import (
	"github.com/goravel/framework/testing"

	"github.com/startup-of-zero-reais/ga.ia/bootstrap"
)

func init() {
	bootstrap.Boot()
}

type TestCase struct {
	testing.TestCase
}
