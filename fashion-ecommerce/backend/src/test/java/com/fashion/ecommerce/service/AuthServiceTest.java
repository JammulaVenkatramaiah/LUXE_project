package com.fashion.ecommerce.service;

import com.fashion.ecommerce.dto.AuthRequest;
import com.fashion.ecommerce.dto.AuthResponse;
import com.fashion.ecommerce.dto.RegisterRequest;
import com.fashion.ecommerce.entity.User;
import com.fashion.ecommerce.entity.UserRole;
import com.fashion.ecommerce.exceptions.BadRequestException;
import com.fashion.ecommerce.exceptions.ResourceNotFoundException;
import com.fashion.ecommerce.repository.UserRepository;
import com.fashion.ecommerce.security.JWTTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JWTTokenProvider jwtTokenProvider;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .name("John Doe")
                .email("john@example.com")
                .password("encoded_password")
                .role(UserRole.USER)
                .isActive(true)
                .build();
    }

    @Test
    void login_Success() {
        AuthRequest loginRequest = new AuthRequest("john@example.com", "password123");
        
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(loginRequest.getPassword(), testUser.getPassword())).thenReturn(true);
        when(jwtTokenProvider.generateAccessToken(anyLong(), anyString(), anyString())).thenReturn("access_token");
        when(jwtTokenProvider.generateRefreshToken(anyLong(), anyString())).thenReturn("refresh_token");
        when(jwtTokenProvider.getJwtExpiration()).thenReturn(3600000);

        AuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("access_token", response.getToken());
        assertEquals("john@example.com", response.getEmail());
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void login_UserNotFound() {
        AuthRequest loginRequest = new AuthRequest("nonexistent@example.com", "password123");
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> authService.login(loginRequest));
    }

    @Test
    void register_Success() {
        RegisterRequest registerRequest = new RegisterRequest("Jane Doe", "jane@example.com", "password", "password");
        
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encoded_password");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(jwtTokenProvider.generateAccessToken(any(), anyString(), anyString())).thenReturn("access_token");
        when(jwtTokenProvider.generateRefreshToken(any(), anyString())).thenReturn("refresh_token");

        AuthResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertEquals("jane@example.com", response.getEmail());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_EmailAlreadyExists() {
        RegisterRequest registerRequest = new RegisterRequest("Jane Doe", "john@example.com", "password", "password");
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(registerRequest));
    }

    @Test
    void register_PasswordsDoNotMatch() {
        RegisterRequest registerRequest = new RegisterRequest("Jane Doe", "jane@example.com", "password", "wrong_password");

        assertThrows(BadRequestException.class, () -> authService.register(registerRequest));
    }
}
