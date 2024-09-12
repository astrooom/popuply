// This file is to get the migration to run in the Dockerfile right
// before the service runs.

import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";

import postgres from "postgres";

import { migrate } from "drizzle-orm/postgres-js/migrator";

const databaseConfig = {
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  ssl: false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};


const pg = postgres({
  ...databaseConfig,
  max: 1, // Use a single connection for migrations
});

const database = drizzle(pg);

async function main() {
  await migrate(database, { migrationsFolder: ".." });
  await pg.end();
}

main();