package com.fashion.ecommerce.controller;

import com.fashion.ecommerce.dto.ApiResponse;
import com.fashion.ecommerce.dto.PaymentIntentRequest;
import com.fashion.ecommerce.dto.PaymentIntentResponse;
import com.fashion.ecommerce.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-payment-intent")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse.Response<PaymentIntentResponse>> createPaymentIntent(@Valid @RequestBody PaymentIntentRequest request) {
        PaymentIntentResponse response = paymentService.createPaymentIntent(request.getOrderId());
        return ResponseEntity.ok(ApiResponse.Response.<PaymentIntentResponse>builder()
                .success(true)
                .message("Payment intent created successfully")
                .data(response)
                .build());
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {
        
        paymentService.handleWebhookEvent(payload, sigHeader);
        return ResponseEntity.ok("Webhook processed");
    }
}
