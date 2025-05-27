#!/bin/bash
set -e

echo "Setting up databases for RefURL project..."

# Check if Atlas is installed
if ! command -v atlas &> /dev/null; then
    echo "Atlas CLI not found. Installing..."
    curl -sSf https://atlasgo.sh | sh
fi

# Start database services
# echo "Starting database services..."
# docker-compose up -d mysql postgres redis

# Wait for databases to be ready
# echo "Waiting for databases to be ready..."
# sleep 10

# Generate and apply migrations
cd database

echo "Generating migrations for MySQL..."
atlas migrate diff initial --env mysql

echo "Generating migrations for PostgreSQL..."
atlas migrate diff initial --env postgres

echo "Generating migrations for SQLite..."
atlas migrate diff initial --env sqlite

echo "Applying migrations..."
atlas migrate apply --env mysql
atlas migrate apply --env postgres
atlas migrate apply --env sqlite

echo "Database setup complete!"
