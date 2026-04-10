package com.fashion.ecommerce.service;

import com.fashion.ecommerce.dto.PaymentIntentResponse;
import com.fashion.ecommerce.entity.Order;
import com.fashion.ecommerce.entity.OrderStatus;
import com.fashion.ecommerce.exceptions.BadRequestException;
import com.fashion.ecommerce.exceptions.ResourceNotFoundException;
import com.fashion.ecommerce.repository.OrderRepository;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderService orderService;

    public PaymentIntentResponse createPaymentIntent(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        try {
            // Amount in cents
            long amountInCents = Math.round(order.getTotalPrice() * 100);

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amountInCents)
                    .setCurrency("usd")
                    .putMetadata("orderId", String.valueOf(orderId))
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);

            return PaymentIntentResponse.builder()
                    .clientSecret(intent.getClientSecret())
                    .build();
            
        } catch (StripeException e) {
            throw new BadRequestException("Failed to create payment intent: " + e.getMessage());
        }
    }

    public void handleWebhookEvent(String payload, String sigHeader) {
        try {
            Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);

            switch (event.getType()) {
                case "payment_intent.succeeded":
                    PaymentIntent paymentIntent = (PaymentIntent) event.getDataObjectDeserializer().getObject().orElse(null);
                    if (paymentIntent != null && paymentIntent.getMetadata().containsKey("orderId")) {
                        Long orderId = Long.parseLong(paymentIntent.getMetadata().get("orderId"));
                        orderService.updateOrderStatus(orderId, OrderStatus.PAID, "Online Payment System", "Payment received via Stripe");
                    }
                    break;
                case "payment_intent.payment_failed":
                    PaymentIntent failedIntent = (PaymentIntent) event.getDataObjectDeserializer().getObject().orElse(null);
                    if (failedIntent != null && failedIntent.getMetadata().containsKey("orderId")) {
                        Long orderId = Long.parseLong(failedIntent.getMetadata().get("orderId"));
                        orderService.updateOrderStatus(orderId, OrderStatus.PAYMENT_PENDING, "Online Payment System", "Payment failed");
                    }
                    break;
                default:
                    // Unexpected event type
                    break;
            }
        } catch (SignatureVerificationException e) {
            throw new BadRequestException("Invalid webhook signature");
        } catch (Exception e) {
            throw new BadRequestException("Failed to process webhook: " + e.getMessage());
        }
    }
}
