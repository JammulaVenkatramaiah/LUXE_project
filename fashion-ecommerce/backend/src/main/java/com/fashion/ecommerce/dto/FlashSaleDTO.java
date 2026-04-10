package com.fashion.ecommerce.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlashSaleDTO {
    private Long id;
    private String name;
    private Double discountPercentage;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Boolean isActive;
    private List<ProductDTO> products;
}
