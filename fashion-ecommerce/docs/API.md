# API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
    "userId": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "expiresIn": 86400000
  }
}
```

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}

Response:
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
    "userId": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "USER",
    "expiresIn": 86400000
  }
}
```

### Validate Token
```http
GET /auth/validate
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Token is valid",
  "data": true
}
```

---

## 🏷️ Product Endpoints

### Get All Products
```http
GET /products?page=0&size=20&sort=createdAt&direction=DESC

Response:
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "content": [
      {
        "id": 1,
        "name": "Premium Cotton T-Shirt",
        "description": "High quality cotton t-shirt",
        "price": 49.99,
        "discountPrice": 39.99,
        "categoryId": 1,
        "categoryName": "Men",
        "brand": "StyleBrand",
        "stockQuantity": 150,
        "rating": 4.5,
        "reviewCount": 128,
        "imageUrl": "https://...",
        "isFeatured": true,
        "isActive": true,
        "createdAt": "2024-01-15T10:30:00",
        "updatedAt": "2024-01-20T15:45:00"
      }
    ],
    "pageNumber": 0,
    "pageSize": 20,
    "totalElements": 150,
    "totalPages": 8,
    "last": false
  }
}
```

### Get Product by ID
```http
GET /products/1

Response:
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "id": 1,
    "name": "Premium Cotton T-Shirt",
    ...
  }
}
```

### Get Products by Category
```http
GET /products/category/1?page=0&size=20

Response:
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": { ... }
}
```

### Search Products
```http
GET /products/search?keyword=shirt&page=0&size=20

Response:
{
  "success": true,
  "message": "Search results",
  "data": { ... }
}
```

### Filter Products by Price
```http
GET /products/filter?minPrice=20&maxPrice=100&page=0&size=20

Response:
{
  "success": true,
  "message": "Filtered products",
  "data": { ... }
}
```

### Get Featured Products
```http
GET /products/featured

Response:
{
  "success": true,
  "message": "Featured products",
  "data": [ ... ]
}
```

### Get Trending Products
```http
GET /products/trending

Response:
{
  "success": true,
  "message": "Trending products",
  "data": [ ... ]
}
```

### Create Product (Admin)
```http
POST /products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "discountPrice": 79.99,
  "categoryId": 1,
  "brand": "Brand Name",
  "stockQuantity": 100,
  "imageUrl": "https://..."
}

Response:
{
  "success": true,
  "message": "Product created successfully",
  "data": { ... }
}
```

---

## 🛒 Cart Endpoints

### Get Cart
```http
GET /cart
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Cart retrieved",
  "data": {
    "id": 1,
    "userId": 1,
    "cartItems": [
      {
        "id": 1,
        "productId": 1,
        "productName": "Premium Cotton T-Shirt",
        "productImage": "https://...",
        "quantity": 2,
        "price": 39.99,
        "size": "M",
        "color": "Black"
      }
    ],
    "totalPrice": 79.98
  }
}
```

### Add to Cart
```http
POST /cart/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": 1,
  "quantity": 2,
  "size": "M",
  "color": "Black"
}

Response:
{
  "success": true,
  "message": "Item added to cart",
  "data": { ... }
}
```

### Remove from Cart
```http
DELETE /cart/item/1
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Item removed from cart",
  "data": null
}
```

### Clear Cart
```http
DELETE /cart/clear
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Cart cleared",
  "data": { ... }
}
```

---

## 📦 Order Endpoints

### Create Order
```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "shippingAddress": "123 Main Street, New York, NY 10001",
  "couponCode": "WELCOME20",
  "paymentMethod": "CREDIT_CARD"
}

Response:
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": 1,
    "orderNumber": "ORD-2024-001",
    "totalPrice": 379.97,
    "status": "PENDING",
    ...
  }
}
```

### Get My Orders
```http
GET /orders/my-orders?page=0&size=10
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Orders retrieved",
  "data": {
    "content": [ ... ],
    "pageNumber": 0,
    "pageSize": 10,
    "totalElements": 5,
    "totalPages": 1,
    "last": true
  }
}
```

### Get Order by ID
```http
GET /orders/1
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Order retrieved",
  "data": {
    "id": 1,
    "orderNumber": "ORD-2024-001",
    ...
  }
}
```

---

## 🏷️ Category Endpoints

### Get All Categories
```http
GET /categories

Response:
{
  "success": true,
  "message": "Categories retrieved",
  "data": [
    {
      "id": 1,
      "name": "Men",
      "slug": "men",
      "imageUrl": "https://...",
      "description": "Men's collection",
      "isActive": true
    }
  ]
}
```

### Get Category by Slug
```http
GET /categories/men

Response:
{
  "success": true,
  "message": "Category retrieved",
  "data": { ... }
}
```

---

## 🎁 Coupon Endpoints

### Validate Coupon
```http
POST /coupons/validate
Content-Type: application/json

{
  "code": "WELCOME20",
  "cartTotal": 399.97
}

Response:
{
  "success": true,
  "message": "Coupon is valid",
  "data": {
    "code": "WELCOME20",
    "discountType": "PERCENTAGE",
    "discountValue": 20,
    "discountAmount": 79.99
  }
}
```

---

## ⭐ Review Endpoints

### Get Product Reviews
```http
GET /products/1/reviews?page=0&size=10

Response:
{
  "success": true,
  "message": "Reviews retrieved",
  "data": {
    "content": [
      {
        "id": 1,
        "productId": 1,
        "userId": 2,
        "rating": 5,
        "title": "Great quality!",
        "comment": "Excellent product, highly recommend!",
        "isVerifiedPurchase": true,
        "helpfulCount": 25,
        "createdAt": "2024-01-20T10:30:00"
      }
    ],
    "pageNumber": 0,
    "pageSize": 10,
    "totalElements": 45,
    "totalPages": 5,
    "last": false
  }
}
```

### Create Review
```http
POST /products/1/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "title": "Great quality!",
  "comment": "Excellent product, highly recommend!"
}

Response:
{
  "success": true,
  "message": "Review created successfully",
  "data": { ... }
}
```

---

## 📌 Wishlist Endpoints

### Get Wishlist
```http
GET /wishlist?page=0&size=20
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Wishlist retrieved",
  "data": {
    "content": [ ... ],
    "pageNumber": 0
  }
}
```

### Add to Wishlist
```http
POST /wishlist/1
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Item added to wishlist",
  "data": null
}
```

### Remove from Wishlist
```http
DELETE /wishlist/1
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Item removed from wishlist",
  "data": null
}
```

---

## 📊 Admin Endpoints

### Get All Orders (Admin)
```http
GET /admin/orders?page=0&size=20
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "message": "Orders retrieved",
  "data": { ... }
}
```

### Update Order Status (Admin)
```http
PATCH /admin/orders/1/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "SHIPPED"
}

Response:
{
  "success": true,
  "message": "Order status updated",
  "data": { ... }
}
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Email is required",
    "password": "Password must be at least 6 characters"
  },
  "timestamp": 1642000000000
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized",
  "error": "Invalid credentials",
  "timestamp": 1642000000000
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Product not found",
  "error": "Resource Not Found",
  "timestamp": 1642000000000
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "An unexpected error occurred",
  "error": "Error details",
  "timestamp": 1642000000000
}
```

---

## 🔄 Pagination

All list endpoints support pagination with parameters:
- `page` - Page number (0-indexed)
- `size` - Results per page (default: 20, max: 100)

Response includes:
- `pageNumber` - Current page
- `pageSize` - Results per page
- `totalElements` - Total items available
- `totalPages` - Total pages
- `last` - Is this the last page

---

## 🔐 Rate Limiting

Rate limits are applied to:
- Authentication endpoints: 5 requests per minute
- Public endpoints: 100 requests per minute
- Protected endpoints: 1000 requests per minute

Response includes `X-RateLimit-*` headers.

---

## 📝 Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Successful request |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 422 | Unprocessable Entity - Validation failed |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |
