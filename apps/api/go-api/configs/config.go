package configs

import (
	"fmt"
	"os"
	"strconv"
	"time"
)

type Config struct {
	// Server
	NodeEnv   string
	Port      string
	LogLevel  string
	APIPrefix string

	// Database
	DatabaseURL string
	DBDriver    string
	DBHost      string
	DBPort      int
	DBName      string
	DBUser      string
	DBPassword  string
	DBSSLMode   string

	// JWT
	JWTSecret    string
	JWTExpiresIn time.Duration

	// Email
	SMTPHost string
	SMTPPort int
	SMTPUser string
	SMTPPass string

	// Initial setup
	InitialUserPassword string
}

func LoadConfig() (*Config, error) {
	config := &Config{
		// Server
		NodeEnv:   getEnv("NODE_ENV", "development"),
		Port:      getEnv("PORT", "8080"),
		LogLevel:  getEnv("LOG_LEVEL", "info"),
		APIPrefix: getEnv("API_PREFIX", "/api"),

		// Database
		DatabaseURL: getEnv("DATABASE_URL", ""),
		DBDriver:    getEnv("DB_DRIVER", "postgres"),
		DBHost:      getEnv("DB_HOST", "localhost"),
		DBPort:      getEnvAsInt("DB_PORT", 5432),
		DBName:      getEnv("DB_NAME", "refurl"),
		DBUser:      getEnv("DB_USER", "postgres"),
		DBPassword:  getEnv("DB_PASSWORD", "password"),
		DBSSLMode:   getEnv("DB_SSL_MODE", "disable"),

		// JWT
		JWTSecret:    getEnv("JWT_SECRET", "your-secret-key"),
		JWTExpiresIn: getEnvAsDuration("JWT_EXPIRES_IN", 24*time.Hour),

		// Email
		SMTPHost: getEnv("SMTP_HOST", ""),
		SMTPPort: getEnvAsInt("SMTP_PORT", 587),
		SMTPUser: getEnv("SMTP_USER", ""),
		SMTPPass: getEnv("SMTP_PASS", ""),

		// Initial setup
		InitialUserPassword: getEnv("INITIAL_USER_PASSWORD", "admin123"),
	}

	return config, nil
}

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	if value, exists := os.LookupEnv(key); exists {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}

func getEnvAsDuration(key string, defaultValue time.Duration) time.Duration {
	if value, exists := os.LookupEnv(key); exists {
		if duration, err := time.ParseDuration(value); err == nil {
			return duration
		}
	}
	return defaultValue
}

// GetDSN returns the database connection string
func (c *Config) GetDSN() string {
	if c.DatabaseURL != "" {
		return c.DatabaseURL
	}

	return fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		c.DBHost, c.DBPort, c.DBUser, c.DBPassword, c.DBName, c.DBSSLMode)
}
