package com.fashion.ecommerce.service;

import com.fashion.ecommerce.dto.*;
import com.fashion.ecommerce.entity.*;
import com.fashion.ecommerce.repository.*;
import com.fashion.ecommerce.exceptions.ResourceNotFoundException;
import com.fashion.ecommerce.exceptions.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderTrackingRepository orderTrackingRepository;
    
    @Autowired
    private NotificationService notificationService;

    @Transactional
    public OrderDTO createOrder(Long userId, CreateOrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CartDTO cart = cartService.getCart(userId);
        if (cart.getCartItems().isEmpty()) {
            throw new BadRequestException("Cannot place an order with an empty cart");
        }

        // Validate stock before processing
        for (CartItemDTO item : cart.getCartItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + item.getProductId()));
            if (product.getStockQuantity() < item.getQuantity()) {
                throw new BadRequestException("Insufficient stock for product: " + product.getName());
            }
        }

        // Create Order
        Order order = Order.builder()
                .user(user)
                .orderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .shippingAddress(request.getShippingAddress())
                .paymentMethod(request.getPaymentMethod())
                .subtotal(cart.getTotalPrice())
                .taxAmount(cart.getTotalPrice() * 0.05) // 5% Tax
                .shippingCost(cart.getTotalPrice() > 100 ? 0.0 : 10.0) // Free shipping over $100
                .totalPrice(cart.getTotalPrice() + (cart.getTotalPrice() * 0.05) + (cart.getTotalPrice() > 100 ? 0.0 : 10.0))
                .status(OrderStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Order savedOrder = orderRepository.save(order);
        
        orderTrackingRepository.save(OrderTrackingEvent.builder()
                .order(savedOrder)
                .status(OrderStatus.PENDING)
                .description("Order successfully placed")
                .location("Online")
                .build());

        // Create Order Items and Update Stock
        List<OrderItem> orderItems = cart.getCartItems().stream().map(cartItem -> {
            Product product = productRepository.findById(cartItem.getProductId()).get();
            
            // Deduct Stock
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            return OrderItem.builder()
                    .order(savedOrder)
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .unitPrice(cartItem.getPrice())
                    .size(cartItem.getSize())
                    .color(cartItem.getColor())
                    .createdAt(LocalDateTime.now())
                    .build();
        }).collect(Collectors.toList());

        orderItemRepository.saveAll(orderItems);
        savedOrder.setOrderItems(orderItems);

        // Clear Cart
        cartService.clearCart(userId);
        
        // Asynchronously notify user
        notificationService.sendOrderConfirmation(user, savedOrder.getOrderNumber());

        return convertToDTO(savedOrder);
    }

    public Page<OrderDTO> getMyOrders(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return orderRepository.findByUserId(userId, pageable).map(this::convertToDTO);
    }

    public Page<OrderDTO> getAllOrdersAdmin(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return orderRepository.findAll(pageable).map(this::convertToDTO);
    }

    public OrderDTO getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        return convertToDTO(order);
    }

    public Page<OrderDTO> getOrdersByStatus(OrderStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return orderRepository.findByStatus(status, pageable).map(this::convertToDTO);
    }

    @Transactional
    public OrderDTO acceptOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new BadRequestException("Only pending orders can be accepted. Current status: " + order.getStatus());
        }
        
        order.setStatus(OrderStatus.CONFIRMED);
        order.setUpdatedAt(LocalDateTime.now());
        Order savedOrder = orderRepository.save(order);
        
        orderTrackingRepository.save(OrderTrackingEvent.builder()
                .order(savedOrder)
                .status(OrderStatus.CONFIRMED)
                .description("Order has been accepted by admin and is being processed")
                .location("Warehouse")
                .build());
        
        notificationService.sendOrderStatusUpdate(order.getUser(), order.getOrderNumber(), "CONFIRMED");
        
        return convertToDTO(savedOrder);
    }

    @Transactional
    public OrderDTO rejectOrder(Long orderId, String reason) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new BadRequestException("Only pending orders can be rejected. Current status: " + order.getStatus());
        }
        
        order.setStatus(OrderStatus.CANCELLED);
        order.setUpdatedAt(LocalDateTime.now());
        Order savedOrder = orderRepository.save(order);
        
        // Restore Stock
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
            productRepository.save(product);
        }
        
        orderTrackingRepository.save(OrderTrackingEvent.builder()
                .order(savedOrder)
                .status(OrderStatus.CANCELLED)
                .description("Order rejected by admin: " + reason)
                .location("System")
                .build());
        
        notificationService.sendOrderStatusUpdate(order.getUser(), order.getOrderNumber(), "CANCELLED (Rejected: " + reason + ")");
        
        return convertToDTO(savedOrder);
    }
    
    @Transactional
    public OrderDTO updateOrderStatus(Long orderId, OrderStatus newStatus, String location, String description) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setStatus(newStatus);
        order.setUpdatedAt(LocalDateTime.now());
        
        Order savedOrder = orderRepository.save(order);
        
        orderTrackingRepository.save(OrderTrackingEvent.builder()
                .order(savedOrder)
                .status(newStatus)
                .description(description)
                .location(location)
                .build());
                
        notificationService.sendOrderStatusUpdate(order.getUser(), order.getOrderNumber(), newStatus.toString());
                
        return convertToDTO(savedOrder);
    }

    public List<OrderTrackingDTO> getOrderTracking(Long orderId) {
        return orderTrackingRepository.findByOrderIdOrderByCreatedAtDesc(orderId).stream()
                .map(event -> OrderTrackingDTO.builder()
                        .id(event.getId())
                        .status(event.getStatus().toString())
                        .description(event.getDescription())
                        .location(event.getLocation())
                        .createdAt(event.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
    
    public List<UserStatsDTO> getAllUserStats() {
        return userRepository.findAll().stream().map(user -> {
            // Find orders for this user
            List<Order> userOrders = orderRepository.findByUserId(user.getId(), PageRequest.of(0, 1000)).getContent();
            double totalSpent = userOrders.stream().mapToDouble(Order::getTotalPrice).sum();
            return UserStatsDTO.builder()
                    .userId(user.getId())
                    .name(user.getName())
                    .email(user.getEmail())
                    .orderCount(userOrders.size())
                    .totalSpent(totalSpent)
                    .build();
        }).collect(Collectors.toList());
    }

    @Cacheable(cacheNames = "admin_dashboard")
    public AdminDashboardDTO getAdminDashboardStats() {
        long totalOrders = orderRepository.count();
        double totalRevenue = orderRepository.findAll().stream()
                .mapToDouble(Order::getTotalPrice)
                .sum();
        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();

        return AdminDashboardDTO.builder()
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue)
                .totalUsers(totalUsers)
                .totalProducts(totalProducts)
                .build();
    }

    private OrderDTO convertToDTO(Order order) {
        List<OrderItemDTO> items = order.getOrderItems().stream().map(item -> 
            OrderItemDTO.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .size(item.getSize())
                .color(item.getColor())
                .build()
        ).collect(Collectors.toList());

        return OrderDTO.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .subtotal(order.getSubtotal())
                .taxAmount(order.getTaxAmount())
                .shippingCost(order.getShippingCost())
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus().toString())
                .paymentMethod(order.getPaymentMethod())
                .shippingAddress(order.getShippingAddress())
                .userId(order.getUser().getId())
                .userName(order.getUser().getName())
                .userEmail(order.getUser().getEmail())
                .orderItems(items)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
