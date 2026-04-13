package com.fashion.ecommerce.service;

import com.fashion.ecommerce.dto.ProductDTO;
import com.fashion.ecommerce.entity.Product;
import com.fashion.ecommerce.entity.search.ProductDocument;
import com.fashion.ecommerce.repository.ProductRepository;
import com.fashion.ecommerce.repository.search.ProductElasticRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SearchService {

    @Autowired(required = false)
    private ProductElasticRepository productElasticRepository;

    @Autowired
    private ProductRepository productRepository;

    @Cacheable(cacheNames = "products", key = "'search_' + #keyword + '_' + #page + '_' + #size")
    public Page<ProductDTO> searchProducts(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        try {
            if (productElasticRepository != null) {
                log.debug("Attempting Elasticsearch search for: {}", keyword);
                return productElasticRepository.findByNameOrDescription(keyword, keyword, pageable)
                        .map(this::convertToDTO);
            }
        } catch (Exception e) {
            log.error("Elasticsearch search failed: {}", e.getMessage());
        }
        
        log.debug("Using database fallback for: {}", keyword);
        return productRepository.searchProducts(keyword, pageable)
                .map(this::convertToProductDTO);
    }

    public void syncProductToElastic(Product product) {
        if (productElasticRepository == null) {
            return;
        }
        try {
            ProductDocument document = ProductDocument.builder()
                    .id(product.getId().toString())
                    .name(product.getName())
                    .description(product.getDescription())
                    .price(product.getPrice())
                    .categoryName(product.getCategoryName())
                    .brand(product.getBrand())
                    .rating(product.getRating())
                    .isFeatured(product.getIsFeatured())
                    .isActive(product.getIsActive())
                    .imageUrl(product.getImageUrl())
                    .createdAt(product.getCreatedAt())
                    .build();
            productElasticRepository.save(document);
        } catch (Exception e) {
            log.warn("Failed to sync product to Elasticsearch: {}", e.getMessage());
        }
    }

    public void deleteProductFromElastic(Long productId) {
        if (productElasticRepository == null) {
            return;
        }
        try {
            productElasticRepository.deleteById(productId.toString());
        } catch (Exception e) {
            log.warn("Failed to delete product from Elasticsearch: {}", e.getMessage());
        }
    }

    private ProductDTO convertToDTO(ProductDocument doc) {
        return ProductDTO.builder()
                .id(Long.parseLong(doc.getId()))
                .name(doc.getName()) 
                .description(doc.getDescription())
                .price(doc.getPrice())
                .categoryName(doc.getCategoryName())
                .brand(doc.getBrand())
                .rating(doc.getRating())
                .imageUrl(doc.getImageUrl())
                .isFeatured(doc.getIsFeatured())
                .isActive(doc.getIsActive())
                .createdAt(doc.getCreatedAt())
                .build();
    }

    private ProductDTO convertToProductDTO(Product product) {
        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .categoryName(product.getCategoryName())
                .brand(product.getBrand())
                .rating(product.getRating())
                .imageUrl(product.getImageUrl())
                .isFeatured(product.getIsFeatured())
                .isActive(product.getIsActive())
                .createdAt(product.getCreatedAt())
                .build();
    }
}
