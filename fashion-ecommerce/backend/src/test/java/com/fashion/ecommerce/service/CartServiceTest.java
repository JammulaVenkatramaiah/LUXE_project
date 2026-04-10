package com.fashion.ecommerce.service;

import com.fashion.ecommerce.dto.CartDTO;
import com.fashion.ecommerce.entity.Cart;
import com.fashion.ecommerce.entity.CartItem;
import com.fashion.ecommerce.entity.Product;
import com.fashion.ecommerce.entity.User;
import com.fashion.ecommerce.repository.CartItemRepository;
import com.fashion.ecommerce.repository.CartRepository;
import com.fashion.ecommerce.repository.ProductRepository;
import com.fashion.ecommerce.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CartService cartService;

    private User mockUser;
    private Product mockProduct;
    private Cart mockCart;

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("test@example.com");

        mockProduct = Product.builder()
                .id(101L)
                .name("Test Dress")
                .price(100.0)
                .stockQuantity(50)
                .build();

        mockCart = Cart.builder()
                .id(201L)
                .user(mockUser)
                .cartItems(new ArrayList<>())
                .build();
    }

    @Test
    void getCart_ReturnsEmptyDTO_WhenUserHasNoCart() {
        when(cartRepository.findByUserId(mockUser.getId())).thenReturn(Optional.empty());

        CartDTO cartDTO = cartService.getCart(mockUser.getId());

        assertNotNull(cartDTO);
        assertEquals(0.0, cartDTO.getTotalPrice());
    }

    @Test
    void addToCart_AddsNewItemCorrectly() {
        when(userRepository.findById(mockUser.getId())).thenReturn(Optional.of(mockUser));
        when(productRepository.findById(mockProduct.getId())).thenReturn(Optional.of(mockProduct));
        when(cartRepository.findByUserId(mockUser.getId())).thenReturn(Optional.of(mockCart));
        when(cartItemRepository.findByCartIdAndProductIdAndSizeAndColor(any(), any(), any(), any()))
                .thenReturn(Optional.empty());

        CartDTO cartDTO = cartService.addToCart(mockUser.getId(), mockProduct.getId(), 2, "M", "Red");

        assertNotNull(cartDTO);
        verify(cartItemRepository).save(any(CartItem.class));
    }

    @Test
    void removeFromCart_DeletesItem() {
        CartItem item = new CartItem();
        item.setId(501L);
        item.setProduct(mockProduct);
        item.setCart(mockCart);
        
        when(cartRepository.findByUserId(mockUser.getId())).thenReturn(Optional.of(mockCart));
        when(cartItemRepository.findById(501L)).thenReturn(Optional.of(item));

        cartService.removeFromCart(mockUser.getId(), 501L);

        verify(cartItemRepository).delete(item);
    }
}
