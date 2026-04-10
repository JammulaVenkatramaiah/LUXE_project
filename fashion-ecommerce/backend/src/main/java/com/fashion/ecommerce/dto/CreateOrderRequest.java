package com.fashion.ecommerce.dto;

import lombok.*;
import jakarta.validation.constraints.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderRequest {
    
    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;
    
    private String couponCode;
    
    @NotBlank(message = "Payment method is required")
    private String paymentMethod;
}
