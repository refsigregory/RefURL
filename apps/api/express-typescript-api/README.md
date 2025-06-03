# Express TypeScript Backend

## Prerequisites

- Node.js (v20 or higher)
- PostgreSQL (or MySQL/SQLite, see below)
- Atlas CLI (for migrations)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```bash
   # Option 1: Copy to root directory (recommended)
   cp ../../../../env.example ../../../../.env
   
   # Option 2: Copy to current directory
   cp ../../../../env.example .env
   
   # Edit .env with your configuration
   ```

3. Set up the database:
   - For detailed database setup instructions, see the [Database Guide](../../../docs/database.md)
   - Quick setup (recommended):
     ```bash
     # From the root directory
     bash shared/scripts/init-db.sh
     
     # Or from current directory
     cd ../../../../ && bash shared/scripts/init-db.sh
     ```

4. Update default passwords:
   ```bash
   # Make sure .env is properly configured with INITIAL_USER_PASSWORD
   npm run update-passwords
   ```

5. Start the development server:
   ```bash
   # Option 1: Using local .env
   npm run dev
   
   # Option 2: Using root .env
   source ../../../../.env && npm run dev
   ```

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests
- `npm run test:coverage` - Run tests with coverage

### Project Structure

```
express-typescript-api/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── types/          # TypeScript types
│   └── utils/          # Utility functions
├── tests/              # Test files
└── package.json        # Dependencies and scripts
```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

#### URLs
- `GET /api/urls` - List user's URLs
- `POST /api/urls/shorten` - Create short URL
- `GET /api/urls/go/:shortCode` - Redirect to original URL
- `DELETE /api/urls/:id` - Delete URL

### Database

This backend uses Sequelize with PostgreSQL by default. For complete database setup and management instructions, see the [Database Guide](../../../docs/database.md).

### Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

### Troubleshooting

#### Common Issues

1. **Database Connection Issues**
   - See [Database Troubleshooting](../../../docs/database.md#troubleshooting)
   - Verify database credentials in `.env`
   - Ensure database server is running
   - Check network connectivity

2. **Authentication Issues**
   - Verify JWT_SECRET is set in `.env`
   - Check token expiration
   - Validate user credentials

3. **API Issues**
   - Check API logs
   - Verify endpoint URLs
   - Check request/response format
   - Validate authentication headers

### Contributing

1. Follow the TypeScript style guide
2. Write tests for new features
3. Update documentation as needed
4. Submit a pull request

### License

This project is licensed under the MIT License - see the [LICENSE](../../../../LICENSE) file for details. 