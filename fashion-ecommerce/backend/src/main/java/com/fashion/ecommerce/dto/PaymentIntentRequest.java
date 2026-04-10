package com.fashion.ecommerce.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentIntentRequest {
    @NotNull(message = "Order ID is required")
    private Long orderId;
}
