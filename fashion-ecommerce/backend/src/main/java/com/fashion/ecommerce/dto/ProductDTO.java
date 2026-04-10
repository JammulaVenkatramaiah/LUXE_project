package com.fashion.ecommerce.dto;

import lombok.*;
import jakarta.validation.constraints.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {
    
    private Long id;
    
    @NotBlank(message = "Product name is required")
    private String name;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Double price;
    
    private Double discountPrice;
    
    @NotNull(message = "Category is required")
    private Long categoryId;
    
    private String categoryName;
    
    private String brand;
    
    @NotNull(message = "Stock quantity is required")
    @PositiveOrZero(message = "Stock must be positive or zero")
    private Integer stockQuantity;
    
    private Double rating;
    
    private Integer reviewCount;
    
    private String imageUrl;
    
    private Boolean isFeatured;
    
    private Boolean isActive;
    
    private java.time.LocalDateTime createdAt;
    
    private java.time.LocalDateTime updatedAt;

    // Manual getter and setter methods for methods used in ProductService
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Double getDiscountPrice() { return discountPrice; }
    public void setDiscountPrice(Double discountPrice) { this.discountPrice = discountPrice; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public java.time.LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(java.time.LocalDateTime createdAt) { this.createdAt = createdAt; }

    public java.time.LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(java.time.LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Manual builder method since Lombok @Builder is not working
    public static ProductDTOBuilder builder() {
        return new ProductDTOBuilder();
    }

    public static class ProductDTOBuilder {
        private Long id;
        private String name;
        private String description;
        private Double price;
        private Double discountPrice;
        private Long categoryId;
        private String categoryName;
        private String brand;
        private Integer stockQuantity;
        private Double rating;
        private Integer reviewCount;
        private String imageUrl;
        private Boolean isFeatured;
        private Boolean isActive;
        private java.time.LocalDateTime createdAt;
        private java.time.LocalDateTime updatedAt;

        public ProductDTOBuilder id(Long id) { this.id = id; return this; }
        public ProductDTOBuilder name(String name) { this.name = name; return this; }
        public ProductDTOBuilder description(String description) { this.description = description; return this; }
        public ProductDTOBuilder price(Double price) { this.price = price; return this; }
        public ProductDTOBuilder discountPrice(Double discountPrice) { this.discountPrice = discountPrice; return this; }
        public ProductDTOBuilder categoryId(Long categoryId) { this.categoryId = categoryId; return this; }
        public ProductDTOBuilder categoryName(String categoryName) { this.categoryName = categoryName; return this; }
        public ProductDTOBuilder brand(String brand) { this.brand = brand; return this; }
        public ProductDTOBuilder stockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; return this; }
        public ProductDTOBuilder rating(Double rating) { this.rating = rating; return this; }
        public ProductDTOBuilder reviewCount(Integer reviewCount) { this.reviewCount = reviewCount; return this; }
        public ProductDTOBuilder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public ProductDTOBuilder isFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; return this; }
        public ProductDTOBuilder isActive(Boolean isActive) { this.isActive = isActive; return this; }
        public ProductDTOBuilder createdAt(java.time.LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public ProductDTOBuilder updatedAt(java.time.LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public ProductDTO build() {
            ProductDTO dto = new ProductDTO();
            dto.setId(id);
            dto.setName(name);
            dto.setDescription(description);
            dto.setPrice(price);
            dto.setDiscountPrice(discountPrice);
            dto.setCategoryId(categoryId);
            dto.setCategoryName(categoryName);
            dto.setBrand(brand);
            dto.setStockQuantity(stockQuantity);
            dto.setRating(rating);
            dto.setReviewCount(reviewCount);
            dto.setImageUrl(imageUrl);
            dto.setIsFeatured(isFeatured);
            dto.setIsActive(isActive);
            dto.setCreatedAt(createdAt);
            dto.setUpdatedAt(updatedAt);
            return dto;
        }
    }
}
