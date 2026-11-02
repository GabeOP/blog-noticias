FROM eclipse-temurin:17-jdk
EXPOSE 8080
ADD ./backend/target/blognoticias-0.0.1-SNAPSHOT.jar blognoticias.jar
ENTRYPOINT ["java", "-jar", "/blognoticias.jar"]