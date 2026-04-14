package com.fashion.ecommerce.service;
 
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);
 

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
        try {
            logger.info("DEBUG: Creating order for user ID: {}", userId);
            
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> {
                        logger.error("DEBUG: User not found for ID: {}", userId);
                        return new ResourceNotFoundException("User not found");
                    });

            CartDTO cart = cartService.getCart(userId);
            if (cart == null || cart.getCartItems() == null || cart.getCartItems().isEmpty()) {
                logger.warn("DEBUG: Empty cart for user: {}", userId);
                throw new BadRequestException("Cannot place an order with an empty cart");
            }
            
            logger.info("DEBUG: Cart contains {} items, total price: {}", 
                     cart.getCartItems().size(), cart.getTotalPrice());

            // Validate stock before processing
            for (CartItemDTO item : cart.getCartItems()) {
                Product product = productRepository.findById(item.getProductId())
                        .orElseThrow(() -> {
                            logger.error("DEBUG: Product not found: {}", item.getProductId());
                            return new ResourceNotFoundException("Product not found: " + item.getProductId());
                        });
                
                logger.info("DEBUG: Checking stock for product: {} (ID: {}). Requested: {}, Available: {}", 
                         product.getName(), product.getId(), item.getQuantity(), product.getStockQuantity());
                         
                if (product.getStockQuantity() < item.getQuantity()) {
                    logger.warn("DEBUG: Insufficient stock for product: {}", product.getName());
                    throw new BadRequestException("Insufficient stock for product: " + product.getName());
                }
            }

            // Calculations
            double subtotal = cart.getTotalPrice() != null ? cart.getTotalPrice() : 0.0;
            double taxAmount = subtotal * 0.05;
            double shippingCost = subtotal > 100 ? 0.0 : 10.0;
            double totalPrice = subtotal + taxAmount + shippingCost;
            
            logger.info("DEBUG: Order Summary - Subtotal: {}, Tax: {}, Shipping: {}, Total: {}", 
                     subtotal, taxAmount, shippingCost, totalPrice);

            // Create Order
            Order order = Order.builder()
                    .user(user)
                    .orderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                    .shippingAddress(request.getShippingAddress())
                    .paymentMethod(request.getPaymentMethod())
                    .subtotal(subtotal)
                    .taxAmount(taxAmount)
                    .shippingCost(shippingCost)
                    .totalPrice(totalPrice)
                    .status(OrderStatus.PENDING)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            logger.info("DEBUG: Saving order with number: {}", order.getOrderNumber());
            Order savedOrder = orderRepository.save(order);
            
            orderTrackingRepository.save(OrderTrackingEvent.builder()
                    .order(savedOrder)
                    .status(OrderStatus.PENDING)
                    .description("Order successfully placed")
                    .location("Online")
                    .build());

            // Create Order Items and Update Stock
            logger.info("DEBUG: Processing {} order items", cart.getCartItems().size());
            List<OrderItem> orderItems = cart.getCartItems().stream().map(cartItem -> {
                Product product = productRepository.findById(cartItem.getProductId())
                        .orElseThrow(() -> new ResourceNotFoundException("Product disappeared during processing: " + cartItem.getProductId()));
                
                // Deduct Stock
                int newStock = product.getStockQuantity() - cartItem.getQuantity();
                logger.info("DEBUG: Updating stock for {}: {} -> {}", product.getName(), product.getStockQuantity(), newStock);
                product.setStockQuantity(newStock);
                productRepository.save(product);

                return OrderItem.builder()
                        .order(savedOrder)
                        .product(product)
                        .quantity(cartItem.getQuantity())
                        .unitPrice(cartItem.getPrice() != null ? cartItem.getPrice() : product.getPrice())
                        .size(cartItem.getSize())
                        .color(cartItem.getColor())
                        .createdAt(LocalDateTime.now())
                        .build();
            }).collect(Collectors.toList());

            orderItemRepository.saveAll(orderItems);
            savedOrder.setOrderItems(orderItems);

            // Clear Cart
            logger.info("DEBUG: Clearing cart for user: {}", userId);
            cartService.clearCart(userId);
            
            // Asynchronously notify user
            try {
                notificationService.sendOrderConfirmation(user, savedOrder.getOrderNumber());
            } catch (Exception e) {
                logger.error("DEBUG: Failed to send notification (non-fatal): {}", e.getMessage());
            }

            logger.info("DEBUG: Order created successfully: {}", savedOrder.getId());
            return convertToDTO(savedOrder);
        } catch (Exception e) {
            logger.error("CRITICAL: Error creating order for user {}: {}", userId, e.getMessage(), e);
            throw e;
        }
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
        
        // Non-fatal notification failure
        try {
            notificationService.sendOrderStatusUpdate(order.getUser(), order.getOrderNumber(), "CONFIRMED");
        } catch (Exception e) {
            logger.error("DEBUG: Failed to send status update notification (non-fatal): {}", e.getMessage());
        }
        
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
        
        // Non-fatal notification failure
        try {
            notificationService.sendOrderStatusUpdate(order.getUser(), order.getOrderNumber(), "CANCELLED (Rejected: " + reason + ")");
        } catch (Exception e) {
            logger.error("DEBUG: Failed to send status update notification (non-fatal): {}", e.getMessage());
        }
        
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
                
        // Non-fatal notification failure
        try {
            notificationService.sendOrderStatusUpdate(order.getUser(), order.getOrderNumber(), newStatus.toString());
        } catch (Exception e) {
            logger.error("DEBUG: Failed to send status update notification (non-fatal): {}", e.getMessage());
        }
                
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
