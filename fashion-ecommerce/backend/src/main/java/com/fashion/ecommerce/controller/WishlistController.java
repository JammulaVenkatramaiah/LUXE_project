package com.fashion.ecommerce.controller;

import com.fashion.ecommerce.dto.ApiResponse;
import com.fashion.ecommerce.entity.Wishlist;
import com.fashion.ecommerce.service.WishlistService;
import com.fashion.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "*", maxAge = 3600)
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @Autowired
    private UserRepository userRepository;

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

    @GetMapping
    public ResponseEntity<ApiResponse.Response<Page<Wishlist>>> getWishlist(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Long userId = getCurrentUserId();
        Page<Wishlist> wishlist = wishlistService.getUserWishlist(userId, PageRequest.of(page, size));
        return ResponseEntity.ok(new ApiResponse.Response<>(true, "Wishlist retrieved successfully", wishlist));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<ApiResponse.MessageResponse> addToWishlist(@PathVariable Long productId) {
        Long userId = getCurrentUserId();
        wishlistService.addToWishlist(userId, productId);
        return ResponseEntity.ok(new ApiResponse.MessageResponse(true, "Added to wishlist"));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse.MessageResponse> removeFromWishlist(@PathVariable Long productId) {
        Long userId = getCurrentUserId();
        wishlistService.removeFromWishlist(userId, productId);
        return ResponseEntity.ok(new ApiResponse.MessageResponse(true, "Removed from wishlist"));
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<ApiResponse.Response<Boolean>> checkWishlist(@PathVariable Long productId) {
        Long userId = getCurrentUserId();
        boolean exists = wishlistService.isInWishlist(userId, productId);
        return ResponseEntity.ok(new ApiResponse.Response<>(true, "Check completed", exists));
    }
}
