package com.fashion.ecommerce.service;

import com.fashion.ecommerce.entity.Category;
import com.fashion.ecommerce.exceptions.ResourceNotFoundException;
import com.fashion.ecommerce.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.Cacheable;
import java.util.List;

@Service
@CacheConfig(cacheNames = "categories")
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Cacheable
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryBySlug(String slug) {
        return categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with slug: " + slug));
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }
}
