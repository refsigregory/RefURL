package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"

	"github.com/refsigregory/refurl/apps/api/go-api/internal/models"
)

type MockAuthService struct {
	mock.Mock
}

func (m *MockAuthService) Register(ctx context.Context, req *models.RegisterRequest) (*models.AuthResponse, error) {
	args := m.Called(ctx, req)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.AuthResponse), args.Error(1)
}

func (m *MockAuthService) Login(ctx context.Context, req *models.LoginRequest) (*models.AuthResponse, error) {
	args := m.Called(ctx, req)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.AuthResponse), args.Error(1)
}

func TestAuthHandler_Register(t *testing.T) {
	tests := []struct {
		name           string
		requestBody    interface{}
		mockSetup      func(*MockAuthService)
		expectedStatus int
		expectedField  string
		expectedValue  interface{}
	}{
		{
			name: "success",
			requestBody: models.RegisterRequest{
				Name:     "Test User",
				Email:    "test@example.com",
				Password: "password123",
			},
			mockSetup: func(m *MockAuthService) {
				m.On("Register", mock.Anything, mock.AnythingOfType("*models.RegisterRequest")).
					Return(&models.AuthResponse{Token: "token", User: struct {
						ID    uint   `json:"id"`
						Name  string `json:"name"`
						Email string `json:"email"`
					}{ID: 1, Name: "Test User", Email: "test@example.com"}}, nil)
			},
			expectedStatus: http.StatusOK,
			expectedField:  "status",
			expectedValue:  "success",
		},
		{
			name:           "invalid body",
			requestBody:    `{"bad":`, // invalid JSON
			mockSetup:      func(m *MockAuthService) {},
			expectedStatus: http.StatusBadRequest,
			expectedField:  "error",
			expectedValue:  "Invalid request body",
		},
		{
			name: "user exists",
			requestBody: models.RegisterRequest{
				Name:     "Test User",
				Email:    "exists@example.com",
				Password: "password123",
			},
			mockSetup: func(m *MockAuthService) {
				m.On("Register", mock.Anything, mock.AnythingOfType("*models.RegisterRequest")).
					Return(nil, errors.New("user already exists"))
			},
			expectedStatus: http.StatusBadRequest,
			expectedField:  "error",
			expectedValue:  "user already exists",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockService := new(MockAuthService)
			tt.mockSetup(mockService)
			handler := NewAuthHandler(mockService)

			var req *http.Request
			if s, ok := tt.requestBody.(string); ok {
				req = httptest.NewRequest(http.MethodPost, "/register", bytes.NewBufferString(s))
			} else {
				body, _ := json.Marshal(tt.requestBody)
				req = httptest.NewRequest(http.MethodPost, "/register", bytes.NewBuffer(body))
			}
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()

			handler.Register(w, req)

			assert.Equal(t, tt.expectedStatus, w.Code)
			var resp map[string]interface{}
			_ = json.Unmarshal(w.Body.Bytes(), &resp)
			assert.Equal(t, tt.expectedValue, resp[tt.expectedField])
			mockService.AssertExpectations(t)
		})
	}
}

func TestAuthHandler_Login(t *testing.T) {
	tests := []struct {
		name           string
		requestBody    interface{}
		mockSetup      func(*MockAuthService)
		expectedStatus int
		expectedField  string
		expectedValue  interface{}
	}{
		{
			name: "success",
			requestBody: models.LoginRequest{
				Email:    "test@example.com",
				Password: "password123",
			},
			mockSetup: func(m *MockAuthService) {
				m.On("Login", mock.Anything, mock.AnythingOfType("*models.LoginRequest")).
					Return(&models.AuthResponse{Token: "token", User: struct {
						ID    uint   `json:"id"`
						Name  string `json:"name"`
						Email string `json:"email"`
					}{ID: 1, Name: "Test User", Email: "test@example.com"}}, nil)
			},
			expectedStatus: http.StatusOK,
			expectedField:  "status",
			expectedValue:  "success",
		},
		{
			name:           "invalid body",
			requestBody:    `{"bad":`, // invalid JSON
			mockSetup:      func(m *MockAuthService) {},
			expectedStatus: http.StatusBadRequest,
			expectedField:  "error",
			expectedValue:  "Invalid request body",
		},
		{
			name: "invalid credentials",
			requestBody: models.LoginRequest{
				Email:    "wrong@example.com",
				Password: "wrongpass",
			},
			mockSetup: func(m *MockAuthService) {
				m.On("Login", mock.Anything, mock.AnythingOfType("*models.LoginRequest")).
					Return(nil, errors.New("invalid credentials"))
			},
			expectedStatus: http.StatusUnauthorized,
			expectedField:  "error",
			expectedValue:  "invalid credentials",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockService := new(MockAuthService)
			tt.mockSetup(mockService)
			handler := NewAuthHandler(mockService)

			var req *http.Request
			if s, ok := tt.requestBody.(string); ok {
				req = httptest.NewRequest(http.MethodPost, "/login", bytes.NewBufferString(s))
			} else {
				body, _ := json.Marshal(tt.requestBody)
				req = httptest.NewRequest(http.MethodPost, "/login", bytes.NewBuffer(body))
			}
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()

			handler.Login(w, req)

			assert.Equal(t, tt.expectedStatus, w.Code)
			var resp map[string]interface{}
			_ = json.Unmarshal(w.Body.Bytes(), &resp)
			assert.Equal(t, tt.expectedValue, resp[tt.expectedField])
			mockService.AssertExpectations(t)
		})
	}
}
