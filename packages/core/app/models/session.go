package models

type Session struct {
	User        User   `json:"user"`
	AccessToken string `json:"access_token"`
	ExpiresAt   int64  `json:"expires_at"`
}
