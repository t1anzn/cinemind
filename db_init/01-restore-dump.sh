#!/bin/bash
set -e

# This script runs automatically when the PostgreSQL container starts for the first time
# It restores the cinemind_dump.sql file into the database

echo "Starting database restoration from dump file..."

# During initialization, we need to connect via Unix socket, not TCP
# The database server is running but not yet accepting TCP connections
# Remove --clean flag since we're starting with a fresh database
PGPASSWORD="$POSTGRES_PASSWORD" pg_restore \
    --username="$POSTGRES_USER" \
    --dbname="$POSTGRES_DB" \
    --no-owner \
    --no-privileges \
    --verbose \
    /docker-entrypoint-initdb.d/cinemind_dump.sql

echo "Database restoration completed successfully!"