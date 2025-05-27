# Init DB

```
# Make executable
chmod +x shared/scripts/init-db.sh

# PostgreSQL - will create 'refurl' and 'refurl_dev' databases
./shared/scripts/init-db.sh postgres

# MySQL - will create 'refurl' and 'refurl_dev' databases  
./shared/scripts/init-db.sh mysql

# SQLite - will create 'refurl.db' file
./shared/scripts/init-db.sh sqlite
```
