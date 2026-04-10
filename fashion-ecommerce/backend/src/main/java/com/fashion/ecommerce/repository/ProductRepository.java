package com.fashion.ecommerce.repository;

import com.fashion.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    Page<Product> findByCategoryIdAndIsActiveTrue(Long categoryId, Pageable pageable);
    
    Page<Product> findByBrandAndIsActiveTrue(String brand, Pageable pageable);
    
    Page<Product> findByIsFeaturedTrueAndIsActiveTrue(Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "ORDER BY " +
           "CASE " +
           "  WHEN LOWER(p.name) LIKE LOWER(CONCAT(:keyword, '%')) THEN 1 " + // Starts with name
           "  WHEN LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) THEN 2 " + // Contains name
           "  ELSE 3 " + // Description/Brand match
           "END, p.name ASC")
    Page<Product> searchProducts(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND " +
           "p.price >= :minPrice AND p.price <= :maxPrice")
    Page<Product> findByPriceRange(@Param("minPrice") Double minPrice, 
                                   @Param("maxPrice") Double maxPrice, Pageable pageable);
    
    List<Product> findByIsFeaturedTrueAndIsActiveTrueOrderByCreatedAtDesc();
    
    List<Product> findTop10ByRatingGreaterThanAndIsActiveTrueOrderByRatingDesc(Double rating);
}
