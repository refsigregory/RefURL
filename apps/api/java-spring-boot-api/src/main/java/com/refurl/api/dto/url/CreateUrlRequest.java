package com.refurl.api.dto.url;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateUrlRequest {
    @NotBlank(message = "Original URL is required")
    @Pattern(regexp = "^(https?|ftp)://[^\\s/$.?#].[^\\s]*$", message = "Invalid URL format")
    private String originalUrl;

    @Size(max = 50, message = "Short code must be less than 50 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_-]*$", message = "Short code can only contain letters, numbers, underscores, and hyphens")
    private String shortCode;

    @Size(max = 255, message = "Title must be less than 255 characters")
    private String title;
} 