package router

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/refsigregory/refurl/apps/api/go-api/internal/handlers"
	"github.com/refsigregory/refurl/apps/api/go-api/internal/middleware"
)

type Router struct {
	*mux.Router
	healthHandler *handlers.HealthHandler
}

func NewRouter(healthHandler *handlers.HealthHandler) *Router {
	r := &Router{
		Router:        mux.NewRouter(),
		healthHandler: healthHandler,
	}

	r.setupRoutes()
	return r
}

func (r *Router) setupRoutes() {
	// API routes
	api := r.PathPrefix("/api").Subrouter()

	// Add middleware
	api.Use(middleware.Logger)
	api.Use(middleware.Recover)
	api.Use(middleware.CORS)

	// Health check routes
	api.HandleFunc("/health", r.healthHandler.GetStatus).Methods(http.MethodGet)
	api.HandleFunc("/health/detailed", r.healthHandler.GetDetailedStatus).Methods(http.MethodGet)
}
