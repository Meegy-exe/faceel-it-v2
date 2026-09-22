# Stage 1 : compilation du client Vue 3 / vite-ssg
FROM node:22-alpine AS build
WORKDIR /build
COPY client/package.json client/package-lock.json ./
RUN npm ci
COPY client/ .
RUN npm run build

# Stage 2 : service des fichiers statiques via nginx
FROM nginx:1.27-alpine AS runtime
COPY --from=build /build/dist /usr/share/nginx/html
COPY client/nginx.conf /etc/nginx/conf.d/default.conf
COPY client/security-headers.conf /etc/nginx/conf.d/security-headers.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
    CMD wget -qO- http://localhost/ >/dev/null || exit 1
CMD ["nginx", "-g", "daemon off;"]
