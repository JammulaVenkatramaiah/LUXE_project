package com.fashion.ecommerce.service;

import com.fashion.ecommerce.entity.InventoryMovement;
import com.fashion.ecommerce.entity.Product;
import com.fashion.ecommerce.entity.Supplier;
import com.fashion.ecommerce.repository.InventoryMovementRepository;
import com.fashion.ecommerce.repository.ProductRepository;
import com.fashion.ecommerce.repository.SupplierRepository;
import com.fashion.ecommerce.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InventoryService {

    @Autowired
    private InventoryMovementRepository inventoryMovementRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public InventoryMovement restockProduct(Long productId, Long supplierId, Integer quantityAdded) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));

        product.setStockQuantity(product.getStockQuantity() + quantityAdded);
        Product savedProduct = productRepository.save(product);

        InventoryMovement movement = InventoryMovement.builder()
                .product(savedProduct)
                .supplier(supplier)
                .quantityChange(quantityAdded)
                .reason("Supplier Restock")
                .build();

        InventoryMovement savedMovement = inventoryMovementRepository.save(movement);
        
        // Check for low stock alerts
        checkAndNotifyLowStock(savedProduct);
        
        return savedMovement;
    }

    private void checkAndNotifyLowStock(Product product) {
        int threshold = 10;
        if (product.getStockQuantity() < threshold) {
            System.out.println("LOW STOCK ALERT: Product " + product.getName() + " is below threshold (" + product.getStockQuantity() + ")");
            // In a real app, this would send an email to the admin
        }
    }
}
