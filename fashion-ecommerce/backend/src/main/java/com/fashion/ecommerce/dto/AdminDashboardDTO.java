package com.fashion.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardDTO {
    private long totalOrders;
    private double totalRevenue;
    private long totalUsers;
    private long totalProducts;
}
