#!/bin/bash
# shared/scripts/init-db.sh - Robust database creation
set -e

# Load .env file
if [ -f ".env" ]; then
    export $(grep -v '^#' .env | grep -v '^$' | xargs)
fi

# Override driver if provided
if [ ! -z "$1" ]; then
    DB_DRIVER="$1"
fi

# Set defaults
DB_DRIVER=${DB_DRIVER:-postgres}
DB_HOST=${DB_HOST:-localhost}
DB_NAME=${DB_NAME:-refurl}
DB_USER=${DB_USER:-postgres}
DB_PASSWORD=${DB_PASSWORD:-password}
DB_SSL_MODE=${DB_SSL_MODE:-disable}

# Set port based on driver
case ${DB_DRIVER} in
    postgres)
        DB_PORT=${DB_PORT:-5432}
        DB_USER=${DB_USER:-postgres}
        ;;
    mysql)
        DB_PORT=${DB_PORT:-3306}
        DB_USER=${DB_USER:-root}
        ;;
    sqlite)
        ;;
    *)
        echo "Error: Unsupported driver: ${DB_DRIVER}"
        exit 1
        ;;
esac

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to create database if not exists
create_database() {
    case ${DB_DRIVER} in
        postgres)
            if ! command_exists psql; then
                echo "Error: psql command not found. Please install PostgreSQL client."
                exit 1
            fi
            
            echo "Checking/creating PostgreSQL database: ${DB_NAME}"
            
            # Test connection first
            if ! PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d postgres -c '\q' 2>/dev/null; then
                echo "Error: Cannot connect to PostgreSQL server. Please check your connection settings."
                exit 1
            fi
            
            # Create main database
            echo "Creating database: ${DB_NAME}"
            PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'" | grep -q 1 || \
            PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d postgres -c "CREATE DATABASE ${DB_NAME};"
            
            # Create dev database for Atlas
            echo "Creating dev database: ${DB_NAME}_dev"
            PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}_dev'" | grep -q 1 || \
            PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d postgres -c "CREATE DATABASE ${DB_NAME}_dev;"
            ;;
        mysql)
            if ! command_exists mysql; then
                echo "Error: mysql command not found. Please install MySQL client."
                exit 1
            fi
            
            echo "Checking/creating MySQL database: ${DB_NAME}"
            
            # Test connection first
            if ! mysql -h "${DB_HOST}" -P "${DB_PORT}" -u "${DB_USER}" -p"${DB_PASSWORD}" -e "SELECT 1;" 2>/dev/null; then
                echo "Error: Cannot connect to MySQL server. Please check your connection settings."
                exit 1
            fi
            
            # Create databases
            echo "Creating database: ${DB_NAME}"
            mysql -h "${DB_HOST}" -P "${DB_PORT}" -u "${DB_USER}" -p"${DB_PASSWORD}" -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME};"
            echo "Creating dev database: ${DB_NAME}_dev"
            mysql -h "${DB_HOST}" -P "${DB_PORT}" -u "${DB_USER}" -p"${DB_PASSWORD}" -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME}_dev;"
            ;;
        sqlite)
            echo "Using SQLite database: ${DB_NAME}.db"
            # SQLite creates database automatically when first accessed
            # Just ensure the directory exists
            mkdir -p "$(dirname "${DB_NAME}.db")"
            ;;
    esac
}

# Build connection URLs
case ${DB_DRIVER} in
    postgres)
        export DATABASE_URL="postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=${DB_SSL_MODE}"
        export DEV_URL="postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}_dev?sslmode=${DB_SSL_MODE}"
        ;;
    mysql)
        export DATABASE_URL="mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
        export DEV_URL="mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}_dev"
        ;;
    sqlite)
        export DATABASE_URL="sqlite://${DB_NAME}.db"
        export DEV_URL="sqlite://file?mode=memory&_fk=1"
        ;;
esac

echo "Using ${DB_DRIVER} database: ${DATABASE_URL}"

# Create database if not exists
create_database

# Create migrations directory
mkdir -p database/migrations

# Check if we have schema
if [ -f "database/schema/common.hcl" ]; then
    echo "Generating migration from schema..."
    
    # Generate migration with dev-url
    atlas migrate diff init_schema \
        --dir "file://database/migrations" \
        --to "file://database/schema/common.hcl" \
        --dev-url "${DEV_URL}"
        
    echo "Migration generated successfully!"
elif [ ! "$(ls -A database/migrations 2>/dev/null)" ]; then
    echo "No schema or migrations found. Please create database/schema/common.hcl"
    exit 1
fi

# Apply migrations
echo "Applying migrations..."
atlas migrate apply \
    --dir "file://database/migrations" \
    --url "${DATABASE_URL}"

echo "✅ Database initialized successfully!"

# Show status
echo "Migration status:"
atlas migrate status \
    --dir "file://database/migrations" \
    --url "${DATABASE_URL}"
