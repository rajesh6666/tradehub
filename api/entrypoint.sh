#!/bin/sh

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "PostgreSQL is up - executing command"

# Run database migrations
echo "Running migrations..."
node ace migration:run

# Start the application
echo "Starting the application..."
exec "$@"