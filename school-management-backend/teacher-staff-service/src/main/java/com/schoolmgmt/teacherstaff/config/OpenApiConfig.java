package com.schoolmgmt.teacherstaff.config;


import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI teacherStaffOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("Teacher Staff API (School Management)")
                        .description("API for managing teachers and staff within the school management system.")
                        .version("v1.0.0")
                        .license(new License().name("Apache 2.0").url("http://springdoc.org")))
                .externalDocs(new ExternalDocumentation()
                        .description("School Management Wiki Documentation")
                        .url("https://your-company-wiki.com/school-management-api")); // Replace with actual link
    }
}
