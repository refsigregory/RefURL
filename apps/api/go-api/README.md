# Go API

A RESTful API service built with Go, following best practices and standard project layout.

## Project Structure

```
go-api/
├── cmd/                    # Main applications
│   └── api/               # Application entry point
│       └── main.go
├── internal/              # Private application code
│   ├── api/              # API response handling
│   ├── handlers/         # HTTP handlers
│   ├── middleware/       # HTTP middleware
│   ├── models/          # Data models
│   ├── router/          # Route definitions
│   ├── services/        # Business logic
│   └── database/        # Database connection
├── pkg/                  # Public library code
│   ├── logger/          # Logging utilities
│   └── validator/       # Input validation
├── api/                  # API documentation
├── configs/              # Configuration files
├── scripts/             # Build and deployment scripts
├── test/                # Additional test files
├── go.mod               # Go module file
└── README.md            # Project documentation
```

## Prerequisites

- Go 1.21 or later
- PostgreSQL
- Make (optional, for using Makefile commands)

## Getting Started

1. Clone the repository:
```bash
git clone [your-repo-url]
cd go-api
```

2. Install dependencies:
```bash
go mod download
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run the application:
```bash
make run
```

## Development

### Available Commands

- `make build` - Build the application
- `make run` - Run the application
- `make test` - Run tests
- `make clean` - Clean build artifacts
- `make lint` - Run linter
- `make migrate` - Run database migrations
- `make docs` - Generate API documentation
- `make tools` - Install development tools

### Code Style

- Follow [Go Code Review Comments](https://github.com/golang/go/wiki/CodeReviewComments)
- Use `gofmt` for code formatting
- Run `golangci-lint` for code quality checks

### Testing

- Write unit tests for all packages
- Use table-driven tests where appropriate
- Run tests with `go test -v ./...`

### API Documentation

API documentation is generated using Swagger. To update the documentation:

```bash
make docs
```

## Deployment

1. Build the application:
```bash
make build
```

2. Run database migrations:
```bash
make migrate
```

3. Start the server:
```bash
./bin/api
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 