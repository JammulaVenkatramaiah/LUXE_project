package com.fashion.ecommerce.service;

import com.fashion.ecommerce.dto.CartDTO;
import com.fashion.ecommerce.dto.CartItemDTO;
import com.fashion.ecommerce.entity.*;
import com.fashion.ecommerce.repository.*;
import com.fashion.ecommerce.exceptions.ResourceNotFoundException;
import com.fashion.ecommerce.exceptions.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartService {
    
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private CartItemRepository cartItemRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Transactional
    public CartDTO addToCart(Long userId, Long productId, Integer quantity, String size, String color) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        
        if (product.getStockQuantity() < quantity) {
            throw new BadRequestException("Insufficient stock available");
        }
        
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> cartRepository.save(Cart.builder()
                        .user(user)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build()));
        
        CartItem existingItem = cartItemRepository
                .findByCartIdAndProductIdAndSizeAndColor(cart.getId(), productId, size, color)
                .orElse(null);
        
        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            existingItem.setUpdatedAt(LocalDateTime.now());
            cartItemRepository.save(existingItem);
        } else {
            CartItem cartItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(quantity)
                    .price(product.getDiscountPrice() != null ? product.getDiscountPrice() : product.getPrice())
                    .size(size)
                    .color(color)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            cartItemRepository.save(cartItem);
        }
        
        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
        
        return getCart(userId);
    }
    
    public CartDTO getCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId).orElse(null);
        
        if (cart == null) {
            return CartDTO.builder()
                    .id(null)
                    .userId(userId)
                    .cartItems(java.util.Collections.emptyList())
                    .totalPrice(0.0)
                    .build();
        }
        
        List<CartItemDTO> items = cart.getCartItems().stream()
                .map(this::convertToDTO).collect(Collectors.toList());
        
        Double totalPrice = items.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
        
        return CartDTO.builder()
                .id(cart.getId())
                .cartItems(items)
                .totalPrice(totalPrice)
                .userId(userId)
                .build();
    }
    
    @Transactional
    public void removeFromCart(Long userId, Long cartItemId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        
        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Cart item does not belong to this cart");
        }
        
        cartItemRepository.delete(cartItem);
    }
    
    @Transactional
    public CartDTO clearCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        
        cart.getCartItems().clear();
        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
        
        return getCart(userId);
    }
    
    private CartItemDTO convertToDTO(CartItem item) {
        return CartItemDTO.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .productImage(item.getProduct().getImageUrl())
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .size(item.getSize())
                .color(item.getColor())
                .build();
    }
}
