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
	authHandler   *handlers.AuthHandler
	urlHandler    *handlers.URLHandler
}

func NewRouter(
	healthHandler *handlers.HealthHandler,
	authHandler *handlers.AuthHandler,
	urlHandler *handlers.URLHandler,
) *Router {
	r := &Router{
		Router:        mux.NewRouter(),
		healthHandler: healthHandler,
		authHandler:   authHandler,
		urlHandler:    urlHandler,
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

	// Auth routes
	api.HandleFunc("/auth/login", r.authHandler.Login).Methods(http.MethodPost)
	api.HandleFunc("/auth/register", r.authHandler.Register).Methods(http.MethodPost)

	// URL routes
	api.HandleFunc("/urls", r.urlHandler.CreateURL).Methods(http.MethodPost)
	api.HandleFunc("/urls/{id}", r.urlHandler.GetURL).Methods(http.MethodGet)
	api.HandleFunc("/urls", r.urlHandler.GetUserURLs).Methods(http.MethodGet)
	api.HandleFunc("/urls/{id}", r.urlHandler.UpdateURL).Methods(http.MethodPut)
	api.HandleFunc("/urls/{id}", r.urlHandler.DeleteURL).Methods(http.MethodDelete)

	// Redirect routes
	api.HandleFunc("/urls/go/{shortCode}", r.urlHandler.RedirectToOriginal).Methods(http.MethodGet)
}
