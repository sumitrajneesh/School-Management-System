# Use a multi-stage build for a smaller final image

# Stage 1: Build the application
FROM openjdk:17-jdk-slim AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN --mount=type=cache,target=/root/.m2 mvn clean install -DskipTests

# Stage 2: Create the final image
FROM openjdk:17-jre-slim
WORKDIR /app
# Copy the built JAR from the build stage
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080 # Expose the default Spring Boot port
ENTRYPOINT ["java", "-jar", "app.jar"]