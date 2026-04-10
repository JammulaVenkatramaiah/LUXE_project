package com.fashion.ecommerce.dto;

import lombok.*;
import jakarta.validation.constraints.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDTO {
    
    private Long id;
    
    private Long productId;
    
    private String productName;
    
    @Positive(message = "Quantity must be positive")
    private Integer quantity;
    
    private Double unitPrice;
    
    private String size;
    
    private String color;
}
