package com.fashion.ecommerce.service;

import com.fashion.ecommerce.dto.ProductDTO;
import com.fashion.ecommerce.entity.Category;
import com.fashion.ecommerce.entity.Product;
import com.fashion.ecommerce.exceptions.ResourceNotFoundException;
import com.fashion.ecommerce.repository.CategoryRepository;
import com.fashion.ecommerce.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ImageService imageService;

    @InjectMocks
    private ProductService productService;

    private Product mockProduct;
    private Category mockCategory;

    @BeforeEach
    void setUp() {
        mockCategory = new Category();
        mockCategory.setId(1L);
        mockCategory.setName("Dresses");

        mockProduct = Product.builder()
                .id(101L)
                .name("Silk Evening Gown")
                .price(299.99)
                .category(mockCategory)
                .imageUrl("gown.jpg")
                .isActive(true)
                .build();
    }

    @Test
    void getProductById_ReturnsProduct_WhenFound() {
        when(productRepository.findById(101L)).thenReturn(Optional.of(mockProduct));
        when(imageService.getOptimizedUrl(anyString(), anyInt(), anyInt())).thenReturn("optimized.jpg");

        ProductDTO result = productService.getProductById(101L);

        assertNotNull(result);
        assertEquals("Silk Evening Gown", result.getName());
        verify(productRepository).findById(101L);
    }

    @Test
    void getProductById_ThrowsException_WhenNotFound() {
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productService.getProductById(999L));
    }

    @Test
    void getAllProducts_ReturnsPagedData() {
        Page<Product> page = new PageImpl<>(Collections.singletonList(mockProduct));
        when(productRepository.findAll(any(PageRequest.class))).thenReturn(page);
        when(imageService.getOptimizedUrl(anyString(), anyInt(), anyInt())).thenReturn("optimized.jpg");

        Page<ProductDTO> result = productService.getAllProducts(0, 10, "name", "asc");

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Silk Evening Gown", result.getContent().get(0).getName());
    }

    @Test
    void createProduct_SavesAndReturnsDTO() {
        ProductDTO productDTO = ProductDTO.builder()
                .name("New Dress")
                .price(150.0)
                .categoryId(1L)
                .build();

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(mockCategory));
        when(productRepository.save(any(Product.class))).thenReturn(mockProduct);
        when(imageService.getOptimizedUrl(anyString(), anyInt(), anyInt())).thenReturn("optimized.jpg");

        ProductDTO result = productService.createProduct(productDTO);

        assertNotNull(result);
        verify(productRepository).save(any(Product.class));
    }
}
