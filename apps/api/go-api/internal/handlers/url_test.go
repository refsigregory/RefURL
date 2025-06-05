package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gorilla/mux"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"

	"github.com/refsigregory/refurl/apps/api/go-api/internal/models"
)

type MockURLService struct {
	mock.Mock
}

func (m *MockURLService) CreateURL(ctx context.Context, userID uint, req *models.CreateURLRequest) (*models.URLResponse, error) {
	args := m.Called(ctx, userID, req)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.URLResponse), args.Error(1)
}

func (m *MockURLService) GetURLByID(ctx context.Context, userID uint, urlID uint) (*models.URLResponse, error) {
	args := m.Called(ctx, userID, urlID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.URLResponse), args.Error(1)
}

func (m *MockURLService) GetUserURLs(ctx context.Context, userID uint) ([]models.URLResponse, error) {
	args := m.Called(ctx, userID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]models.URLResponse), args.Error(1)
}

func (m *MockURLService) UpdateURL(ctx context.Context, userID uint, urlID uint, req *models.UpdateURLRequest) (*models.URLResponse, error) {
	args := m.Called(ctx, userID, urlID, req)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.URLResponse), args.Error(1)
}

func (m *MockURLService) DeleteURL(ctx context.Context, userID uint, urlID uint) error {
	args := m.Called(ctx, userID, urlID)
	return args.Error(0)
}

func (m *MockURLService) GetURLByShortCode(ctx context.Context, shortCode string) (*models.URLResponse, error) {
	args := m.Called(ctx, shortCode)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.URLResponse), args.Error(1)
}

func TestURLHandler_CreateURL(t *testing.T) {
	tests := []struct {
		name           string
		requestBody    interface{}
		mockSetup      func(*MockURLService)
		expectedStatus int
		expectedField  string
		expectedValue  interface{}
	}{
		{
			name: "success",
			requestBody: models.CreateURLRequest{
				OriginalURL: "https://example.com",
				Title:       "Example",
				ShortCode:   "abc123",
			},
			mockSetup: func(m *MockURLService) {
				m.On("CreateURL", mock.Anything, uint(1), mock.AnythingOfType("*models.CreateURLRequest")).
					Return(&models.URLResponse{
						ID:          1,
						OriginalURL: "https://example.com",
						Title:       "Example",
						ShortCode:   "abc123",
						Clicks:      0,
					}, nil)
			},
			expectedStatus: http.StatusOK,
			expectedField:  "status",
			expectedValue:  "success",
		},
		{
			name:           "invalid body",
			requestBody:    `{"bad":`, // invalid JSON
			mockSetup:      func(m *MockURLService) {},
			expectedStatus: http.StatusBadRequest,
			expectedField:  "error",
			expectedValue:  "Invalid request body",
		},
		{
			name: "service error",
			requestBody: models.CreateURLRequest{
				OriginalURL: "https://example.com",
				Title:       "Example",
				ShortCode:   "abc123",
			},
			mockSetup: func(m *MockURLService) {
				m.On("CreateURL", mock.Anything, uint(1), mock.AnythingOfType("*models.CreateURLRequest")).
					Return(nil, errors.New("service error"))
			},
			expectedStatus: http.StatusInternalServerError,
			expectedField:  "error",
			expectedValue:  "Failed to create URL",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockService := new(MockURLService)
			tt.mockSetup(mockService)
			handler := NewURLHandler(mockService)

			var req *http.Request
			if s, ok := tt.requestBody.(string); ok {
				req = httptest.NewRequest(http.MethodPost, "/urls", bytes.NewBufferString(s))
			} else {
				body, _ := json.Marshal(tt.requestBody)
				req = httptest.NewRequest(http.MethodPost, "/urls", bytes.NewBuffer(body))
			}
			req = req.WithContext(context.WithValue(req.Context(), "user_id", uint(1)))
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()

			handler.CreateURL(w, req)

			assert.Equal(t, tt.expectedStatus, w.Code)
			var resp map[string]interface{}
			_ = json.Unmarshal(w.Body.Bytes(), &resp)
			assert.Equal(t, tt.expectedValue, resp[tt.expectedField])
			mockService.AssertExpectations(t)
		})
	}
}

func TestURLHandler_GetURL(t *testing.T) {
	tests := []struct {
		name           string
		urlID          string
		mockSetup      func(*MockURLService)
		expectedStatus int
		expectedField  string
		expectedValue  interface{}
	}{
		{
			name:  "success",
			urlID: "1",
			mockSetup: func(m *MockURLService) {
				m.On("GetURLByID", mock.Anything, uint(1), uint(1)).
					Return(&models.URLResponse{
						ID:          1,
						OriginalURL: "https://example.com",
						Title:       "Example",
						ShortCode:   "abc123",
						Clicks:      0,
					}, nil)
			},
			expectedStatus: http.StatusOK,
			expectedField:  "status",
			expectedValue:  "success",
		},
		{
			name:           "invalid id",
			urlID:          "invalid",
			mockSetup:      func(m *MockURLService) {},
			expectedStatus: http.StatusBadRequest,
			expectedField:  "error",
			expectedValue:  "Invalid URL ID",
		},
		{
			name:  "not found",
			urlID: "999",
			mockSetup: func(m *MockURLService) {
				m.On("GetURLByID", mock.Anything, uint(1), uint(999)).
					Return(nil, errors.New("url not found"))
			},
			expectedStatus: http.StatusNotFound,
			expectedField:  "error",
			expectedValue:  "URL not found",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockService := new(MockURLService)
			tt.mockSetup(mockService)
			handler := NewURLHandler(mockService)

			req := httptest.NewRequest(http.MethodGet, "/urls/"+tt.urlID, nil)
			req = req.WithContext(context.WithValue(req.Context(), "user_id", uint(1)))
			req = mux.SetURLVars(req, map[string]string{"id": tt.urlID})
			w := httptest.NewRecorder()

			handler.GetURL(w, req)

			assert.Equal(t, tt.expectedStatus, w.Code)
			var resp map[string]interface{}
			_ = json.Unmarshal(w.Body.Bytes(), &resp)
			assert.Equal(t, tt.expectedValue, resp[tt.expectedField])
			mockService.AssertExpectations(t)
		})
	}
}
