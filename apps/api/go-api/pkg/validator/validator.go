package validator

import (
	"errors"
	"regexp"
	"strings"
)

var (
	ErrInvalidEmail    = errors.New("invalid email format")
	ErrInvalidPassword = errors.New("password must be at least 8 characters long")
	ErrEmptyField      = errors.New("field cannot be empty")
)

// ValidateEmail checks if the email is valid
func ValidateEmail(email string) error {
	if email == "" {
		return ErrEmptyField
	}

	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	if !emailRegex.MatchString(email) {
		return ErrInvalidEmail
	}

	return nil
}

// ValidatePassword checks if the password meets requirements
func ValidatePassword(password string) error {
	if password == "" {
		return ErrEmptyField
	}

	if len(password) < 8 {
		return ErrInvalidPassword
	}

	return nil
}

// SanitizeString removes leading/trailing whitespace
func SanitizeString(s string) string {
	return strings.TrimSpace(s)
}
