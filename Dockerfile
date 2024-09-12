ARG NODE_VERSION=20

# Stage 1 - install deps
# ======================
FROM imbios/bun-node:${NODE_VERSION}-alpine as deps
WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Stage 2 - build
# ======================
FROM deps AS builder
WORKDIR /app
COPY --from=deps /app/ ./
COPY .env ./.env
COPY src ./src
COPY public ./public
COPY next.config.mjs .
COPY tsconfig.json .
RUN bun run build

# Stage 3 - run
# ======================
FROM imbios/bun-node:${NODE_VERSION}-alpine as runner
WORKDIR /app

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/migrate.ts /src/db/migrate.ts

# Set environment variables
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Expose the necessary port
EXPOSE 3000

# Run database migrations and then start the server
CMD ["/bin/sh", "-c", "npx tsx ./src/db/migrate.ts && node server.js"]
