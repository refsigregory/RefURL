# Init DB

```
# Initialize and generate migrations for specific environments
atlas migrate diff initial --env mysql
atlas migrate diff initial --env postgres  
atlas migrate diff initial --env sqlite

# Apply migrations to specific environment
atlas migrate apply --env mysql
atlas migrate apply --env postgres
atlas migrate apply --env sqlite

# Use dynamic environment
atlas migrate apply --env production
atlas migrate apply --env staging
atlas migrate apply --env development

# Schema operations
atlas schema apply --env mysql
atlas schema inspect --env postgres
atlas schema diff --env sqlite

# Check migration status
atlas migrate status --env mysql
atlas migrate status --env postgres
```