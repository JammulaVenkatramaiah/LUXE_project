package com.fashion.ecommerce.service;

import com.fashion.ecommerce.entity.NotificationLog;
import com.fashion.ecommerce.entity.NotificationType;
import com.fashion.ecommerce.entity.User;
import com.fashion.ecommerce.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Async
    public void sendOrderConfirmation(User user, String orderNumber) {
        // Simulate sending email
        System.out.println("ASYNC: Sending Order Confirmation Email to " + user.getEmail());
        
        NotificationLog log = NotificationLog.builder()
                .recipient(user)
                .type(NotificationType.EMAIL)
                .subject("Order Confirmation: " + orderNumber)
                .message("Thank you " + user.getName() + ", your order " + orderNumber + " has been successfully placed.")
                .sentSuccessfully(true)
                .build();
                
        notificationRepository.save(log);
    }
    
    @Async
    public void sendOrderStatusUpdate(User user, String orderNumber, String status) {
        // Simulate sending SMS
        System.out.println("ASYNC: Sending Status SMS to " + user.getName() + " - " + status);
        
        NotificationLog log = NotificationLog.builder()
                .recipient(user)
                .type(NotificationType.SMS)
                .subject("Order Update: " + orderNumber)
                .message("Your order " + orderNumber + " is now: " + status)
                .sentSuccessfully(true)
                .build();
                
        notificationRepository.save(log);
    }
}
