# --- Base stage ---
FROM node:18-alpine AS base
WORKDIR /app

# Optional for native dependencies
RUN apk add --no-cache libc6-compat

# --- Dependencies stage ---
FROM base AS deps

# Copy lock files
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

# Install dependencies
RUN \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm install --frozen-lockfile; \
  else echo "No lockfile found." && exit 1; \
  fi

# Install Alpine-compatible SWC binary
RUN npm install @next/swc-linux-x64-musl --save-optional

# --- Build stage ---
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Optional: disable Next telemetry
# ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js app
RUN \
  if [ -f yarn.lock ]; then yarn build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm run build; \
  else echo "No lockfile found." && exit 1; \
  fi

# --- Production stage ---
FROM base AS runner

ENV NODE_ENV=production
ENV PORT=5001
ENV HOSTNAME="0.0.0.0"

# Create user for better security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs
ENV TZ=Asia/Jakarta
WORKDIR /app

# Copy only necessary files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Fix prerender cache permissions
RUN mkdir -p .next && chown -R nextjs:nodejs .next

USER nextjs

EXPOSE 5001

CMD ["node", "server.js"]