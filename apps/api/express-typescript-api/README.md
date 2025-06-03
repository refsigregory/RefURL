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
   cp ../../../../env.example .env
   # Edit .env with your configuration
   ```

3. Initialize the database (recommended):
   ```bash
   bash ../../../../shared/scripts/init-db.sh
   ```
   - To use MySQL or SQLite:
     ```bash
     bash ../../../../shared/scripts/init-db.sh mysql
     bash ../../../../shared/scripts/init-db.sh sqlite
     ```

4. Start the development server:
   ```bash
   npm run dev
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

This backend uses Sequelize with PostgreSQL by default. The database schema and migrations are managed using Atlas.

To switch database drivers:
```bash
bash ../../../../shared/scripts/switch-db.sh <postgres|mysql|sqlite>
```

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