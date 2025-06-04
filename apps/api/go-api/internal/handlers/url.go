package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/refsigregory/refurl/apps/api/go-api/internal/api"
	"github.com/refsigregory/refurl/apps/api/go-api/internal/models"
	"github.com/refsigregory/refurl/apps/api/go-api/internal/services"
	"github.com/refsigregory/refurl/apps/api/go-api/pkg/logger"
)

type URLHandler struct {
	urlService *services.URLService
}

func NewURLHandler(urlService *services.URLService) *URLHandler {
	return &URLHandler{
		urlService: urlService,
	}
}

// CreateURL handles URL creation
func (h *URLHandler) CreateURL(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(uint)

	var req models.CreateURLRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		logger.Error("Failed to decode request body: %v", err)
		api.BadRequest(w, "Invalid request body")
		return
	}

	url, err := h.urlService.CreateURL(r.Context(), userID, &req)
	if err != nil {
		logger.Error("Failed to create URL: %v", err)
		api.InternalError(w, "Failed to create URL")
		return
	}

	api.Success(w, url)
}

// GetURL handles getting a single URL
func (h *URLHandler) GetURL(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(uint)
	vars := mux.Vars(r)
	id, err := strconv.ParseUint(vars["id"], 10, 32)
	if err != nil {
		api.BadRequest(w, "Invalid URL ID")
		return
	}

	url, err := h.urlService.GetURLByID(r.Context(), userID, uint(id))
	if err != nil {
		if err.Error() == "url not found" {
			api.NotFound(w, "URL not found")
			return
		}
		logger.Error("Failed to get URL: %v", err)
		api.InternalError(w, "Failed to get URL")
		return
	}

	api.Success(w, url)
}

// GetUserURLs handles getting all URLs for a user
func (h *URLHandler) GetUserURLs(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(uint)

	urls, err := h.urlService.GetUserURLs(r.Context(), userID)
	if err != nil {
		logger.Error("Failed to get user URLs: %v", err)
		api.InternalError(w, "Failed to get user URLs")
		return
	}

	api.Success(w, urls)
}

// UpdateURL handles updating a URL
func (h *URLHandler) UpdateURL(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(uint)
	vars := mux.Vars(r)
	id, err := strconv.ParseUint(vars["id"], 10, 32)
	if err != nil {
		api.BadRequest(w, "Invalid URL ID")
		return
	}

	var req models.UpdateURLRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		logger.Error("Failed to decode request body: %v", err)
		api.BadRequest(w, "Invalid request body")
		return
	}

	url, err := h.urlService.UpdateURL(r.Context(), userID, uint(id), &req)
	if err != nil {
		if err.Error() == "url not found" {
			api.NotFound(w, "URL not found")
			return
		}
		logger.Error("Failed to update URL: %v", err)
		api.InternalError(w, "Failed to update URL")
		return
	}

	api.Success(w, url)
}

// DeleteURL handles deleting a URL
func (h *URLHandler) DeleteURL(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(uint)
	vars := mux.Vars(r)
	id, err := strconv.ParseUint(vars["id"], 10, 32)
	if err != nil {
		api.BadRequest(w, "Invalid URL ID")
		return
	}

	if err := h.urlService.DeleteURL(r.Context(), userID, uint(id)); err != nil {
		if err.Error() == "url not found" {
			api.NotFound(w, "URL not found")
			return
		}
		logger.Error("Failed to delete URL: %v", err)
		api.InternalError(w, "Failed to delete URL")
		return
	}

	api.Success(w, nil)
}

// RedirectToOriginal handles redirecting to the original URL
func (h *URLHandler) RedirectToOriginal(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	shortCode := vars["shortCode"]

	url, err := h.urlService.GetURLByShortCode(r.Context(), shortCode)
	if err != nil {
		if err.Error() == "url not found" {
			api.NotFound(w, "URL not found")
			return
		}
		logger.Error("Failed to get URL: %v", err)
		api.InternalError(w, "Failed to get URL")
		return
	}

	http.Redirect(w, r, url.OriginalURL, http.StatusMovedPermanently)
}
