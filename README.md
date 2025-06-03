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

- [x] Node JS - Express (TypeScript) ([setup instructions](./apps/api/express-typescript-api/README.md))
- [ ] Go
- [ ] Java: Spring Boot
- [ ] PHP: Laravel
- [ ] Python: Flask

> **Each backend has its own README with setup and development instructions. Please refer to the appropriate README for details.**

# API Documentation
- Postman: https://www.postman.com/speeding-crescent-956789/refurl/collection/a5xv47z/refurl

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/refsigregory/refurl.git
cd refurl
```

2. Choose a backend implementation and follow its setup instructions:
   - [Express TypeScript Backend](./apps/api/express-typescript-api/README.md)
   - More backends coming soon...

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
│   └── scripts/          # Database and utility scripts
├── deployment/            # Deployment configurations
└── docs/                  # Project documentation
```

## Contributing

Please read our [Contributing Guide](./docs/contributing.md) before submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.