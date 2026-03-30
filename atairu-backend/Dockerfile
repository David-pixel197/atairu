FROM maven:3.9.14-eclipse-temurin-25-alpine AS build
COPY . .
RUN mvn package -DskipTests

FROM eclipse-temurin:25-alpine
COPY --from=build target/Atairu_back.jar app.jar
EXPOSE 8080

CMD ["java", "-jar", "app.jar"]