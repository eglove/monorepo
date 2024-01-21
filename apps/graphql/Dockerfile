FROM gradle:alpine AS build

WORKDIR /app

COPY . .
RUN gradle build --no-daemon

FROM openjdk:17-alpine

EXPOSE 8080

RUN mkdir /app

COPY --from=build /app/build/libs/application.jar /app/application.jar

ENTRYPOINT ["java", "-XX:+UnlockExperimentalVMOptions", "-XX:+UseContainerSupport", "-Djava.security.egd=file:/dev/./urandom","-jar","/app/application.jar"]
