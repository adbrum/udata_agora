ARG NEXUS_REGISTRY_PULL_URL=nexus.devops.ama.lan:5001

FROM ${NEXUS_REGISTRY_PULL_URL}/node:22.19.0-alpine3.21
ARG NEXT_PUBLIC_CMS_URL
ARG BACKEND_URL
ARG BACKEND_HOST
ARG NEXT_PUBLIC_GA
ENV NEXT_PUBLIC_CMS_URL=${NEXT_PUBLIC_CMS_URL}
ENV BACKEND_URL=${BACKEND_URL}
ENV BACKEND_HOST=${BACKEND_HOST}
ENV NEXT_PUBLIC_GA=${NEXT_PUBLIC_GA}
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

LABEL maintainer="ticapp.gov.pt"
LABEL tid=portal-transparencia-fe-site

# Instalar dependências do sistema
RUN apk add --no-cache libc6-compat

WORKDIR /fe-app
RUN cd /fe-app


# Copiar dependências
COPY . .

RUN npm install --include=dev
RUN npm run build
