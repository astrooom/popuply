#!/bin/sh

#Echoing directory contents
echo "Directory contents:"
find . -maxdepth 2 -type d

echo "Running database migrations..."
bun run db:migrate

echo "Running database seeding..."
bun run db:seed

# Start the server
echo "Starting the server..."
npx next-ws-cli@latest patch
exec bun run start