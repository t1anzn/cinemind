#!/bin/bash

echo "🚀 Testing Cinemind Database Initialization"
echo "==========================================="

# Clean up any existing containers
echo "Cleaning up existing containers..."
docker-compose down -v

# Start the database service
echo "Starting database with automatic data loading..."
docker-compose up db -d

# Wait for database to be ready and data to be loaded
echo "Waiting for database initialization to complete..."
sleep 30

# Check if the database contains data
echo "Checking if data was loaded successfully..."
docker-compose exec db psql -U postgres -d cinemind -c "SELECT COUNT(*) as movie_count FROM movies;" 
docker-compose exec db psql -U postgres -d cinemind -c "SELECT COUNT(*) as cast_count FROM cast;" 
docker-compose exec db psql -U postgres -d cinemind -c "SELECT title FROM movies LIMIT 5;" 

echo "✅ Test complete!"