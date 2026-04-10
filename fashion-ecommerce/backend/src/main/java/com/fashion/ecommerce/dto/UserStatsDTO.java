package com.fashion.ecommerce.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStatsDTO {
    private Long userId;
    private String name;
    private String email;
    private int orderCount;
    private double totalSpent;
}
