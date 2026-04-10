package com.fashion.ecommerce.controller;

import com.fashion.ecommerce.dto.*;
import com.fashion.ecommerce.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CartController {
    
    @Autowired
    private CartService cartService;
    
    @Autowired
    private com.fashion.ecommerce.repository.UserRepository userRepository;
    
    private Long getCurrentUserId() {
        org.springframework.security.core.Authentication authentication = 
            org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new com.fashion.ecommerce.exceptions.UnauthorizedException("User not authenticated");
        }
        
        String email = authentication.getName(); // In our CustomUserDetailsService, email is used as username
        return userRepository.findByEmail(email)
                .map(com.fashion.ecommerce.entity.User::getId)
                .orElseThrow(() -> new com.fashion.ecommerce.exceptions.ResourceNotFoundException("User not found"));
    }
    
    @PostMapping("/add")
    public ResponseEntity<ApiResponse.Response<CartDTO>> addToCart(
            @Valid @RequestBody AddToCartRequest request) {
        Long userId = getCurrentUserId();
        CartDTO cart = cartService.addToCart(userId, request.getProductId(), 
                request.getQuantity(), request.getSize(), request.getColor());
        return ResponseEntity.ok(new ApiResponse.Response<>(true, "Item added to cart", cart));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse.Response<CartDTO>> getCart() {
        Long userId = getCurrentUserId();
        CartDTO cart = cartService.getCart(userId);
        return ResponseEntity.ok(new ApiResponse.Response<>(true, "Cart retrieved", cart));
    }
    
    @DeleteMapping("/item/{cartItemId}")
    public ResponseEntity<ApiResponse.Response<Void>> removeFromCart(
            @PathVariable Long cartItemId) {
        Long userId = getCurrentUserId();
        cartService.removeFromCart(userId, cartItemId);
        return ResponseEntity.ok(new ApiResponse.Response<>(true, "Item removed from cart", null));
    }
    
    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse.Response<CartDTO>> clearCart() {
        Long userId = getCurrentUserId();
        CartDTO cart = cartService.clearCart(userId);
        return ResponseEntity.ok(new ApiResponse.Response<>(true, "Cart cleared", cart));
    }
}
