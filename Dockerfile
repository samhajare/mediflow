# syntax=docker/dockerfile:1

FROM node:24.16.0-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM dependencies AS build
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src
RUN npm run build
RUN npm prune --omit=dev

FROM node:24.16.0-alpine AS runtime
ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /app

RUN addgroup -S mediflow && adduser -S mediflow -G mediflow
COPY --from=build --chown=mediflow:mediflow /app/node_modules ./node_modules
COPY --from=build --chown=mediflow:mediflow /app/package.json ./package.json
COPY --from=build --chown=mediflow:mediflow /app/dist ./dist

USER mediflow
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 3000) + '/health/live').then(r => { if (!r.ok) process.exit(1) }).catch(() => process.exit(1))"
CMD ["node", "dist/main.js"]
