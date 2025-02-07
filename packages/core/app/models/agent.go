package models

type Agent struct {
	Model

	Name        string `gorm:"column:name"                      json:"name"`
	Slug        string `gorm:"column:slug"                      json:"slug"`
	Description string `gorm:"column:description;default:null"  json:"description"`
	WorkspaceID string `gorm:"column:workspace_id;default:null" json:"workspace_id"`
	Config      JSONB  `gorm:"type:jsonb;column:config"         json:"config"`

	Workspace *Workspace `json:"workspace,omitempty"`
}

func (Agent) TableName() string {
	return "agents"
}
