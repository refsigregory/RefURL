# RefURL - URL Shortener Service

A multi-backend URL shortener service with support for multiple frameworks. This project demonstrates how to build the same service using different backend technologies. Target is to become baseline to start project with specific language and a comparison each technology.

## Features

- URL shortening with custom short codes
- User authentication and authorization
- URL analytics (clicks, timestamps)
- Multiple backend implementations
- Shared database schema and migrations
- Common security practices

## Conventions
- Prefer to use kebab-case on every file name and folder (but depends on best pratice each language)
- @/ maps to src/ (tsconfig.app.json and vite.config.ts) [FE]
- New code starts in features/. Move it to components/ or lib/ only when a second feature needs it. (Feature-based) [FE]
- Files are kebab-case (use-login.ts, auth-layout.tsx); components are PascalCase. [FE]
- Each backend must compatible with same API Contract (easy swapable).
- Must follow best pratices, secure, professional and entriprise level code.

## Backend Implementations

- [x] Node JS - Express (TypeScript) ([setup instructions](./apps/api/express-typescript-api/README.md))
- [x] Go
- [ ] Rust: axum
- [ ] Java: Spring Boot (Incompleted)
- [ ] .NET: Minimal API
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
├── apps/                       # Backend implementations
│   └── api/                    # Express TypeScript API
├── database/                   # Database schema and migrations
│   ├── migrations/             # Atlas migrations
│   ├── schema/                 # HCL schema definitions
│   └── seeds/                  # Database seed data
├── shared/                     # Shared utilities and types
│   └── scripts/                # Database and utility scripts
├── deployment/                 # Deployment configurations
└── docs/                       # Project documentation
```

## Contributing

Please read our [Contributing Guide](./docs/contributing.md) before submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.