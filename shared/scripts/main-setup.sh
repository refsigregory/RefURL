#!/bin/bash
set -e

echo "🚀 Setting up RefURL project with Atlas..."

# Setup databases and run migrations
./shared/scripts/setup-db.sh

# Wait a moment for databases to be ready
sleep 5

# Run seeders
echo "🌱 Running database seeders..."
./shared/scripts/seed-db.sh all

echo "✅ Complete setup finished!"
echo ""
echo "Available commands:"
echo "  ./shared/scripts/seed-db.sh mysql     - Seed MySQL only"
echo "  ./shared/scripts/seed-db.sh postgres  - Seed PostgreSQL only"
echo "  ./shared/scripts/seed-db.sh sqlite    - Seed SQLite only"
echo "  ./shared/scripts/seed-db.sh all       - Seed all databases"