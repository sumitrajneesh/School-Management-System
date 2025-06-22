# Use a Java 17 JDK image for building the application
FROM eclipse-temurin:17-jdk-focal AS build

WORKDIR /app

# Copy the Maven wrapper files and pom.xml
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies (only if pom.xml changes)
RUN ./mvnw dependency:go-offline -B

# Copy the source code
COPY src src

# Build the Spring Boot application
RUN ./mvnw install -DskipTests

# --- Second stage: Create the final lean image ---
# Use a smaller JRE image for the final runtime
FROM eclipse-temurin:17-jre-focal

WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port on which the application runs
EXPOSE 3004

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]