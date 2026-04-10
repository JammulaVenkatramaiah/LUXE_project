package com.fashion.ecommerce.controller;

import com.fashion.ecommerce.dto.ApiResponse;
import com.fashion.ecommerce.dto.UserDTO;
import com.fashion.ecommerce.entity.User;
import com.fashion.ecommerce.security.JWTTokenProvider;
import com.fashion.ecommerce.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JWTTokenProvider jwtTokenProvider;

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse.Response<UserDTO>> getMe(
            @RequestHeader("Authorization") String token) {
        
        Long userId = jwtTokenProvider.getUserIdFromToken(token.substring(7));
        User user = authService.findUserById(userId);
        UserDTO userDTO = authService.mapToUserDTO(user);
        return ResponseEntity.ok(new ApiResponse.Response<>(true, "User profile retrieved", userDTO));
    }

    @PutMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse.Response<UserDTO>> updateProfile(
            @RequestHeader("Authorization") String token,
            @RequestBody User userDetails) {
        
        Long userId = jwtTokenProvider.getUserIdFromToken(token.substring(7));
        User updatedUser = authService.updateUserProfile(userId, userDetails);
        UserDTO userDTO = authService.mapToUserDTO(updatedUser);
        return ResponseEntity.ok(new ApiResponse.Response<>(true, "Profile updated successfully", userDTO));
    }

    @PutMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse.Response<Void>> changePassword(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, String> passwordRequest) {
        
        Long userId = jwtTokenProvider.getUserIdFromToken(token.substring(7));
        String oldPassword = passwordRequest.get("oldPassword");
        String newPassword = passwordRequest.get("newPassword");
        
        authService.changePassword(userId, oldPassword, newPassword);
        return ResponseEntity.ok(new ApiResponse.Response<>(true, "Password changed successfully", null));
    }
}
