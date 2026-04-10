package com.fashion.ecommerce.service;

import com.fashion.ecommerce.dto.ProductDTO;
import com.fashion.ecommerce.entity.Product;
import com.fashion.ecommerce.entity.Category;
import com.fashion.ecommerce.repository.ProductRepository;
import com.fashion.ecommerce.repository.CategoryRepository;
import com.fashion.ecommerce.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@CacheConfig(cacheNames = "products")
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private ImageService imageService;
    
    public long getProductCount() {
        return productRepository.count();
    }
    
    @CacheEvict(allEntries = true)
    public ProductDTO createProduct(ProductDTO productDTO) {
        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        
        Product product = Product.builder()
                .name(productDTO.getName())
                .description(productDTO.getDescription())
                .price(productDTO.getPrice())
                .discountPrice(productDTO.getDiscountPrice())
                .category(category)
                .brand(productDTO.getBrand())
                .stockQuantity(productDTO.getStockQuantity())
                .imageUrl(productDTO.getImageUrl())
                .isFeatured(Boolean.TRUE.equals(productDTO.getIsFeatured()))
                .isActive(!Boolean.FALSE.equals(productDTO.getIsActive()))
                .rating(0.0)
                .reviewCount(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }
    
    @Cacheable(key = "#productId")
    public ProductDTO getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return convertToDTO(product);
    }

    @Cacheable(key = "{#page, #size, #sort, #direction}")
    public Page<ProductDTO> getAllProducts(int page, int size, String sort, String direction) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction.toUpperCase());
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        return productRepository.findAll(pageable).map(this::convertToDTO);
    }
    
    @Cacheable(key = "{#categoryId, #page, #size}")
    public Page<ProductDTO> getProductsByCategory(Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findByCategoryIdAndIsActiveTrue(categoryId, pageable)
                .map(this::convertToDTO);
    }
    
    public Page<ProductDTO> searchProducts(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.searchProducts(keyword, pageable).map(this::convertToDTO);
    }
    
    public Page<ProductDTO> filterProducts(Double minPrice, Double maxPrice, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findByPriceRange(minPrice, maxPrice, pageable)
                .map(this::convertToDTO);
    }
    
    @Cacheable(cacheNames = "featured")
    public List<ProductDTO> getFeaturedProducts() {
        return productRepository.findByIsFeaturedTrueAndIsActiveTrueOrderByCreatedAtDesc()
                .stream().map(this::convertToDTO).collect(Collectors.toList());
    }
    
    public List<ProductDTO> getTopRatedProducts() {
        return productRepository.findTop10ByRatingGreaterThanAndIsActiveTrueOrderByRatingDesc(3.5)
                .stream().map(this::convertToDTO).collect(Collectors.toList());
    }
    
    @CacheEvict(key = "#productId", allEntries = true)
    public ProductDTO updateProduct(Long productId, ProductDTO productDTO) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        
        if (productDTO.getCategoryId() != null) {
            Category category = categoryRepository.findById(productDTO.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            product.setCategory(category);
        }
        
        if (productDTO.getName() != null) product.setName(productDTO.getName());
        if (productDTO.getDescription() != null) product.setDescription(productDTO.getDescription());
        if (productDTO.getPrice() != null) product.setPrice(productDTO.getPrice());
        if (productDTO.getDiscountPrice() != null) product.setDiscountPrice(productDTO.getDiscountPrice());
        if (productDTO.getBrand() != null) product.setBrand(productDTO.getBrand());
        if (productDTO.getStockQuantity() != null) product.setStockQuantity(productDTO.getStockQuantity());
        if (productDTO.getImageUrl() != null) product.setImageUrl(productDTO.getImageUrl());
        if (productDTO.getIsFeatured() != null) product.setIsFeatured(productDTO.getIsFeatured());
        if (productDTO.getIsActive() != null) product.setIsActive(productDTO.getIsActive());
        
        product.setUpdatedAt(LocalDateTime.now());
        
        Product updatedProduct = productRepository.save(product);
        return convertToDTO(updatedProduct);
    }
    
    @CacheEvict(key = "#productId", allEntries = true)
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        productRepository.delete(product);
    }
    
    private ProductDTO convertToDTO(Product product) {
        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .discountPrice(product.getDiscountPrice())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .brand(product.getBrand())
                .stockQuantity(product.getStockQuantity())
                .rating(product.getRating())
                .reviewCount(product.getReviewCount())
                .imageUrl(imageService.getOptimizedUrl(product.getImageUrl(), 800, 80))
                .isFeatured(product.getIsFeatured())
                .isActive(product.getIsActive())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}
