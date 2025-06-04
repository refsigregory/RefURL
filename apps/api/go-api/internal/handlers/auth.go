package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/refsigregory/refurl/apps/api/go-api/internal/api"
	"github.com/refsigregory/refurl/apps/api/go-api/internal/models"
	"github.com/refsigregory/refurl/apps/api/go-api/internal/services"
	"github.com/refsigregory/refurl/apps/api/go-api/pkg/logger"
)

type AuthHandler struct {
	authService *services.AuthService
}

func NewAuthHandler(authService *services.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

// Register handles user registration
func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req models.RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		logger.Error("Failed to decode register request: %v", err)
		api.BadRequest(w, "Invalid request body")
		return
	}

	resp, err := h.authService.Register(r.Context(), &req)
	if err != nil {
		logger.Error("Register error: %v", err)
		api.Error(w, http.StatusBadRequest, err.Error())
		return
	}

	api.Success(w, resp)
}

// Login handles user login
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req models.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		logger.Error("Failed to decode login request: %v", err)
		api.BadRequest(w, "Invalid request body")
		return
	}

	resp, err := h.authService.Login(r.Context(), &req)
	if err != nil {
		logger.Error("Login error: %v", err)
		api.Error(w, http.StatusUnauthorized, err.Error())
		return
	}

	api.Success(w, resp)
}
