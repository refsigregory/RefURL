package logger

import (
	"log"
	"os"
	"time"
)

var (
	InfoLogger  *log.Logger
	ErrorLogger *log.Logger
)

func init() {
	InfoLogger = log.New(os.Stdout, "INFO: ", log.Ldate|log.Ltime|log.Lshortfile)
	ErrorLogger = log.New(os.Stderr, "ERROR: ", log.Ldate|log.Ltime|log.Lshortfile)
}

// Info logs an info message
func Info(format string, v ...interface{}) {
	InfoLogger.Printf(format, v...)
}

// Error logs an error message
func Error(format string, v ...interface{}) {
	ErrorLogger.Printf(format, v...)
}

// Request logs an HTTP request
func Request(method, path, remoteAddr string, duration time.Duration) {
	Info("%s %s %s %v", method, path, remoteAddr, duration)
}

// Database logs a database operation
func Database(operation string, err error) {
	if err != nil {
		Error("Database %s failed: %v", operation, err)
		return
	}
	Info("Database %s successful", operation)
}
