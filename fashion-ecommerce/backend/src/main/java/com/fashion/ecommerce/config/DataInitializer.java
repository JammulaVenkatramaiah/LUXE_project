package com.fashion.ecommerce.config;

import com.fashion.ecommerce.entity.Category;
import com.fashion.ecommerce.entity.Product;
import com.fashion.ecommerce.entity.User;
import com.fashion.ecommerce.entity.UserRole;
import com.fashion.ecommerce.repository.CategoryRepository;
import com.fashion.ecommerce.repository.ProductRepository;
import com.fashion.ecommerce.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(CategoryRepository categoryRepository, 
                           ProductRepository productRepository, 
                           UserRepository userRepository, 
                           PasswordEncoder passwordEncoder) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        try {
            System.out.println("DEBUG: DataInitializer running. Category count: " + categoryRepository.count());
            
            if (categoryRepository.count() == 0) {
                System.out.println("DEBUG: Seeding categories...");
                
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
                System.out.println("DEBUG: Categories seeded.");

                System.out.println("DEBUG: Seeding products...");
                
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

                Product p4 = Product.builder()
                        .name("Classic Black Blazer")
                        .description("Classic elegant blazer for formal occasions")
                        .price(149.99)
                        .category(men)
                        .brand("FormalWear")
                        .stockQuantity(100)
                        .rating(4.7)
                        .isFeatured(false)
                        .imageUrl("https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=1000&auto=format&fit=crop")
                        .build();

                Product p5 = Product.builder()
                        .name("Leather Handbag")
                        .description("Premium leather handbag")
                        .price(199.99)
                        .discountPrice(149.99)
                        .category(accessories)
                        .brand("LuxuryBags")
                        .stockQuantity(80)
                        .rating(4.9)
                        .isFeatured(true)
                        .imageUrl("https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1000&auto=format&fit=crop")
                        .build();

                Product p6 = Product.builder()
                        .name("Silk Scarf")
                        .description("Luxurious silk scarf with elegant pattern")
                        .price(59.99)
                        .category(accessories)
                        .brand("LuxuryBags")
                        .stockQuantity(200)
                        .rating(4.6)
                        .isFeatured(false)
                        .imageUrl("https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=1000&auto=format&fit=crop")
                        .build();

                productRepository.saveAll(List.of(p1, p2, p3, p4, p5, p6));
                System.out.println("DEBUG: Products seeded.");
            }

            // Ensure test users have correct passwords even if they exist
            userRepository.findByEmail("admin@fashion.com").ifPresentOrElse(
                u -> {
                    u.setPassword(passwordEncoder.encode("password123"));
                    userRepository.save(u);
                    System.out.println("DEBUG: Updated admin password.");
                },
                () -> {
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
                    System.out.println("DEBUG: Created admin user.");
                }
            );

            userRepository.findByEmail("john@example.com").ifPresentOrElse(
                u -> {
                    u.setPassword(passwordEncoder.encode("password123"));
                    userRepository.save(u);
                    System.out.println("DEBUG: Updated John Doe password.");
                },
                () -> {
                    LocalDateTime now = LocalDateTime.now();
                    User john = User.builder()
                            .name("John Doe")
                            .email("john@example.com")
                            .password(passwordEncoder.encode("password123"))
                            .role(UserRole.USER)
                            .isActive(true)
                            .createdAt(now)
                            .updatedAt(now)
                            .build();
                    userRepository.save(john);
                    System.out.println("DEBUG: Created John Doe user.");
                }
            );
        } catch (Exception e) {
            System.err.println("DEBUG: Error seeding data: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
