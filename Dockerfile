FROM alpine:latest AS yarn-deps
LABEL authors="andrewastakhov"
ENV NEXT_TELEMETRY_DISABLED=1
RUN apk add libc6-compat --no-cache && \
    apk add yarn --no-cache

FROM yarn-deps AS builder
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

FROM yarn-deps
ENV NEXT_TELEMETRY_DISABLED=1


WORKDIR /app

COPY --from=builder --chown=root:nodejs /app/.next/standalone ./
COPY --from=builder --chown=root:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=root:nodejs /app/.env ./.env

EXPOSE 3000

CMD ["node", "server.js"]



