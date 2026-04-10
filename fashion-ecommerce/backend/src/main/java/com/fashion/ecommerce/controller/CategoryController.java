package com.fashion.ecommerce.controller;

import com.fashion.ecommerce.dto.ApiResponse;
import com.fashion.ecommerce.entity.Category;
import com.fashion.ecommerce.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse.Response<List<Category>>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(new ApiResponse.Response<>(true, "Categories retrieved successfully", categories));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse.Response<Category>> getCategoryBySlug(@PathVariable String slug) {
        Category category = categoryService.getCategoryBySlug(slug);
        return ResponseEntity.ok(new ApiResponse.Response<>(true, "Category retrieved successfully", category));
    }
}
