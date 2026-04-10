package com.fashion.ecommerce.service;

import com.fashion.ecommerce.entity.SubscriptionPlan;
import com.fashion.ecommerce.entity.User;
import com.fashion.ecommerce.entity.UserSubscription;
import com.fashion.ecommerce.repository.SubscriptionPlanRepository;
import com.fashion.ecommerce.repository.UserSubscriptionRepository;
import com.fashion.ecommerce.repository.UserRepository;
import com.fashion.ecommerce.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class SubscriptionService {

    @Autowired
    private SubscriptionPlanRepository subscriptionPlanRepository;

    @Autowired
    private UserSubscriptionRepository userSubscriptionRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public UserSubscription subscribeUser(Long userId, Long planId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                
        SubscriptionPlan plan = subscriptionPlanRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription plan not found"));
                
        UserSubscription subscription = UserSubscription.builder()
                .user(user)
                .plan(plan)
                .startDate(LocalDateTime.now())
                .isActive(true)
                .nextBillingDate(LocalDateTime.now().plusMonths(1))
                .build();
                
        return userSubscriptionRepository.save(subscription);
    }
}
