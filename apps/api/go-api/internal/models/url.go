package models

import (
	"time"
)

type URL struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	OriginalURL string    `json:"original_url" gorm:"not null"`
	ShortCode   string    `json:"short_code" gorm:"uniqueIndex"`
	Title       string    `json:"title"`
	UserID      uint      `json:"user_id"`
	User        User      `json:"user" gorm:"foreignKey:UserID"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type CreateURLRequest struct {
	OriginalURL string `json:"original_url" validate:"required,url"`
	Title       string `json:"title"`
	ShortCode   string `json:"short_code"`
}

type UpdateURLRequest struct {
	OriginalURL string `json:"original_url" validate:"required,url"`
	Title       string `json:"title"`
	ShortCode   string `json:"short_code"`
}

type URLResponse struct {
	ID          uint      `json:"id"`
	OriginalURL string    `json:"original_url"`
	ShortCode   string    `json:"short_code"`
	Title       string    `json:"title"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
