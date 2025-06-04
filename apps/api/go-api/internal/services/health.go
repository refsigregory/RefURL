package services

import (
	"context"
	"time"
)

type HealthService struct {
	startTime time.Time
}

func NewHealthService() *HealthService {
	return &HealthService{
		startTime: time.Now(),
	}
}

type HealthStatus struct {
	Status    string    `json:"status"`
	Timestamp time.Time `json:"timestamp"`
	Uptime    string    `json:"uptime"`
}

type DetailedHealthStatus struct {
	Status    string    `json:"status"`
	Timestamp time.Time `json:"timestamp"`
	Uptime    string    `json:"uptime"`
	Version   string    `json:"version"`
	Services  struct {
		Database struct {
			Status string `json:"status"`
		} `json:"database"`
	} `json:"services"`
}

func (s *HealthService) GetStatus(ctx context.Context) (*HealthStatus, error) {
	return &HealthStatus{
		Status:    "ok",
		Timestamp: time.Now(),
		Uptime:    time.Since(s.startTime).String(),
	}, nil
}

func (s *HealthService) GetDetailedStatus(ctx context.Context) (*DetailedHealthStatus, error) {
	status := &DetailedHealthStatus{
		Status:    "ok",
		Timestamp: time.Now(),
		Uptime:    time.Since(s.startTime).String(),
		Version:   "1.0.0", // You can make this configurable
	}

	// Add database status
	status.Services.Database.Status = "ok"

	return status, nil
}
