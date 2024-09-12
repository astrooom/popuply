
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

ENV NODE_ENV production

# Copy over the build output
COPY --from=builder /app/.next/standalone ./

# Copy static assets and public folder to the standalone folder
COPY --from=builder /app/.next/static ./standalone/.next/static
COPY --from=builder /app/public ./standalone/public

ENV NEXT_TELEMETRY_DISABLED 1

EXPOSE 3000
CMD ["node", "server.js"]