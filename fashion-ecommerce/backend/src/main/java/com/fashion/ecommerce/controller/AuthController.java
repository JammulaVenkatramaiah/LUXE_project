package com.fashion.ecommerce.controller;

import com.fashion.ecommerce.dto.*;
import com.fashion.ecommerce.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse.Response<AuthResponse>> login(
            @Valid @RequestBody AuthRequest loginRequest) {
        AuthResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(new ApiResponse.Response<>(true, "Login successful", response));
    }
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse.Response<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest registerRequest) {
        AuthResponse response = authService.register(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse.Response<>(true, "Registration successful", response));
    }
    
    @GetMapping("/validate")
    public ResponseEntity<ApiResponse.Response<Boolean>> validateToken() {
        return ResponseEntity.ok(new ApiResponse.Response<>(true, "Token is valid", true));
    }
}
