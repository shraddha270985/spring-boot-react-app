# Build the React frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Build the Spring Boot backend and package the frontend assets into it
FROM maven:3.9.9-eclipse-temurin-17 AS backend-build
WORKDIR /app
COPY backend/.mvn backend/.mvn
COPY backend/mvnw backend/
COPY backend/pom.xml backend/
RUN chmod +x backend/mvnw
COPY backend/src backend/src
COPY --from=frontend-build /app/frontend/build backend/src/main/resources/static
WORKDIR /app/backend
RUN ./mvnw clean package -DskipTests

# Package runtime image
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=backend-build /app/backend/target/backend-1.0.0.jar ./app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
