FROM ubuntu:latest AS build

RUN apt-get update
RUN apt-get install openjdk-17-jdk -y 
COPY . .

RUN apt-get install maven -y
RUN mvn install -DskipTests

FROM openjdk:17-jdk-slim

# Instalação do RabbitMQ
RUN apt-get update && apt-get install -y \
    rabbitmq-server

# Exposição das portas do RabbitMQ
EXPOSE 5672 15672

EXPOSE 8080

COPY --from=build /target/blognoticias-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]