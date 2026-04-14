package com.fashion.ecommerce.exceptions;

import com.fashion.ecommerce.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse.ErrorResponse> handleResourceNotFound(
            ResourceNotFoundException ex, WebRequest request) {
        ApiResponse.ErrorResponse error = new ApiResponse.ErrorResponse();
        error.setSuccess(false);
        error.setMessage(ex.getMessage());
        error.setError("Resource Not Found");
        error.setTimestamp(System.currentTimeMillis());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse.ErrorResponse> handleBadRequest(
            BadRequestException ex, WebRequest request) {
        ApiResponse.ErrorResponse error = new ApiResponse.ErrorResponse();
        error.setSuccess(false);
        error.setMessage(ex.getMessage());
        error.setError("Bad Request");
        error.setTimestamp(System.currentTimeMillis());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(org.springframework.security.authentication.BadCredentialsException.class)
    public ResponseEntity<ApiResponse.ErrorResponse> handleBadCredentials(
            org.springframework.security.authentication.BadCredentialsException ex, WebRequest request) {
        ApiResponse.ErrorResponse error = new ApiResponse.ErrorResponse();
        error.setSuccess(false);
        error.setMessage("Invalid email or password");
        error.setError("Authentication Failed");
        error.setTimestamp(System.currentTimeMillis());
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }
    
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse.ErrorResponse> handleUnauthorized(
            UnauthorizedException ex, WebRequest request) {
        ApiResponse.ErrorResponse error = new ApiResponse.ErrorResponse();
        error.setSuccess(false);
        error.setMessage(ex.getMessage());
        error.setError("Unauthorized");
        error.setTimestamp(System.currentTimeMillis());
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(
            MethodArgumentNotValidException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "Validation failed");
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        response.put("errors", errors);
        response.put("timestamp", System.currentTimeMillis());
        
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(org.springframework.orm.ObjectOptimisticLockingFailureException.class)
    public ResponseEntity<ApiResponse.ErrorResponse> handleConflict(
            org.springframework.orm.ObjectOptimisticLockingFailureException ex, WebRequest request) {
        ApiResponse.ErrorResponse error = new ApiResponse.ErrorResponse();
        error.setSuccess(false);
        error.setMessage("The product stock was updated by another user. Please refresh and try again.");
        error.setError("Concurrency Conflict");
        error.setTimestamp(System.currentTimeMillis());
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse.ErrorResponse> handleGlobalException(
            Exception ex, WebRequest request) {
        ex.printStackTrace(); // Log stack trace to console for Render logs
        ApiResponse.ErrorResponse error = new ApiResponse.ErrorResponse();
        error.setSuccess(false);
        error.setMessage("An unexpected error occurred");
        error.setError(ex.getClass().getSimpleName() + ": " + ex.getMessage());
        error.setTimestamp(System.currentTimeMillis());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
