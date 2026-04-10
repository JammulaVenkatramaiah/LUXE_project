package com.fashion.ecommerce.repository;

import com.fashion.ecommerce.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {
    
    Optional<Coupon> findByCode(String code);
    
    Optional<Coupon> findByCodeAndIsActiveTrueAndValidFromBeforeAndValidToAfter(
            String code, LocalDateTime before, LocalDateTime after);
}
