FROM acr11614e1np02.azurecr.io/node:iron-alpine AS base
USER root

# ------------------------------------------------------------------------------
# ---------- DEV STAGE ----------
# ------------------------------------------------------------------------------
FROM base AS dev
USER root
ENTRYPOINT ["/app_cache/entrypoint.sh"]
CMD npm run start:dev
WORKDIR /app_cache
COPY --chown=node:node entrypoint.sh package*.json ./
RUN chmod +x ./entrypoint.sh
RUN npm install
WORKDIR /app


# ------------------------------------------------------------------------------
# ---------- PROD BUILD STAGE ----------
# - The PROD BUILD stage is the build environment for the production image.
# ------------------------------------------------------------------------------
FROM base as prod-build
RUN mkdir -p /app && chown node.node /app
WORKDIR /app
USER root 

USER node
# Install dependencies first to improve layer caching
COPY --chown=node:node .npmrc package*.json ./
RUN npm install
COPY --chown=node:node . ./

RUN npm run build


# ------------------------------------------------------------------------------
# ---------- PROD STAGE ----------
# ------------------------------------------------------------------------------
FROM prod-build AS prod
WORKDIR /app
USER node
ENTRYPOINT ["./entrypoint_prod.sh"]
CMD npm run start:prod

RUN chmod +x ./entrypoint_prod.sh

ARG GIT_COMMIT=latest
ENV GIT_COMMIT $GIT_COMMIT