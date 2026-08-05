# ==============================================================================
# BOULT AI Ad Generator Suite - Multi-Stage Enterprise Dockerfile
# Target Environment: Cloud Run / Docker / Kubernetes / Nginx Proxy
# ==============================================================================

# STAGE 1: Build Phase
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests and install dependencies
COPY package*.json ./
RUN npm ci

# Copy full application source code
COPY . .

# Build web distribution and backend bundled server
RUN npm run build

# STAGE 2: Production Execution Runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package manifest for production node_modules install
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled build artifacts from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/bin ./bin

# Expose container default application port
EXPOSE 3000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/config || exit 1

# Launch production bundled server
CMD ["node", "dist/server.cjs"]
