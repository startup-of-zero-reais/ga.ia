package utils

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"errors"
	"os"
	"strings"
	"time"

	"github.com/goravel/framework/auth"
	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/facades"
	"github.com/startup-of-zero-reais/ga.ia/app/models"
)

func GrantAuth(getUserBySession func(string) (models.User, error)) http.Middleware {
	return func(ctx http.Context) {
		sessionTokenKey := facades.Config().GetString("auth.token_key")
		token := ctx.Request().Cookie(sessionTokenKey)
		if token == "" {
			token = strings.TrimPrefix(ctx.Request().Header("Authorization"), "Bearer ")
		}

		if token == "" {
			ctx.Request().AbortWithStatusJson(http.StatusUnauthorized, http.Json{
				"error": "Unauthorized",
				"code":  "EA0001",
			})
			return
		}

		decoded, err := base64.RawURLEncoding.DecodeString(token)
		if err != nil {
			facades.Log().Errorf("failed to decode base64 token: %s", decoded)
			ctx.Request().
				AbortWithStatusJson(http.StatusUnauthorized, http.Json{
					"error": "Unauthorized. Please login again",
					"code":  "EA0002",
				})

			return
		}

		var session models.Session
		err = json.Unmarshal(decoded, &session)
		if err != nil {
			ctx.Request().
				AbortWithStatusJson(http.StatusUnauthorized, http.Json{
					"error": "Unauthorized. Please login again",
					"code":  "EA0003",
				})

			return
		}
		payload, err := facades.Auth(ctx).Parse(session.AccessToken)
		if errors.Is(err, auth.ErrorTokenExpired) {
			session.AccessToken, err = facades.Auth(ctx).Refresh()
			if err != nil {
				ctx.Request().AbortWithStatusJson(
					http.StatusInternalServerError,
					http.Json{"message": "Unauthorized: " + err.Error()},
				)

				return
			}

			user, err := getUserBySession(payload.Key)
			if err != nil {
				ctx.Request().AbortWithStatusJson(
					http.StatusForbidden,
					http.Json{"message": "Unauthorized: " + err.Error()},
				)
				return
			}

			session.User = user

			cookie := models.Session{
				AccessToken: session.AccessToken,
				User:        user,
				ExpiresAt:   payload.ExpireAt.Unix(),
			}

			buf := bytes.NewBuffer(nil)
			err = json.NewEncoder(buf).Encode(cookie)
			if err != nil {
				facades.Log().Errorf("failed to generate cookie: %v", err)
				ctx.Request().AbortWithStatus(http.StatusUnauthorized)
				return
			}

			ctx.Response().Cookie(http.Cookie{
				Name:     sessionTokenKey,
				Value:    base64.RawURLEncoding.EncodeToString(buf.Bytes()),
				MaxAge:   int(time.Now().Add(time.Second * 90).Unix()),
				Secure:   os.Getenv("ENVIRONMENT") == "production",
				HttpOnly: true,
				SameSite: "Lax",
			})
		} else if err != nil {
			facades.Log().Errorf("failed to check token: %v", err)
			ctx.Request().
				AbortWithStatusJson(http.StatusUnauthorized, http.Json{
					"error": "Unauthorized. Please login again",
					"code":  "EA0004",
				})
			return
		}

		ctx.Request().Session().Put("user", session.User)
		ctx.Request().Next()
		ctx.Request().Session().Flush()
	}
}
