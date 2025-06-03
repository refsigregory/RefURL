# RefURL - URL Shortener Service

A multi-backend URL shortener service with support for multiple frameworks.

## TODO

- [x] Node JS - Express (TypeScript)
- [ ] Go
- [ ] Java: Spring Boot
- [ ] PHP: Laravel
- [ ] Python: Flask

# Documentation

## TypeScript Backend Setup

### Prerequisites
- Node.js (v20 or higher)
- npm or yarn
- PostgreSQL database
- Atlas CLI (for database migrations)

### Installation

1. Navigate to the TypeScript backend directory:
```bash
cd apps/api/express-typescript-api
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment variables:
```bash
# Copy the example env file
cp ../../env.example .env
```

4. Update the `.env` file with your configuration:
```env
# Server
NODE_ENV=development
PORT=3000
API_PREFIX=/api

# Database
DB_DRIVER=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=refurl
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_SSL_MODE=disable

# JWT Authentication
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=24h

# Initial Admin User
INITIAL_USER_PASSWORD=admin123
```

5. Set up the database:
```bash
# Create database
createdb refurl

# Run migrations using Atlas
cd ../../database
atlas migrate apply
```

6. Start the development server:
```bash
cd ../apps/api/express-typescript-api
npm run dev
# or
yarn dev
```

### Database Migrations with Atlas

1. **Install Atlas CLI**:
```bash
# macOS
brew install ariga/tap/atlas

# Linux
curl -sSf https://atlasgo.sh | sh

# Windows
scoop install atlas
```

2. **Create a new migration**:
```bash
cd database
atlas migrate new migration_name
```

3. **Apply migrations**:
```bash
# Apply all pending migrations
atlas migrate apply

# Apply with specific version
atlas migrate apply --version 1

# Apply with specific database URL
atlas migrate apply --url "postgres://user:pass@localhost:5432/refurl?sslmode=disable"
```

4. **Check migration status**:
```bash
atlas migrate status
```

5. **Rollback migrations**:
```bash
# Rollback last migration
atlas migrate down 1

# Rollback to specific version
atlas migrate down --version 1
```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

#### URLs
- `GET /api/urls` - Get all URLs for authenticated user
- `POST /api/urls/shorten` - Create a new short URL
- `GET /api/urls/go/:shortCode` - Redirect to original URL
- `DELETE /api/urls/:id` - Delete a specific URL

### Security Best Practices

1. **Password Configuration**:
   - Use strong passwords (min 8 characters, mix of letters, numbers, symbols)
   - Store passwords hashed using bcrypt
   - Never store plain text passwords
   - Use environment variables for sensitive data

2. **Environment Variables**:
   - Keep `.env` file out of version control
   - Use different values for development and production
   - Regularly rotate secrets and passwords

3. **Database Security**:
   - Use strong database passwords
   - Limit database user permissions
   - Enable SSL for production database connections
   - Regular backups

4. **API Security**:
   - Use HTTPS in production
   - Implement rate limiting
   - Validate all input data
   - Use JWT for authentication
   - Set appropriate CORS policies

### Development

1. **Code Style**:
```bash
# Run linter
npm run lint
# or
yarn lint

# Format code
npm run format
# or
yarn format
```

2. **Testing**:
```bash
# Run tests
npm run test
# or
yarn test

# Run tests with coverage
npm run test:coverage
# or
yarn test:coverage
```

### Production Deployment

1. Set production environment variables:
```env
NODE_ENV=production
PORT=3000
API_PREFIX=/api
DB_SSL_MODE=require
JWT_SECRET=strong_production_secret
```

2. Build the application:
```bash
npm run build
# or
yarn build
```

3. Start the production server:
```bash
npm start
# or
yarn start
```

### Troubleshooting

1. **Database Connection Issues**:
   - Verify database credentials
   - Check database server is running
   - Ensure database exists
   - Check network connectivity

2. **Authentication Issues**:
   - Verify JWT_SECRET is set
   - Check token expiration
   - Validate user credentials

3. **API Issues**:
   - Check API logs
   - Verify endpoint URLs
   - Check request/response format
   - Validate authentication headers

### Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

### License

MIT License - see LICENSE file for details


