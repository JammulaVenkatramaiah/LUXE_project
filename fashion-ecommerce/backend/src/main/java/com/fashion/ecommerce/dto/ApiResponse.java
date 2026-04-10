package com.fashion.ecommerce.dto;

import lombok.*;

public class ApiResponse {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response<T> {
        private boolean success;
        private String message;
        private T data;
        private long timestamp;
        private String path;

        public Response(boolean success, String message, T data) {
            this.success = success;
            this.message = message;
            this.data = data;
            this.timestamp = System.currentTimeMillis();
        }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PageResponse<T> {
        private T content;
        private int pageNumber;
        private int pageSize;
        private long totalElements;
        private int totalPages;
        private boolean last;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ErrorResponse {
        private boolean success;
        private String message;
        private String error;
        private long timestamp;
    }
}
