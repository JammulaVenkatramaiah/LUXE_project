package com.fashion.ecommerce.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ImageService {

    @Value("${app.cdn.base-url:https://images.unsplash.com}")
    private String cdnBaseUrl;

    /**
     * Standardizes and optimizes image URLs for the frontend.
     * In a real CDN like Cloudinary or S3/CloudFront, this would add
     * transformation parameters (w_800, q_auto, f_auto).
     */
    public String getOptimizedUrl(String originalUrl, int width, int quality) {
        if (originalUrl == null || originalUrl.isEmpty()) {
            return "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=" + width;
        }

        // If it's a relative path, prepend CDN base URL
        String fullUrl = originalUrl.startsWith("http") ? originalUrl : cdnBaseUrl + originalUrl;

        // If it's an Unsplash URL, append optimization parameters
        if (fullUrl.contains("unsplash.com")) {
            String baseUrl = fullUrl.split("\\?")[0];
            return String.format("%s?auto=format&fit=crop&q=%d&w=%d", baseUrl, quality, width);
        }

        // Otherwise, return the full URL (could be extended for Cloudinary/Imgix etc.)
        return fullUrl;
    }

    public String getThumbnailUrl(String originalUrl) {
        return getOptimizedUrl(originalUrl, 200, 60);
    }

    public String getProductDetailUrl(String originalUrl) {
        return getOptimizedUrl(originalUrl, 1200, 90);
    }
}
