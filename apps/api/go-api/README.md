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

#### Unit Testing Best Practices

- Use [table-driven tests](https://github.com/golang/go/wiki/TableDrivenTests) for clarity and coverage.
- Mock dependencies (e.g., database, services) using [sqlmock](https://github.com/DATA-DOG/go-sqlmock) and [testify/mock](https://github.com/stretchr/testify).
- Place test files alongside the code they test, using the `_test.go` suffix.
- Use `require` for critical assertions and `assert` for non-critical ones.
- Cover both success and error scenarios in your tests.
- Keep tests isolated and independent from each other.

#### Running Unit Tests

To run all unit tests with verbose output:

```bash
go test ./internal/services/... ./internal/handlers/... -v
```

Or use the Makefile:

```bash
make test
```

#### Adding New Tests

- Add new test files as `*_test.go` in the relevant package.
- Use mocks for external dependencies.
- See `internal/services/url_test.go` and `internal/handlers/url_test.go` for examples.

#### Test Dependencies

Test dependencies are managed in `go.mod`. If you add new test libraries, run:

```bash
go mod tidy
```

to update dependencies.

### API Documentation

API documentation is generated using Swagger. To update the documentation:

```bash
make docs
```