# RefURL - URL Shortener Service

A multi-backend URL shortener service with support for multiple frameworks. This project demonstrates how to build the same service using different backend technologies.

## Features

- URL shortening with custom short codes
- User authentication and authorization
- URL analytics (clicks, timestamps)
- Multiple backend implementations
- Shared database schema and migrations
- Common security practices

## Backend Implementations

- [x] Node JS - Express (TypeScript)
- [ ] Go
- [ ] Java: Spring Boot
- [ ] PHP: Laravel
- [ ] Python: Flask

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/refsigregory/refurl.git
cd refurl
```

2. Set up the database:
```bash
# Create database
createdb refurl

# Run migrations
cd database
atlas migrate apply
```

3. Configure environment:
```bash
# Copy example env file
cp env.example .env

# Edit .env with your configuration
```

4. Start the Express backend:
```bash
cd apps/api/express-typescript-api
npm install
npm run dev
```

## Documentation

For detailed documentation, please refer to the [Documentation Index](./docs/README.md) which includes:

- [Getting Started Guide](./docs/getting-started.md)
- [Database Guide](./docs/database.md)
- [API Reference](./docs/api-reference.md)
- [Security Guide](./docs/security.md)
- [Deployment Guide](./docs/deployment.md)

## Project Structure

```
.
├── apps/                    # Backend implementations
│   └── api/                # Express TypeScript API
├── database/               # Database schema and migrations
│   ├── migrations/        # Atlas migrations
│   ├── schema/           # HCL schema definitions
│   └── seeds/            # Database seed data
├── shared/                # Shared utilities and types
├── deployment/            # Deployment configurations
└── docs/                  # Project documentation
```

## Contributing

Please read our [Contributing Guide](./docs/contributing.md) before submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

