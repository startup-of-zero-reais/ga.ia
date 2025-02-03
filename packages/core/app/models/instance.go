package models

import "time"

type Instance struct {
	ID        string    `gorm:"column:id;primaryKey;not null;default:uuid_generate_v4()" json:"id"`
	CreatedAt time.Time `gorm:"autoCreateTime;column:createdAt" json:"createdAt"`
	UpdatedAt time.Time `gorm:"autoUpdateTime;column:updatedAt" json:"updatedAt"`

	Name             string    `gorm:"column:name;default:null" json:"name"`
	ConnStatus       string    `gorm:"column:connectionStatus;default:closed" json:"connectionStatus"`
	OwnerJid         string    `gorm:"column:ownerJid;default:null" json:"ownerJid"`
	ProfilePicUrl    string    `gorm:"column:profilePicUrl" json:"profilePicUrl"`
	Integration      string    `gorm:"column:integration" json:"integration"`
	Number           string    `gorm:"column:number;default:null" json:"number"`
	Token            string    `gorm:"column:token;default:null" json:"token"`
	ClientName       string    `gorm:"column:clientName" json:"clientName"`
	ProfileName      string    `gorm:"column:profileName" json:"profileName"`
	BusinessID       string    `gorm:"column:businessId" json:"businessId"`
	DisconnectionAt  time.Time `gorm:"column:disconnectionAt" json:"disconnectionAt"`
	DisconnectReason []byte    `gorm:"column:disconnectionObject" json:"disconnectionObject"`
	DisconnectCode   int       `gorm:"column:disconnectionReasonCode" json:"disconnectionReasonCode"`

	Users []UserInstances `json:"users,omitempty"`
}

func (Instance) TableName() string {
	return "Instance"
}

type UserInstances struct {
	UserID     string `gorm:"column:user_id" json:"user_id"`
	InstanceID string `gorm:"column:instance_id" json:"instance_id"`

	User     *User     `json:"user,omitempty"`
	Instance *Instance `json:"instance,omitempty"`
}

func (UserInstances) TableName() string {
	return "user_instances"
}

// HTTP Instances models

type HttpInstanceEmbedded struct {
	Instance HttpInstance `json:"instance"`
}

type HttpInstance struct {
	ID            string `json:"id"`
	Name          string `json:"name"`
	ConnStatus    string `json:"connectionStatus"`
	OwnerJid      string `json:"ownerJid"`
	ProfileName   string `json:"profileName"`
	ProfilePicUrl string `json:"profilePictureUrl"`
	Number        string `json:"number"`
	Token         string `json:"token"`
}
