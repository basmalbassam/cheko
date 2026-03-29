FROM --platform=linux/amd64 eclipse-temurin:17-jdk-alpine AS build-stage
WORKDIR /app
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY src src
RUN chmod +x gradlew && ./gradlew build -x test

# Pre-fetch Gradle dependencies before building
RUN chmod +x gradlew && \
    ./gradlew dependencies --no-daemon || true && \
    ./gradlew build -x test --no-daemon \

FROM --platform=linux/amd64 eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

###
 #docker compose down -v
 #docker compose up --build
###