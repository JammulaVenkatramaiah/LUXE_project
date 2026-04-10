package com.fashion.ecommerce.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {

    private Long id;

    private String orderNumber;

    private Double subtotal;

    private Double taxAmount;

    private Double shippingCost;

    private Double discountAmount;

    private Double totalPrice;

    private String status;

    private String paymentMethod;

    private String shippingAddress;

    private Long userId;

    private String userName;

    private String userEmail;

    private java.util.List<OrderItemDTO> orderItems;

    private java.time.LocalDateTime createdAt;

    private java.time.LocalDateTime updatedAt;
}
