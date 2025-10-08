# Use official Python image
FROM python:3.11-slim

# Install Postgres client for pg_isready
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend /app

## migration_project removed; only copying app and requirements

# Copy the .env file into the container
COPY .env .env

# Expose Flask port
EXPOSE 5000


# Copy db_init for dump file access
COPY db_init /app/db_init

# Make entrypoint.sh executable
RUN chmod +x /app/entrypoint.sh

# Use entrypoint.sh for startup
ENTRYPOINT ["/app/entrypoint.sh"]