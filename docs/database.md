# Database Documentation

## Schema Design

The database schema is defined using Atlas HCL (HashiCorp Configuration Language) in the `database/schema` directory.

### Core Tables

1. **Users**
   - Primary key: `id` (bigint)
   - Unique constraint on `email`
   - Timestamps: `created_at`, `updated_at`

2. **URLs**
   - Primary key: `id` (bigint)
   - Foreign key to `users` (owner)
   - Unique constraint on `short_code`
   - Timestamps: `created_at`, `clicks_at`

3. **Configs**
   - Primary key: `id` (bigint)
   - Unique constraint on `CONFIG_NAME`

## Initial Setup and Passwords

### Default Seed Data

The default seed data includes a test admin user with a dummy password. This is for development purposes only and should be changed before using in production.

```sql
-- Default seed data (database/seeds/common/000001_admin_user.sql)
INSERT INTO "users" ("email", "password", "name")
VALUES ('admin@example.com', '$2a$10$dummy_hash', 'Admin User');
```

### Setting Up Real Passwords

Each backend implementation has its own way of handling password hashing. You should:

1. **Remove the default seed** or update it with a proper password hash:
   ```bash
   # Remove default seed
   rm database/seeds/common/000001_users.sql
   
   # Or update it with a proper password hash from your backend
   ```

2. **Create a new user** through your backend's API:
   ```bash
   # Example using curl with Express backend
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@example.com",
       "password": "your_secure_password",
       "name": "Admin User"
     }'
   ```

3. **Or create a custom seed** with proper password hash:
   ```bash
   # 1. Generate password hash using your backend
   cd apps/api/express-typescript-api
   node -e "const bcrypt = require('bcrypt'); bcrypt.hash('your_secure_password', 10).then(console.log)"
   
   # 2. Create new seed file
   cat > database/seeds/common/000001_admin_user.sql << EOF
   INSERT INTO "users" ("email", "password", "name")
   VALUES ('admin@example.com', '$(node -e "const bcrypt = require('bcrypt'); bcrypt.hash('your_secure_password', 10).then(console.log)")', 'Admin User');
   EOF
   ```

### Password Requirements

- Minimum 8 characters
- Mix of uppercase and lowercase letters
- Include numbers
- Include special characters
- No common passwords or patterns

### Environment Configuration
The `.env` file should be placed in the root directory of the project. The environment variables can be loaded in several ways:

1. **Direct from root directory**:
```bash
# From the root directory
cp env.example .env
# Edit .env with your configuration
```

2. **Source from subdirectories**:
```bash
# From any subdirectory
source ../../../../.env  # Adjust the number of ../ based on your location
```

3. **Using environment variables in scripts**:
```bash
# In your scripts
source ../../../../.env && your-command
```

Common environment variables include:
```bash
# Database Configuration
DB_DRIVER=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=refurl
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL_MODE=disable

# Initial user setup
INITIAL_USER_PASSWORD=your-secure-password

# Password hashing configuration
PASSWORD_HASH_ROUNDS=12
```

Note: The number of `../` in the source command depends on your current directory location relative to the root. For example:
- From `apps/api/express-typescript-api`: `source ../../../../.env`
- From `shared/scripts`: `source ../../.env`
- From `database/migrations`: `source ../../.env`

## Migrations with Atlas

### Prerequisites

1. Install Atlas CLI:
```bash
# macOS
brew install ariga/tap/atlas

# Linux
curl -sSf https://atlasgo.sh | sh

# Windows
scoop install atlas
```

2. Verify installation:
```bash
atlas version
```

### Migration Workflow

1. **Create a new migration**:
```bash
cd database
atlas migrate new migration_name
```

2. **Edit the migration file**:
```sql
-- migrations/000001_migration_name.up.sql
CREATE TABLE IF NOT EXISTS "users" (
  "id" bigint NOT NULL,
  "email" varchar(255) NOT NULL,
  "password" varchar(255) NOT NULL,
  "name" varchar(255) NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
);

-- migrations/000001_migration_name.down.sql
DROP TABLE IF EXISTS "users";
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

### Migration Best Practices

1. **Naming Conventions**:
   - Use descriptive names: `add_user_table`, `add_url_indexes`
   - Include version number: `000001_add_user_table`
   - Use snake_case for file names

2. **Migration Structure**:
   - Each migration should have `.up.sql` and `.down.sql` files
   - `.up.sql` for applying changes
   - `.down.sql` for reverting changes

3. **Atomic Changes**:
   - Each migration should be atomic
   - One logical change per migration
   - Include both forward and backward migrations

4. **Testing Migrations**:
   - Test both up and down migrations
   - Verify data integrity
   - Check foreign key constraints

## Seeding Data

1. **Create seed files**:
```bash
cd database/seeds
touch 000001_admin_user.sql
```

2. **Add seed data**:
```sql
-- seeds/000001_admin_user.sql
INSERT INTO "users" ("email", "password", "name")
VALUES ('admin@example.com', '$2a$10$...', 'Admin User');
```

3. **Run seeds**:
```bash
psql -d refurl -f database/seeds/000001_users.sql
```

## Backup & Restore

1. **Create backup**:
```bash
pg_dump -d refurl > backup.sql
```

2. **Restore from backup**:
```bash
psql -d refurl < backup.sql
```

3. **Automated backups**:
```bash
# Add to crontab
0 0 * * * pg_dump -d refurl > /backups/refurl_$(date +\%Y\%m\%d).sql
```

## Database Security

1. **User Permissions**:
   - Use least privilege principle
   - Create specific roles for different operations
   - Limit direct database access

2. **Connection Security**:
   - Use SSL for all connections
   - Implement connection pooling
   - Set appropriate timeouts

3. **Data Protection**:
   - Encrypt sensitive data
   - Implement row-level security
   - Regular security audits

## Monitoring

1. **Performance Metrics**:
   - Query execution time
   - Connection pool usage
   - Index usage
   - Table sizes

2. **Health Checks**:
   - Connection status
   - Replication lag
   - Disk space
   - Memory usage

3. **Alerting**:
   - Set up monitoring alerts
   - Configure error notifications
   - Monitor backup status

# Database Setup Guide

This guide covers how to set up and manage the database for any backend implementation.

## Prerequisites

- PostgreSQL (recommended), MySQL, or SQLite
- Atlas CLI (for migrations)
- Database client (psql, mysql, or sqlite3)

## Setup Methods

### 1. Automated Setup (Recommended)

We provide a script that automates the entire database setup process:

```bash
bash shared/scripts/init-db.sh
```

This script will:
- Create the database if it doesn't exist
- Run all migrations
- Seed the database (if seed files are present)

To use a different database driver:
```bash
bash shared/scripts/init-db.sh mysql
bash shared/scripts/init-db.sh sqlite
```

### 2. Manual Setup

If you prefer to set up the database manually, follow these steps:

#### A. Create Database

**PostgreSQL:**
```bash
# Create main database
createdb refurl

# Create dev database (for Atlas)
createdb refurl_dev
```

**MySQL:**
```bash
# Create main database
mysql -u root -p -e "CREATE DATABASE refurl;"

# Create dev database
mysql -u root -p -e "CREATE DATABASE refurl_dev;"
```

**SQLite:**
```bash
# SQLite creates databases automatically
touch refurl.db
touch refurl_dev.db
```

#### B. Configure Environment

Copy and edit the environment file:
```bash
cp env.example .env
```

Update the database configuration in `.env`:
```env
# PostgreSQL
DB_DRIVER=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=refurl
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL_MODE=disable

# MySQL
DB_DRIVER=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=refurl
DB_USER=root
DB_PASSWORD=your_password

# SQLite
DB_DRIVER=sqlite
DB_NAME=refurl.db
```

#### C. Run Migrations

1. Generate migrations from schema:
```bash
cd database
atlas migrate diff init_schema \
    --dir "file://migrations" \
    --to "file://schema/common.hcl" \
    --dev-url "postgres://postgres:password@localhost:5432/refurl_dev?sslmode=disable"
```

2. Apply migrations:
```bash
atlas migrate apply \
    --dir "file://migrations" \
    --url "postgres://postgres:password@localhost:5432/refurl?sslmode=disable"
```

#### D. Seed Database (Optional)

Run seed files manually:

**PostgreSQL:**
```bash
for file in database/seeds/common/*.sql; do
    psql -d refurl -f "$file"
done
```

**MySQL:**
```bash
for file in database/seeds/common/*.sql; do
    mysql -u root -p refurl < "$file"
done
```

**SQLite:**
```bash
for file in database/seeds/common/*.sql; do
    sqlite3 refurl.db < "$file"
done
```

## Database Management

### Switching Database Drivers

Use the provided script to switch between database drivers:
```bash
bash shared/scripts/switch-db.sh <postgres|mysql|sqlite>
```

### Migration Commands

```bash
# Create new migration
atlas migrate new migration_name

# Apply migrations
atlas migrate apply

# Check migration status
atlas migrate status

# Rollback last migration
atlas migrate down 1

# Rollback to specific version
atlas migrate down --version 1
```

### Backup and Restore

**PostgreSQL:**
```bash
# Backup
pg_dump -d refurl > backup.sql

# Restore
psql -d refurl < backup.sql
```

**MySQL:**
```bash
# Backup
mysqldump -u root -p refurl > backup.sql

# Restore
mysql -u root -p refurl < backup.sql
```

**SQLite:**
```bash
# Backup
sqlite3 refurl.db .dump > backup.sql

# Restore
sqlite3 refurl.db < backup.sql
```

## Troubleshooting

### Common Issues

1. **Connection Issues**
   - Verify database credentials in `.env`
   - Ensure database server is running
   - Check network connectivity
   - Verify database exists

2. **Migration Issues**
   - Check Atlas CLI is installed
   - Verify schema files are correct
   - Check migration history
   - Ensure dev database exists

3. **Permission Issues**
   - Verify user has correct permissions
   - Check database ownership
   - Ensure SSL settings are correct

## Best Practices

1. **Development**
   - Use separate databases for development and testing
   - Keep migrations atomic and reversible
   - Test migrations before applying to production

2. **Production**
   - Use strong passwords
   - Enable SSL for database connections
   - Regular backups
   - Monitor database performance

3. **Security**
   - Never commit sensitive credentials
   - Use environment variables
   - Regular security audits
   - Follow principle of least privilege

## Password Setup and Seeding

### Initial Seed Data
The application comes with initial seed data that includes two users:
1. System Administrator (admin@url.ref.si)
2. Refsi (refsi@refsi.si)

Both users are seeded with a dummy password ('dummypassword') for development purposes. This password must be updated before using the application in production.

### Updating Passwords
Each backend implementation provides its own method for updating passwords. Check your backend's documentation for specific instructions.

General approaches include:
1. Using backend-specific password update scripts
2. Using the authentication API endpoints
3. Creating custom seed files with proper password hashes

### Password Requirements
The application enforces the following password requirements:
- Minimum length: 6 characters
- Must contain at least one lowercase letter
- Must contain at least one uppercase letter
- Must contain at least one number
- Can include special characters: @$!%*?&

### Environment Configuration
Each backend implementation may require different environment variables for password management. Check your backend's documentation for specific requirements.

Common environment variables include:
```bash
# Initial user setup
INITIAL_USER_PASSWORD=your-secure-password

# Password hashing configuration
PASSWORD_HASH_ROUNDS=12
```

### Security Best Practices
1. Never use the default 'dummypassword' in production
2. Use strong, unique passwords for each user
3. Regularly rotate passwords
4. Store passwords securely using appropriate hashing algorithms
5. Use environment variables for sensitive data 