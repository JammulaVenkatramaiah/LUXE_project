package com.fashion.ecommerce.controller;

import com.fashion.ecommerce.dto.*;
import com.fashion.ecommerce.service.ProductService;
import com.fashion.ecommerce.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProductController {
    
    @Autowired
    private ProductService productService;

    @Autowired
    private SearchService searchService;
    
    @GetMapping
    public ResponseEntity<ApiResponse.Response<Page<ProductDTO>>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "DESC") String direction) {
        Page<ProductDTO> products = productService.getAllProducts(page, size, sort, direction);
        return ResponseEntity.ok(new ApiResponse.Response<>(true, "Products retrieved successfully", products));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse.Response<ProductDTO>> getProductById(@PathVariable Long id) {
        ProductDTO product = productService.getProductById(id);
        return ResponseEntity.ok(new ApiResponse.Response<>(true, "Product retrieved successfully", product));
    }
    
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse.Response<Page<ProductDTO>>> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<ProductDTO> products = productService.getProductsByCategory(categoryId, page, size);
        return ResponseEntity.ok(new ApiResponse.Response<>(true, "Products retrieved successfully", products));
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse.Response<Page<ProductDTO>>> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<ProductDTO> products = searchService.searchProducts(keyword, page, size);
        return ResponseEntity.ok(new ApiResponse.Response<>(true, "Search results", products));
    }
    
    @GetMapping("/filter")
    public ResponseEntity<ApiResponse.Response<Page<ProductDTO>>> filterProducts(
            @RequestParam Double minPrice,
            @RequestParam Double maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<ProductDTO> products = productService.filterProducts(minPrice, maxPrice, page, size);
        return ResponseEntity.ok(new ApiResponse.Response<>(true, "Filtered products", products));
    }
    
    @GetMapping("/featured")
    public ResponseEntity<ApiResponse.Response<List<ProductDTO>>> getFeaturedProducts() {
        List<ProductDTO> products = productService.getFeaturedProducts();
        return ResponseEntity.ok(new ApiResponse.Response<>(true, "Featured products", products));
    }
    
    @GetMapping("/trending")
    public ResponseEntity<ApiResponse.Response<List<ProductDTO>>> getTrendingProducts() {
        List<ProductDTO> products = productService.getTopRatedProducts();
        return ResponseEntity.ok(new ApiResponse.Response<>(true, "Trending products", products));
    }
    
    @GetMapping("/count")
    public ResponseEntity<ApiResponse.Response<Long>> getProductCount() {
        long count = productService.getProductCount();
        return ResponseEntity.ok(new ApiResponse.Response<>(true, "Total product count", count));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse.Response<ProductDTO>> createProduct(
            @Valid @RequestBody ProductDTO productDTO) {
        ProductDTO createdProduct = productService.createProduct(productDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse.Response<>(true, "Product created successfully", createdProduct));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse.Response<ProductDTO>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductDTO productDTO) {
        ProductDTO updatedProduct = productService.updateProduct(id, productDTO);
        return ResponseEntity.ok(new ApiResponse.Response<>(true, "Product updated successfully", updatedProduct));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse.Response<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(new ApiResponse.Response<>(true, "Product deleted successfully", null));
    }
}
