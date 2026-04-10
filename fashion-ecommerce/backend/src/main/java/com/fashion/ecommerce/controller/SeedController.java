package com.fashion.ecommerce.controller;

import com.fashion.ecommerce.dto.ApiResponse;
import com.fashion.ecommerce.entity.Category;
import com.fashion.ecommerce.entity.Product;
import com.fashion.ecommerce.entity.User;
import com.fashion.ecommerce.entity.UserRole;
import com.fashion.ecommerce.repository.CategoryRepository;
import com.fashion.ecommerce.repository.ProductRepository;
import com.fashion.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/seed")
public class SeedController {

    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<ApiResponse.Response<String>> seedData() {
        try {
            // Only seed if empty
            if (categoryRepository.count() > 0) {
                return ResponseEntity.ok(new ApiResponse.Response<>(true, "Database already has data. Skipping seed.", "OK"));
            }

            Category men = Category.builder()
                    .name("Men")
                    .description("Premium mens clothing collection")
                    .imageUrl("https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=1000&auto=format&fit=crop")
                    .slug("men")
                    .build();
            Category women = Category.builder()
                    .name("Women")
                    .description("Elegant womens fashion collection")
                    .imageUrl("https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop")
                    .slug("women")
                    .build();
            Category accessories = Category.builder()
                    .name("Accessories")
                    .description("Premium accessories")
                    .imageUrl("https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop")
                    .slug("accessories")
                    .build();

            categoryRepository.saveAll(List.of(men, women, accessories));

            Product p1 = Product.builder()
                    .name("Premium Cotton T-Shirt")
                    .description("High quality 100% cotton t-shirt with modern design")
                    .price(49.99)
                    .discountPrice(39.99)
                    .category(men)
                    .brand("StyleBrand")
                    .stockQuantity(150)
                    .rating(4.5)
                    .isFeatured(true)
                    .imageUrl("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop")
                    .build();

            Product p2 = Product.builder()
                    .name("Slim Fit Jeans")
                    .description("Comfortable and stylish slim fit jeans")
                    .price(89.99)
                    .discountPrice(74.99)
                    .category(men)
                    .brand("DenimMax")
                    .stockQuantity(200)
                    .rating(4.3)
                    .isFeatured(true)
                    .imageUrl("https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1000&auto=format&fit=crop")
                    .build();

            Product p3 = Product.builder()
                    .name("Elegant Summer Dress")
                    .description("Light and breathable summer dress")
                    .price(79.99)
                    .category(women)
                    .brand("ElegantLine")
                    .stockQuantity(120)
                    .rating(4.8)
                    .isFeatured(true)
                    .imageUrl("https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop")
                    .build();

            productRepository.saveAll(List.of(p1, p2, p3));

            if (userRepository.count() == 0) {
                LocalDateTime now = LocalDateTime.now();
                User admin = User.builder()
                        .name("Admin User")
                        .email("admin@fashion.com")
                        .password(passwordEncoder.encode("password123"))
                        .role(UserRole.ADMIN)
                        .isActive(true)
                        .createdAt(now)
                        .updatedAt(now)
                        .build();
                userRepository.save(admin);
            }

            return ResponseEntity.ok(new ApiResponse.Response<>(true, "Data seeded successfully with Unsplash URLs.", "SUCCESS"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse.Response<>(false, "Seed failed: " + e.getMessage(), null));
        }
    }
}
