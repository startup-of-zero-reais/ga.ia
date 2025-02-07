package models

import (
	"database/sql/driver"
	"encoding/json"
	"time"

	"github.com/PumpkinSeed/errors"
	"github.com/startup-of-zero-reais/ga.ia/app/http/responses"
	"gorm.io/gorm"
)

type Timestamps struct {
	CreatedAt time.Time `gorm:"autoCreateTime;column:created_at" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime;column:updated_at" json:"updated_at"`
}

type SoftDelete struct {
	DeletedAt gorm.DeletedAt `gorm:"column:deleted_at" json:"deleted_at"`
}

type Model struct {
	Timestamps
	SoftDelete

	ID string `gorm:"column:id;primaryKey;not null;default:uuid_generate_v4()" json:"id"`
}

type JSONB map[string]string

func (j *JSONB) Value() (driver.Value, error) {
	value, err := json.Marshal(j)
	if err != nil {
		return nil, errors.Wrap(err, responses.ErrFailedToMarshalJSONB)
	}

	return value, nil
}

func (j *JSONB) Scan(value any) error {
	if value == nil {
		return nil
	}

	b, ok := value.([]byte)
	if !ok {
		return responses.ErrFailedToScanJSONB
	}

	err := json.Unmarshal(b, j)
	if err != nil {
		return errors.Wrap(err, responses.ErrFailedToScanJSONB)
	}

	return nil
}

func (j *JSONB) Read(v any) error {
	if v == nil {
		return nil
	}

	bytes, err := json.Marshal(v)
	if err != nil {
		return errors.Wrap(err, responses.ErrFailedToReadJSONB)
	}

	err = json.Unmarshal(bytes, &j)
	if err != nil {
		return errors.Wrap(err, responses.ErrFailedToReadJSONB)
	}

	return nil
}
