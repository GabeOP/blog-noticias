FROM openjdk:20
EXPOSE 8080
ADD ./backend/target/blognoticias-0.0.1-SNAPSHOT.jar blognoticias.jar
ENTRYPOINT ["java", "-jar", "/blognoticias.jar"]