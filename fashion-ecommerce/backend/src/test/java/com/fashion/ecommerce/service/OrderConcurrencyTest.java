package com.fashion.ecommerce.service;

import com.fashion.ecommerce.dto.CreateOrderRequest;
import com.fashion.ecommerce.entity.Category;
import com.fashion.ecommerce.entity.Product;
import com.fashion.ecommerce.entity.User;
import com.fashion.ecommerce.repository.CategoryRepository;
import com.fashion.ecommerce.repository.ProductRepository;
import com.fashion.ecommerce.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@ActiveProfiles("test")
public class OrderConcurrencyTest {

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CartService cartService;

    private Long productId;

    @BeforeEach
    void setUp() {
        // Clear data
        productRepository.deleteAll();
        categoryRepository.deleteAll();
        userRepository.deleteAll();

        // Setup User (Committed)
        User user = User.builder()
                .name("Test User")
                .email("test@example.com")
                .password("password")
                .role(com.fashion.ecommerce.entity.UserRole.USER)
                .isActive(true)
                .build();
        user = userRepository.saveAndFlush(user);
        user.getId();

        // Setup Category (Committed)
        Category category = Category.builder()
                .name("Dresses")
                .slug("dresses")
                .isActive(true)
                .build();
        category = categoryRepository.saveAndFlush(category);

        // Setup Product with Stock = 1 (Committed)
        Product product = Product.builder()
                .name("Limited Dress")
                .description("Only one left!")
                .price(99.99)
                .stockQuantity(1)
                .category(category)
                .isActive(true)
                .build();
        product = productRepository.saveAndFlush(product);
        productId = product.getId();
    }

    @Test
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    void testConcurrentOrderPlacement() throws InterruptedException {
        int threadCount = 2;
        ExecutorService executorService = Executors.newFixedThreadPool(threadCount);
        CountDownLatch latch = new CountDownLatch(1);
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger conflictCount = new AtomicInteger(0);
        AtomicInteger otherErrorCount = new AtomicInteger(0);

        CreateOrderRequest request = CreateOrderRequest.builder()
                .shippingAddress("123 Test St")
                .paymentMethod("Credit Card")
                .build();

        for (int i = 0; i < threadCount; i++) {
            final int threadId = i;
            executorService.execute(() -> {
                try {
                    // Setup distinct User for each thread (Committed)
                    User threadUser = User.builder()
                            .name("Test User " + threadId)
                            .email("test" + threadId + "@example.com")
                            .password("password")
                            .role(com.fashion.ecommerce.entity.UserRole.USER)
                            .isActive(true)
                            .build();
                    threadUser = userRepository.saveAndFlush(threadUser);
                    Long currentUserId = threadUser.getId();

                    // Populate cart for this thread
                    cartService.addToCart(currentUserId, productId, 1, "M", "Red");

                    latch.await();
                    orderService.createOrder(currentUserId, request);
                    successCount.incrementAndGet();
                } catch (org.springframework.orm.ObjectOptimisticLockingFailureException
                        | org.hibernate.StaleObjectStateException e) {
                    conflictCount.incrementAndGet();
                } catch (Exception e) {
                    System.err
                            .println("Unexpected Error in thread: " + e.getClass().getName() + " - " + e.getMessage());
                    otherErrorCount.incrementAndGet();
                }
            });
        }

        latch.countDown();
        Thread.sleep(6000);
        executorService.shutdown();

        // Verify results
        System.out.println("Concurrency Outcomes - Success: " + successCount.get() + ", Conflicts: "
                + conflictCount.get() + ", Others: " + otherErrorCount.get());
        assertEquals(1, successCount.get(), "Only one order should succeed for a single item in stock");
        assertEquals(1, conflictCount.get(), "One thread should have been blocked by Optimistic Locking");

        // Verify final stock is 0
        Product finalProduct = productRepository.findById(productId).get();
        assertEquals(0, finalProduct.getStockQuantity(), "Stock should be reduced to 0");
    }
}
