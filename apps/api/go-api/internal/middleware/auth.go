package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/refsigregory/refurl/apps/api/go-api/internal/api"
	"github.com/refsigregory/refurl/apps/api/go-api/internal/services"
)

// Auth is a middleware that verifies the JWT token and sets the user ID in the context
func Auth(authService *services.AuthService) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Get the Authorization header
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				api.Error(w, http.StatusUnauthorized, "Authorization header is required")
				return
			}

			// Check if the header has the Bearer prefix
			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || parts[0] != "Bearer" {
				api.Error(w, http.StatusUnauthorized, "Invalid authorization header format")
				return
			}

			// Verify the token and get the user ID
			userID, err := authService.ValidateToken(parts[1])
			if err != nil {
				api.Error(w, http.StatusUnauthorized, "Invalid or expired token")
				return
			}

			// Set the user ID in the context
			ctx := context.WithValue(r.Context(), "user_id", userID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
