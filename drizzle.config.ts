import { defineConfig, type Config } from "drizzle-kit";

const config = {
  schema: "src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.POSTGRES_HOST as string,
    port: Number(process.env.POSTGRES_PORT) as number,
    user: process.env.POSTGRES_USER as string,
    password: process.env.POSTGRES_PASSWORD as string,
    database: process.env.POSTGRES_DATABASE as string,
    ssl: "prefer"
  },
  verbose: true,
  strict: true,
} satisfies Config;

export default defineConfig(config);
