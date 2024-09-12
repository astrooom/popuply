#!/bin/sh

echo "Running database migrations..."
bun run db:migrate

echo "Running database seeding..."
bun run db:seed

# Start the server
echo "Starting the server..."
exec node server.js