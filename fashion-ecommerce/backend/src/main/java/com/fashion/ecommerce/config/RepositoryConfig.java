package com.fashion.ecommerce.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

@Configuration
@EnableJpaRepositories(
    basePackages = "com.fashion.ecommerce.repository",
    excludeFilters = @ComponentScan.Filter(
        type = FilterType.REGEX, 
        pattern = "com\\.fashion\\.ecommerce\\.repository\\.search\\..*"
    )
)
@EnableElasticsearchRepositories(
    basePackages = "com.fashion.ecommerce.repository.search"
)
public class RepositoryConfig {
}
