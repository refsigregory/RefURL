# RefURL Spring Boot API

This is the Spring Boot implementation of the RefURL API, designed to be compatible with the existing Go and Express.js implementations.

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- PostgreSQL 12 or higher

## Environment Variables

The following environment variables can be configured:

- `DATABASE_URL`: PostgreSQL connection URL (default: jdbc:postgresql://localhost:5432/refurl)
- `DATABASE_USERNAME`: Database username (default: postgres)
- `DATABASE_PASSWORD`: Database password (default: postgres)
- `PORT`: Server port (default: 8080)

## Building the Project

```bash
mvn clean install
```

## Running the Application

```bash
mvn spring-boot:run
```

Or using the jar file:

```bash
java -jar target/java-spring-boot-api-0.0.1-SNAPSHOT.jar
```

## API Documentation

Once the application is running, you can access:
- Swagger UI: http://localhost:8080/api/swagger-ui.html
- OpenAPI Documentation: http://localhost:8080/api/api-docs

## Project Structure

```
src/main/java/com/refurl/
├── config/         # Configuration classes
├── controller/     # REST controllers
├── model/         # Entity classes
├── repository/    # Data access layer
├── service/       # Business logic
├── exception/     # Custom exceptions
├── security/      # Security configuration
└── dto/           # Data Transfer Objects
```

## Development

### Adding New Dependencies

Add new dependencies to `pom.xml` and run:

```bash
mvn clean install
```

### Running Tests

```bash
mvn test
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License. 