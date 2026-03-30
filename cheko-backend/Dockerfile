FROM amazoncorretto:17-alpine AS build-stage
WORKDIR /app
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY src src
RUN chmod +x gradlew && ./gradlew build -x test --no-daemon

FROM amazoncorretto:17-alpine
WORKDIR /app
COPY --from=build-stage /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

###
 #docker compose down -v
 #docker compose up --build
###