#!/bin/sh

# Print all environment variables
echo "Current environment variables:"
env | sort

# Run database migrations
echo "Running database migrations..."
cd ./drizzle/migrate
bun run db:migrate
cd ../..

# Start the server
echo "Starting the server..."
exec node server.js