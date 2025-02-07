package models

type Workspace struct {
	Model

	UserID      string `gorm:"column:user_id;default:null" json:"user_id"`
	Name        string `gorm:"column:name"                 json:"name"`
	Description string `gorm:"column:description"          json:"description"`
	Slug        string `gorm:"column:slug"                 json:"slug"`

	Users []WorkspaceUser `json:"users,omitempty"`
}

func (Workspace) TableName() string {
	return "workspaces"
}

type WorkspaceUser struct {
	Model

	WorkspaceID string `gorm:"column:workspace_id;default:null" json:"workspace_id"`
	UserID      string `gorm:"column:user_id;default:null"      json:"user_id"`
	Role        string `gorm:"column:role"                      json:"role"`

	User      *User      `json:"user,omitempty"`
	Workspace *Workspace `json:"workspace,omitempty"`
}

func (WorkspaceUser) TableName() string {
	return "workspace_users"
}
