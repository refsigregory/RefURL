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
psql -d refurl -f database/seeds/000001_admin_user.sql
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