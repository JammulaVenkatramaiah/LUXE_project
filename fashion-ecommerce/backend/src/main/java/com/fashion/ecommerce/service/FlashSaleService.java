package com.fashion.ecommerce.service;

import com.fashion.ecommerce.entity.FlashSale;
import com.fashion.ecommerce.entity.Product;
import com.fashion.ecommerce.repository.FlashSaleRepository;
import com.fashion.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FlashSaleService {

    @Autowired
    private FlashSaleRepository flashSaleRepository;

    @Autowired
    private ProductRepository productRepository;

    // Runs every minute to apply dynamic pricing
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void updateFlashSalePrices() {
        LocalDateTime now = LocalDateTime.now();
        List<FlashSale> activeSales = flashSaleRepository.findActiveFlashSales(now);
        
        // Reset old discounts first (a more robust version would track previous discounts)
        // For simplicity, any product in an active sale gets a discount applied.
        List<Product> allProducts = productRepository.findAll();
        for (Product p : allProducts) {
            final boolean[] inSale = {false};
            activeSales.forEach(sale -> {
                if (sale.getProducts().contains(p)) {
                    Double newPrice = p.getPrice() * (1 - (sale.getDiscountPercentage() / 100.0));
                    p.setDiscountPrice(newPrice);
                    inSale[0] = true;
                }
            });
            if (!inSale[0]) {
                // Not in active sale, remove flash discount
                // (Assumes discountPrice is exclusively for flash sales in this scope)
                p.setDiscountPrice(null); 
            }
        }
        productRepository.saveAll(allProducts);
    }
}
