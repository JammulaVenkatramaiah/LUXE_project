package com.fashion.ecommerce.controller;

import com.fashion.ecommerce.dto.*;
import com.fashion.ecommerce.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*", maxAge = 3600)
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private com.fashion.ecommerce.repository.UserRepository userRepository;

    private Long getCurrentUserId() {
        org.springframework.security.core.Authentication authentication = 
            org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new com.fashion.ecommerce.exceptions.UnauthorizedException("User not authenticated");
        }
        
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .map(com.fashion.ecommerce.entity.User::getId)
                .orElseThrow(() -> new com.fashion.ecommerce.exceptions.ResourceNotFoundException("User not found"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse.Response<OrderDTO>> placeOrder(
            @Valid @RequestBody CreateOrderRequest request) {
        Long userId = getCurrentUserId();
        OrderDTO order = orderService.createOrder(userId, request);
        return ResponseEntity.ok(new ApiResponse.Response<>(true, "Order placed successfully", order));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse.Response<Page<OrderDTO>>> getMyOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Long userId = getCurrentUserId();
        Page<OrderDTO> orders = orderService.getMyOrders(userId, page, size);
        return ResponseEntity.ok(new ApiResponse.Response<>(true, "Orders retrieved", orders));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse.Response<Page<OrderDTO>>> getAllOrdersAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<OrderDTO> orders = orderService.getAllOrdersAdmin(page, size);
        return ResponseEntity.ok(new ApiResponse.Response<>(true, "All orders retrieved", orders));
    }

    @GetMapping("/admin/user-stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse.Response<List<UserStatsDTO>>> getUserStatsAdmin() {
        List<UserStatsDTO> stats = orderService.getAllUserStats();
        return ResponseEntity.ok(new ApiResponse.Response<>(true, "User statistics retrieved", stats));
    }

    @GetMapping("/admin/dashboard-stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse.Response<AdminDashboardDTO>> getAdminDashboardStats() {
        AdminDashboardDTO stats = orderService.getAdminDashboardStats();
        return ResponseEntity.ok(new ApiResponse.Response<>(true, "Admin dashboard statistics retrieved", stats));
    }

    @GetMapping("/admin/by-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse.Response<Page<OrderDTO>>> getOrdersByStatusAdmin(
            @RequestParam com.fashion.ecommerce.entity.OrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<OrderDTO> orders = orderService.getOrdersByStatus(status, page, size);
        return ResponseEntity.ok(new ApiResponse.Response<>(true, "Orders retrieved for status: " + status, orders));
    }

    @PutMapping("/admin/{id}/accept")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse.Response<OrderDTO>> acceptOrder(@PathVariable Long id) {
        OrderDTO order = orderService.acceptOrder(id);
        return ResponseEntity.ok(new ApiResponse.Response<>(true, "Order accepted successfully", order));
    }

    @PutMapping("/admin/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse.Response<OrderDTO>> rejectOrder(
            @PathVariable Long id, 
            @RequestParam String reason) {
        OrderDTO order = orderService.rejectOrder(id, reason);
        return ResponseEntity.ok(new ApiResponse.Response<>(true, "Order rejected successfully", order));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse.Response<OrderDTO>> getOrderById(@PathVariable Long id) {
        OrderDTO order = orderService.getOrderById(id);
        return ResponseEntity.ok(new ApiResponse.Response<>(true, "Order retrieved", order));
    }

    @GetMapping("/{id}/tracking")
    public ResponseEntity<ApiResponse.Response<List<OrderTrackingDTO>>> getOrderTracking(@PathVariable Long id) {
        List<OrderTrackingDTO> trackingEvents = orderService.getOrderTracking(id);
        return ResponseEntity.ok(new ApiResponse.Response<>(true, "Order tracking retrieved", trackingEvents));
    }


}
