#!/bin/bash
# shared/scripts/switch-db.sh
set -e

DB_DRIVER=${1}

if [ -z "$DB_DRIVER" ]; then
    echo "Usage: $0 <postgres|mysql|sqlite>"
    exit 1
fi

case ${DB_DRIVER} in
    postgres)
        sed -i.bak 's/^DB_DRIVER=.*/DB_DRIVER=postgres/' .env
        sed -i.bak 's/^DB_PORT=.*/DB_PORT=5432/' .env
        sed -i.bak 's/^DB_USER=.*/DB_USER=postgres/' .env
        echo "Switched to PostgreSQL configuration"
        ;;
    mysql)
        sed -i.bak 's/^DB_DRIVER=.*/DB_DRIVER=mysql/' .env
        sed -i.bak 's/^DB_PORT=.*/DB_PORT=3306/' .env
        sed -i.bak 's/^DB_USER=.*/DB_USER=root/' .env
        echo "Switched to MySQL configuration"
        ;;
    sqlite)
        sed -i.bak 's/^DB_DRIVER=.*/DB_DRIVER=sqlite/' .env
        echo "Switched to SQLite configuration"
        ;;
    *)
        echo "Error: Unsupported database driver: ${DB_DRIVER}"
        echo "Supported drivers: postgres, mysql, sqlite"
        exit 1
        ;;
esac

# Clean up backup file
rm -f .env.bak

echo "Updated .env file. Current database configuration:"
grep "^DB_" .env