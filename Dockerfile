ARG NODE_VERSION=20

# Stage 1 - install deps
# ======================
FROM imbios/bun-node:${NODE_VERSION}-alpine as deps
WORKDIR /app

COPY package.json ./
COPY bun.lockb ./
COPY .env ./
COPY next.config.* ./
COPY tsconfig.json ./
COPY tailwind.config.ts ./
COPY .eslint* ./
COPY postcss.config.js ./

RUN bun install --frozen-lockfile

# Stage 2 - build
# ======================
FROM imbios/bun-node:${NODE_VERSION}-alpine as builder
WORKDIR /app

COPY --from=deps /app/ ./
COPY src ./src
COPY public ./public

RUN npx next-ws-cli@latest patch

RUN bun run build

# Stage 3 - run
# ======================
FROM imbios/bun-node:${NODE_VERSION}-alpine as runner
WORKDIR /app

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/ ./

# Copy Drizzle directory
COPY drizzle ./drizzle

WORKDIR /app

# Set environment variables
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Expose the necessary port
EXPOSE 3000

COPY production_run.sh ./
RUN chmod +x /app/production_run.sh

# Run database migrations and then start the server
CMD ./production_run.sh
