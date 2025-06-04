package handlers

import (
	"net/http"

	"github.com/refsigregory/refurl/apps/api/go-api/internal/api"
	"github.com/refsigregory/refurl/apps/api/go-api/internal/services"
	"github.com/refsigregory/refurl/apps/api/go-api/pkg/logger"
)

type HealthHandler struct {
	healthService *services.HealthService
}

func NewHealthHandler(healthService *services.HealthService) *HealthHandler {
	return &HealthHandler{
		healthService: healthService,
	}
}

// GetStatus handles the basic health check endpoint
func (h *HealthHandler) GetStatus(w http.ResponseWriter, r *http.Request) {
	logger.Info("Health check requested - method: %s, path: %s, remote_addr: %s",
		r.Method, r.URL.Path, r.RemoteAddr)

	status, err := h.healthService.GetStatus(r.Context())
	if err != nil {
		logger.Error("Failed to get health status: %v", err)
		api.InternalError(w, "Failed to get health status")
		return
	}

	logger.Info("Health status: %+v", status)
	api.Success(w, status)
}

// GetDetailedStatus handles the detailed health check endpoint
func (h *HealthHandler) GetDetailedStatus(w http.ResponseWriter, r *http.Request) {
	logger.Info("Detailed health check requested - method: %s, path: %s, remote_addr: %s",
		r.Method, r.URL.Path, r.RemoteAddr)

	status, err := h.healthService.GetDetailedStatus(r.Context())
	if err != nil {
		logger.Error("Failed to get detailed health status: %v", err)
		api.InternalError(w, "Failed to get detailed health status")
		return
	}

	logger.Info("Detailed health status: %+v", status)
	api.Success(w, status)
}
