# syntax=docker/dockerfile:1

# ============================================================ ÉTAPE DE BUILD
# Aucun JDK requis sur la machine du développeur : Maven tourne dans l'image.
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build

# Couche de dépendances isolée : tant que le pom ne change pas, le cache tient.
COPY pom.xml .
RUN --mount=type=cache,target=/root/.m2 mvn -B dependency:go-offline

COPY src ./src
RUN --mount=type=cache,target=/root/.m2 mvn -B clean package -DskipTests

# ============================================================ ÉTAPE RUNTIME
FROM eclipse-temurin:21-jre-alpine AS runtime
WORKDIR /app

# Jamais root dans un conteneur exposé.
RUN addgroup -S app && adduser -S app -G app

COPY --from=build --chown=app:app /build/target/*.jar app.jar

USER app
EXPOSE 8080

ENV SPRING_PROFILES_ACTIVE=prod \
    JAVA_OPTS="-XX:MaxRAMPercentage=75 -XX:+UseZGC"

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD wget -qO- http://localhost:8080/actuator/health/readiness || exit 1

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar app.jar"]
