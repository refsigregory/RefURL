package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/refsigregory/refurl/apps/api/go-api/configs"
	"github.com/refsigregory/refurl/apps/api/go-api/internal/database"
	"github.com/refsigregory/refurl/apps/api/go-api/internal/handlers"
	"github.com/refsigregory/refurl/apps/api/go-api/internal/router"
	"github.com/refsigregory/refurl/apps/api/go-api/internal/services"
)

func main() {
	// Load configuration
	config, err := configs.LoadConfig()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	if err := run(config); err != nil {
		log.Fatal(err)
	}
}

func run(config *configs.Config) error {
	// Initialize database
	db, err := database.NewDatabase(config)
	if err != nil {
		return fmt.Errorf("failed to initialize database: %v", err)
	}
	defer db.Close()

	// Initialize services
	healthService := services.NewHealthService()
	authService := services.NewAuthService(db.GetDB(), config.JWTSecret)
	urlService := services.NewURLService(db.GetDB())

	// Initialize handlers
	healthHandler := handlers.NewHealthHandler(healthService)
	authHandler := handlers.NewAuthHandler(authService)
	urlHandler := handlers.NewURLHandler(urlService)

	// Initialize router
	r := router.NewRouter(healthHandler, authHandler, urlHandler, authService)

	// Initialize your application
	fmt.Printf("Starting go-api server in %s mode...\n", config.NodeEnv)

	// Start the server
	port := ":" + config.Port
	fmt.Printf("Server listening on port %s\n", port)
	return http.ListenAndServe(port, r)
}
