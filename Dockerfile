# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# monashcoding.com — self-hosted image (Oracle Cloud + Dokploy).
#
# This is a SINGLE-package Next.js 16 app (not a monorepo like monmap), so the
# Dockerfile is the simple shape: no outputFileTracingRoot / transpilePackages,
# no workspace filter. `output: "standalone"` emits a self-contained server.
#
# `next build` is SSG here — every page sets `revalidate = false` and
# events/[slug] has generateStaticParams() — so the build QUERIES THE SANITY
# API. The runner therefore needs network access plus the public Sanity vars
# below. Those are NEXT_PUBLIC_* (project id + dataset are not secrets), passed
# as --build-args because Next inlines them into the client bundle and the
# Studio config reads them at module load.
#
# Secrets (RESEND_API_KEY, SANITY_WEBHOOK_SECRET) are used only by API routes
# at RUNTIME, never during build — set them in Dokploy, never as build args.
# ---------------------------------------------------------------------------

FROM node:22-slim AS base
# Corepack reads the `packageManager` field in package.json to pin the exact
# npm version, so CI resolves the lockfile the same way it was generated.
# Auto-download it without an interactive prompt.
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable
WORKDIR /app

# ---- deps + build -------------------------------------------------------
FROM base AS build

# The `prepare` script runs husky, which needs a .git dir we don't ship.
# HUSKY=0 makes it a no-op during the image build.
ENV HUSKY=0

# Install against the committed lockfile first (better layer caching).
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

# Now the source.
COPY . .

# NEXT_PUBLIC_* must exist at build time — inlined into the client bundle and
# read by sanity.config.ts. Pass via --build-arg (Dokploy: Build → Build Args).
ARG NEXT_PUBLIC_SANITY_PROJECT_ID
ARG NEXT_PUBLIC_SANITY_DATASET
ARG NEXT_PUBLIC_SANITY_API_VERSION
ENV NEXT_PUBLIC_SANITY_PROJECT_ID=$NEXT_PUBLIC_SANITY_PROJECT_ID \
    NEXT_PUBLIC_SANITY_DATASET=$NEXT_PUBLIC_SANITY_DATASET \
    NEXT_PUBLIC_SANITY_API_VERSION=$NEXT_PUBLIC_SANITY_API_VERSION \
    NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ---- runtime ------------------------------------------------------------
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Run as a non-root user.
RUN groupadd --system --gid 1001 nodejs \
 && useradd --system --uid 1001 --gid nodejs nextjs

# standalone/ ships server.js + a pruned node_modules. Static assets and
# public/ aren't traced into it, so copy them alongside.
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
