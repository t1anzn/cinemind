#!/bin/sh
set -e

# Set Postgres password for non-interactive auth
export PGPASSWORD="${POSTGRES_PASSWORD:-$DB_PASSWORD}"

# If POSTGRES_PASSWORD is not set, try to read from .env
if [ -z "$PGPASSWORD" ]; then
  if [ -f "/app/.env" ]; then
    PGPASSWORD=$(grep POSTGRES_PASSWORD /app/.env | cut -d '=' -f2)
    export PGPASSWORD
  fi
fi

# Wait for Postgres to be ready
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER"; do
  echo "Waiting for Postgres..."
  sleep 2
done





## Alembic migration removed; only starting Flask app

# Start Flask app
exec python app/app.py
