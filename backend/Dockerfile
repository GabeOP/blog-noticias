# Estágio 1: Build da aplicação com Maven e Eclipse Temurin 17
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
# Baixa dependências para cache
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Estágio 2: Imagem final leve para execução
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

EXPOSE 8080

COPY --from=build /app/target/*.jar app.jar

# Configuração de memória otimizada para o plano Free do Render
ENTRYPOINT ["java", "-Xmx350m", "-Xms200m", "-jar", "app.jar"]
