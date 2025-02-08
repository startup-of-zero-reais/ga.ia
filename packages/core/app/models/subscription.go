package models

import (
	"time"
)

type FeatureCode string

type Plan struct {
	Model

	Name        string `gorm:"column:name;default:null"        json:"name"`
	Description string `gorm:"column:description;default:null" json:"description"`

	PlanFeatures []PlanFeatures `json:"plan_features,omitempty"`
}

func (Plan) TableName() string {
	return "plans"
}

type PlanFeatures struct {
	Model

	PlanID      string      `gorm:"column:plan_id"      json:"plan_id"`
	FeatureCode FeatureCode `gorm:"column:feature_code" json:"feature_code"`
	Limit       int         `gorm:"column:limit_value"  json:"limit"`

	Plan *Plan `json:"plan,omitempty"`
}

func (PlanFeatures) TableName() string {
	return "plan_features"
}

type Subscription struct {
	Model

	UserID    string     `gorm:"column:user_id" json:"user_id"`
	PlanID    string     `gorm:"plan_id"        json:"plan_id"`
	StartDate time.Time  `gorm:"start_date"     json:"start_date"`
	EndDate   *time.Time `gorm:"end_date"       json:"end_date"`

	Plan      *Plan            `json:"plan,omitempty"`
	User      *User            `json:"user,omitempty"`
	Overrides *FeatureOverride `json:"overrides,omitempty"`
}

func (Subscription) TableName() string {
	return "subscriptions"
}

type FeatureOverride struct {
	Model

	SubscriptionID string      `gorm:"column:subscription_id" json:"subscription_id"`
	FeatureCode    FeatureCode `gorm:"column:feature_code"    json:"feature_code"`
	Limit          int         `gorm:"column:limit_value"     json:"limit"`

	Subscription *Subscription `json:"subscription,omitempty"`
}

func (FeatureOverride) TableName() string {
	return "subscription_features_overrides"
}
