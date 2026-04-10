package com.fashion.ecommerce.repository;

import com.fashion.ecommerce.entity.OrderTrackingEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderTrackingRepository extends JpaRepository<OrderTrackingEvent, Long> {
    List<OrderTrackingEvent> findByOrderIdOrderByCreatedAtDesc(Long orderId);
}
