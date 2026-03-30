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
COPY --from=build-stage /app/.next/standalone ./
COPY --from=build-stage /app/.next/static ./.next/static
COPY --from=build-stage /app/public ./public
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "server.js"]

###
 #docker compose down -v
 #docker compose up --build
###