.PHONY: build run test clean lint

# Build the application
build:
	go build -o bin/api cmd/api/main.go

# Run the application
run:
	go run cmd/api/main.go

# Run tests
test:
	go test -v ./...

# Clean build artifacts
clean:
	rm -rf bin/

# Run linter
lint:
	golangci-lint run

# Run database migrations
migrate:
	atlas migrate apply

# Generate API documentation
docs:
	swag init -g cmd/api/main.go -o api/docs

# Install development tools
tools:
	go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
	go install github.com/swaggo/swag/cmd/swag@latest

# Help
help:
	@echo "Available commands:"
	@echo "  make build    - Build the application"
	@echo "  make run      - Run the application"
	@echo "  make test     - Run tests"
	@echo "  make clean    - Clean build artifacts"
	@echo "  make lint     - Run linter"
	@echo "  make migrate  - Run database migrations"
	@echo "  make docs     - Generate API documentation"
	@echo "  make tools    - Install development tools" 