package com.fashion.ecommerce.controller;

import com.fashion.ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SitemapController {

    @Autowired
    private ProductService productService;

    @GetMapping(value = "/sitemap.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public String getSitemap() {
        String baseUrl = "https://luxe-fashion.com"; // Configuration needed for production
        
        StringBuilder sitemap = new StringBuilder();
        sitemap.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
        sitemap.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");

        // Main Pages
        sitemap.append(createUrlElement(baseUrl + "/", "1.0"));
        sitemap.append(createUrlElement(baseUrl + "/products", "0.9"));
        sitemap.append(createUrlElement(baseUrl + "/cart", "0.8"));

        // Dynamic Product Pages
        // Using a large size to get all products for sitemap
        productService.getAllProducts(0, 1000, "createdAt", "DESC").getContent().forEach(product -> {
            sitemap.append(createUrlElement(baseUrl + "/products/" + product.getId(), "0.7"));
        });

        sitemap.append("</urlset>");
        return sitemap.toString();
    }

    private String createUrlElement(String url, String priority) {
        return "<url><loc>" + url + "</loc><priority>" + priority + "</priority><changefreq>weekly</changefreq></url>";
    }
}
