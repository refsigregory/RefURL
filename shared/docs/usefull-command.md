# Usefull Command

```
# List available environments
atlas env list

# Validate environment configuration
atlas env validate --env mysql

# Generate schema documentation
atlas schema inspect --env mysql --format '{{ json . }}'

# Lint migrations
atlas migrate lint --env postgres

# Create checkpoint
atlas migrate checkpoint --env mysql

# Test migrations
atlas migrate test --env sqlite
```