#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
SEEDS_DIR="$PROJECT_ROOT/database/seeds"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to execute SQL file
execute_sql_file() {
    local env=$1
    local file=$2
    local db_url=""
    
    case $env in
        mysql)
            db_url=${MYSQL_URL:-"mysql://root:password@localhost:3306/refurl"}
            ;;
        postgres)
            db_url=${POSTGRES_URL:-"postgres://postgres:password@localhost:5432/refurl?sslmode=disable"}
            ;;
        sqlite)
            db_url=${SQLITE_URL:-"sqlite://./refurl.db"}
            ;;
        *)
            print_error "Unknown environment: $env"
            return 1
            ;;
    esac
    
    print_status "Executing $file for $env..."
    
    if [[ $env == "mysql" ]]; then
        mysql -h localhost -u root -ppassword refurl < "$file"
    elif [[ $env == "postgres" ]]; then
        PGPASSWORD=password psql -h localhost -U postgres -d refurl -f "$file"
    elif [[ $env == "sqlite" ]]; then
        sqlite3 ./refurl.db < "$file"
    fi
}

# Function to seed database
seed_database() {
    local env=$1
    
    print_status "Seeding $env database..."
    
    # Execute common seeds first
    if [[ -d "$SEEDS_DIR/common" ]]; then
        for file in "$SEEDS_DIR/common"/*.sql; do
            if [[ -f "$file" ]]; then
                execute_sql_file "$env" "$file"
            fi
        done
    fi
    
    # Execute environment-specific seeds
    if [[ -d "$SEEDS_DIR/$env" ]]; then
        for file in "$SEEDS_DIR/$env"/*.sql; do
            if [[ -f "$file" ]]; then
                execute_sql_file "$env" "$file"
            fi
        done
    fi
    
    print_status "Seeding completed for $env"
}

# Main execution
main() {
    local env=${1:-"all"}
    
    cd "$PROJECT_ROOT"
    
    if [[ "$env" == "all" ]]; then
        print_status "Seeding all databases..."
        seed_database "mysql"
        seed_database "postgres"
        seed_database "sqlite"
    else
        seed_database "$env"
    fi
    
    print_status "Database seeding completed!"
}

# Show usage
show_usage() {
    echo "Usage: $0 [mysql|postgres|sqlite|all]"
    echo "  mysql     - Seed MySQL database only"
    echo "  postgres  - Seed PostgreSQL database only"
    echo "  sqlite    - Seed SQLite database only"
    echo "  all       - Seed all databases (default)"
}

# Parse arguments
case "${1:-all}" in
    mysql|postgres|sqlite|all)
        main "$1"
        ;;
    -h|--help)
        show_usage
        ;;
    *)
        print_error "Invalid argument: $1"
        show_usage
        exit 1
        ;;
esac
