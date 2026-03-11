# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
ARG FETCH_ARTISTS_SKIP=0
ENV NODE_ENV=production
ENV FETCH_ARTISTS_SKIP=$FETCH_ARTISTS_SKIP
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY next.config.mjs tsconfig.json tailwind.config.ts postcss.config.cjs ./
COPY scripts ./scripts
COPY src ./src
COPY public ./public
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
