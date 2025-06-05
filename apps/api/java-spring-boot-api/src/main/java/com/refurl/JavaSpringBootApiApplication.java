package com.refurl;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@SpringBootApplication
@OpenAPIDefinition(
    info = @Info(
        title = "RefURL API",
        version = "1.0",
        description = "Spring Boot API for RefURL"
    )
)
public class JavaSpringBootApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(JavaSpringBootApiApplication.class, args);
    }
} 