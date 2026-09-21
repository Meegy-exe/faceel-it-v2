# syntax=docker/dockerfile:1

# ============================================================ ÉTAPE DE BUILD
FROM node:22-alpine AS build
WORKDIR /build

# npm ci exige package-lock.json : builds reproductibles, pas de dérive de version.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ============================================================ ÉTAPE RUNTIME
FROM nginx:1.27-alpine AS runtime

COPY --from=build /build/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY security-headers.conf /etc/nginx/conf.d/security-headers.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
    CMD wget -qO- http://localhost/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
