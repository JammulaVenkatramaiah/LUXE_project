package com.fashion.ecommerce.service;

import com.fashion.ecommerce.dto.*;
import com.fashion.ecommerce.entity.*;
import com.fashion.ecommerce.repository.*;
import com.fashion.ecommerce.exceptions.BadRequestException;
import com.fashion.ecommerce.exceptions.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private OrderItemRepository orderItemRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private CartService cartService;
    @Mock
    private ProductRepository productRepository;
    @Mock
    private OrderTrackingRepository orderTrackingRepository;
    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private OrderService orderService;

    private User testUser;
    private Product testProduct;
    private CartDTO testCart;

    @BeforeEach
    void setUp() {
        testUser = User.builder().id(1L).email("john@example.com").build();
        testProduct = Product.builder().id(1L).name("Dress").price(100.0).stockQuantity(10).build();
        
        CartItemDTO cartItem = CartItemDTO.builder()
                .productId(1L)
                .productName("Dress")
                .quantity(2)
                .price(100.0)
                .build();
        
        testCart = CartDTO.builder()
                .cartItems(List.of(cartItem))
                .totalPrice(200.0)
                .build();
    }

    @Test
    void createOrder_Success() {
        CreateOrderRequest request = new CreateOrderRequest();
        request.setShippingAddress("123 Street");
        request.setPaymentMethod("Credit Card");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(cartService.getCart(1L)).thenReturn(testCart);
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> {
            Order o = i.getArgument(0);
            o.setId(100L);
            o.setOrderItems(Collections.emptyList()); // Avoid null pointer in convertToDTO
            return o;
        });

        OrderDTO result = orderService.createOrder(1L, request);

        assertNotNull(result);
        assertEquals("PENDING", result.getStatus());
        verify(cartService).clearCart(1L);
        verify(notificationService).sendOrderConfirmation(any(), anyString());
        // Verify stock deducted
        assertEquals(8, testProduct.getStockQuantity());
    }

    @Test
    void createOrder_EmptyCart() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(cartService.getCart(1L)).thenReturn(CartDTO.builder().cartItems(Collections.emptyList()).build());

        assertThrows(BadRequestException.class, () -> orderService.createOrder(1L, new CreateOrderRequest()));
    }

    @Test
    void createOrder_InsufficientStock() {
        testProduct.setStockQuantity(1);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(cartService.getCart(1L)).thenReturn(testCart);
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        assertThrows(BadRequestException.class, () -> orderService.createOrder(1L, new CreateOrderRequest()));
    }

    @Test
    void getOrderById_NotFound() {
        when(orderRepository.findById(999L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> orderService.getOrderById(999L));
    }
}
