package controllers

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/google/uuid"
	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/facades"
	"github.com/startup-of-zero-reais/ga.ia/app/http/requests"
	"github.com/startup-of-zero-reais/ga.ia/app/http/responses"
	"github.com/startup-of-zero-reais/ga.ia/app/models"
	"github.com/startup-of-zero-reais/ga.ia/app/services/user"
	"golang.org/x/oauth2"
)

type AuthController struct {
	UserService user.User
}

func NewAuthController() *AuthController {
	return &AuthController{
		user.NewUserService(),
	}
}

func (a AuthController) Me(ctx http.Context) http.Response {
	usr := ctx.Request().Session().Get("user")

	return ctx.Response().Success().Json(usr)
}

func (a AuthController) Profile(ctx http.Context) http.Response {
	usr := ctx.Request().Session().Get("user").(models.User)

	user, err := a.UserService.FindByID(usr.ID)
	if err != nil {
		ctx.Request().AbortWithStatusJson(http.StatusForbidden, http.Json{"error": err.Error()})

		return nil
	}

	return ctx.Response().Success().Json(user)
}

func (a AuthController) Logout(ctx http.Context) http.Response {
	_ = facades.Auth(ctx).Logout()
	s := facades.Config().Get("auth.token_key").(string)

	return ctx.Response().Cookie(http.Cookie{
		Name:   s,
		MaxAge: int(time.Now().Add(time.Hour * -24).Unix()),
	}).Redirect(http.StatusTemporaryRedirect, "/app/acessar")
}

func (a AuthController) RedirectToGoogle(ctx http.Context) http.Response {
	oauthConfig, _ := facades.App().Make("google_provider")
	callback := ctx.Request().Query("redir_to")

	state := base64.URLEncoding.EncodeToString([]byte(uuid.NewString()))
	ctx.Request().Session().Flash("oauth_state", state)
	ctx.Request().Session().Flash("callback", callback)

	cfg := oauthConfig.(*oauth2.Config)
	url := cfg.AuthCodeURL(state, oauth2.AccessTypeOffline)
	return ctx.Response().Redirect(http.StatusTemporaryRedirect, url)
}

func (a AuthController) HandleGoogleCallback(ctx http.Context) http.Response {
	state := ctx.Request().Query("state")
	sessionState, ok := ctx.Request().Session().Pull("oauth_state").(string)
	if !ok {
		ctx.Request().AbortWithStatusJson(http.StatusForbidden, http.Json{"error": "Forbidden: can not get state"})
		return nil
	}

	callback, ok := ctx.Request().Session().Pull("callback").(string)
	if !ok {
		ctx.Request().AbortWithStatusJson(http.StatusForbidden, http.Json{"error": "Forbidden: can not get callback"})
		return nil
	}

	if state != sessionState {
		ctx.Request().AbortWithStatus(http.StatusForbidden)
		return nil
	}

	code := ctx.Request().Query("code")

	oauthConfig, _ := facades.App().Make("google_provider")
	cfg := oauthConfig.(*oauth2.Config)

	token, err := cfg.Exchange(ctx.Context(), code)
	if err != nil {
		ctx.Request().AbortWithStatus(http.StatusBadRequest)
		return nil
	}

	client := cfg.Client(ctx.Context(), token)
	response, err := client.Get("https://www.googleapis.com/oauth2/v3/userinfo")
	if err != nil {
		ctx.Request().AbortWithStatus(http.StatusInternalServerError)
		return nil
	}

	defer response.Body.Close()

	buf := bytes.NewBuffer(nil)
	buf.ReadFrom(response.Body)

	var result map[string]any
	err = json.NewDecoder(buf).Decode(&result)
	if err != nil {
		facades.Log().Errorf("failed to parse response payload: %v", err)
		ctx.Request().AbortWithStatus(http.StatusInternalServerError)
		return nil
	}

	usr := getUserFromSession(result)
	user, err := a.UserService.FindByID(usr.ID)
	if errors.Is(err, responses.ErrUserNotFound) {
		user, err = a.UserService.Create(usr)
	}

	if err != nil {
		facades.Log().Errorf("failed to get user and to create: %v", err)
		ctx.Request().AbortWithStatus(http.StatusInternalServerError)
		return nil
	}

	jwt, err := facades.Auth(ctx).LoginUsingID(user.ID)
	if err != nil {
		facades.Log().Errorf("failed to auth user: %v", err)
		ctx.Request().AbortWithStatus(http.StatusUnauthorized)
		return nil
	}

	payload, _ := facades.Auth(ctx).Parse(jwt)

	cookie := models.Session{
		AccessToken: jwt,
		User:        user,
		ExpiresAt:   payload.ExpireAt.Unix(),
	}

	buf.Reset()
	err = json.NewEncoder(buf).Encode(cookie)
	if err != nil {
		facades.Log().Errorf("failed to generate cookie: %v", err)
		ctx.Request().AbortWithStatus(http.StatusUnauthorized)
		return nil
	}

	if callback == "" {
		callback = "/app/onboarding"
	}

	callback = fmt.Sprintf("%s%s",
		facades.Config().Env("APP_DOMAIN", "http://localhost:3000"),
		callback,
	)

	sessionTokenKey := facades.Config().GetString("auth.token_key")

	return ctx.
		Response().
		Cookie(http.Cookie{
			Name:     sessionTokenKey,
			Value:    base64.RawURLEncoding.EncodeToString(buf.Bytes()),
			MaxAge:   int(time.Now().Add(time.Second * 90).Unix()),
			Secure:   os.Getenv("ENVIRONMENT") == "production",
			HttpOnly: true,
			SameSite: "Lax",
		}).
		Redirect(http.StatusTemporaryRedirect, callback)
}

func getUserFromSession(session map[string]any) requests.CreateUser {
	sub := []byte(session["sub"].(string))
	signID := uuid.NewSHA1(uuid.NameSpaceOID, sub)

	usr := requests.CreateUser{
		ID:     signID.String(),
		Name:   session["name"].(string),
		Email:  session["email"].(string),
		Avatar: session["picture"].(string),
		Source: "google_provider",
	}

	isVerified := session["email_verified"].(bool)

	if isVerified {
		usr.EmailVerifiedAt = time.Now().Format(time.RFC3339)
	}

	return usr
}
