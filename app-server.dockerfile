ARG NEXUS_REGISTRY_PULL_URL=nexus.devops.ama.lan:5001

FROM ${NEXUS_REGISTRY_PULL_URL}/node:22.19.0-alpine3.21

WORKDIR /app

COPY .next/standalone/ ./
COPY .next/static/ ./.next/static/
COPY public/ ./public/


EXPOSE 3000
CMD ["node", "server.js"]