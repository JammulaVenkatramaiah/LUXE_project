package com.fashion.ecommerce.entity.listener;

import com.fashion.ecommerce.entity.Product;
import com.fashion.ecommerce.service.SearchService;
import jakarta.persistence.PostPersist;
import jakarta.persistence.PostRemove;
import jakarta.persistence.PostUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ProductSyncListener {

    private static SearchService searchService;

    @Autowired
    public void setSearchService(SearchService searchService) {
        ProductSyncListener.searchService = searchService;
    }

    @PostPersist
    @PostUpdate
    public void onPostPersistOrUpdate(Product product) {
        if (searchService != null) {
            searchService.syncProductToElastic(product);
        }
    }

    @PostRemove
    public void onPostRemove(Product product) {
        if (searchService != null) {
            searchService.deleteProductFromElastic(product.getId());
        }
    }
}
