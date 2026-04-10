package com.fashion.ecommerce.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryDTO {
    
    private Long id;
    
    private String name;
    
    private String description;
    
    private String imageUrl;
    
    private String slug;
    
    private Boolean isActive;
    
    private java.time.LocalDateTime createdAt;
    
    private java.time.LocalDateTime updatedAt;
}
