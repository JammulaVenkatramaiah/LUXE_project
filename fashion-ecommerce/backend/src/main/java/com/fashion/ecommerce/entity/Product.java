package com.fashion.ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import com.fashion.ecommerce.entity.listener.ProductSyncListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@EntityListeners(ProductSyncListener.class)
@Table(name = "products", indexes = {
    @Index(name = "idx_category", columnList = "category_id"),
    @Index(name = "idx_brand", columnList = "brand"),
    @Index(name = "idx_price", columnList = "price"),
    @Index(name = "idx_rating", columnList = "rating"),
    @Index(name = "idx_products_created_at", columnList = "created_at"),
    @Index(name = "idx_featured", columnList = "is_featured"),
    @Index(name = "idx_active", columnList = "is_active")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SuppressWarnings("unused")
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 200)
    private String name;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private Double price;
    
    @Column(name = "discount_price")
    private Double discountPrice;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    
    @Column(length = 100)
    private String brand;
    
    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity;
    
    @Column(columnDefinition = "DECIMAL(3,2) DEFAULT 0")
    private Double rating;
    
    @Column(name = "review_count")
    private Integer reviewCount;
    
    @Column(name = "image_url", length = 255)
    private String imageUrl;
    
    @Column(name = "is_featured")
    private Boolean isFeatured;
    
    @Column(name = "is_active")
    private Boolean isActive;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Version
    private Long version;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<ProductImage> images = new ArrayList<>();
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @Builder.Default
    private final Set<Review> reviews = new HashSet<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @Builder.Default
    private final Set<Wishlist> wishlists = new HashSet<>();
    @com.fasterxml.jackson.annotation.JsonProperty("categoryName")
    public String getCategoryName() {
        return category != null ? category.getName() : null;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        isActive = true;
        isFeatured = false;
        if (rating == null) rating = 0.0;
        if (reviewCount == null) reviewCount = 0;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
