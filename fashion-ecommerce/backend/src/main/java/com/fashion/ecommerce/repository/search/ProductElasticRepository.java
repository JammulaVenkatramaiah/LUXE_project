package com.fashion.ecommerce.repository.search;

import com.fashion.ecommerce.entity.search.ProductDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface ProductElasticRepository extends ElasticsearchRepository<ProductDocument, String> {
    @org.springframework.data.elasticsearch.annotations.Query(
        "{\"bool\": {\"should\": [" +
        "{\"match_phrase_prefix\": {\"name\": {\"query\": \"?0\", \"boost\": 5.0}}}, " + // Exact/Prefix name match is highest
        "{\"match\": {\"name\": {\"query\": \"?0\", \"boost\": 3.0}}}, " +           // General name match
        "{\"match\": {\"description\": {\"query\": \"?1\", \"boost\": 1.0}}}" +      // Description match is lowest
        "]}}"
    )
    Page<ProductDocument> findByNameOrDescription(String name, String description, Pageable pageable);
    Page<ProductDocument> findByCategoryName(String categoryName, Pageable pageable);
}
