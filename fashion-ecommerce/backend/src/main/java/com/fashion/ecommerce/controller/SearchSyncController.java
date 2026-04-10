package com.fashion.ecommerce.controller;

import com.fashion.ecommerce.dto.ApiResponse;
import com.fashion.ecommerce.entity.Product;
import com.fashion.ecommerce.repository.ProductRepository;
import com.fashion.ecommerce.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/search")
public class SearchSyncController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SearchService searchService;

    @PostMapping("/sync")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse.Response<String>> syncAllProducts() {
        List<Product> products = productRepository.findAll();
        products.forEach(searchService::syncProductToElastic);
        return ResponseEntity.ok(new ApiResponse.Response<>(true, "Synchronization started for " + products.size() + " products", null));
    }
}
