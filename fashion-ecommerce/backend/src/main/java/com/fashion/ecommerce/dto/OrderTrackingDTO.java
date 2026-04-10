package com.fashion.ecommerce.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderTrackingDTO {
    private Long id;
    private String status;
    private String description;
    private String location;
    private LocalDateTime createdAt;
}
