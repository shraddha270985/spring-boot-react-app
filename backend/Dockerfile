# Build stage
FROM maven:3.9.9-eclipse-temurin-17 AS builder
WORKDIR /build

# Copy entire backend directory
COPY . .

# Make mvnw executable
RUN chmod +x mvnw

# Build the application
RUN ./mvnw clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy the built JAR from builder stage
COPY --from=builder /build/target/backend-1.0.0.jar app.jar

# Expose port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
