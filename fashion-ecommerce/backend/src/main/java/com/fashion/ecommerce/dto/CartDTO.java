package com.fashion.ecommerce.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartDTO {

    private Long id;

    private List<CartItemDTO> cartItems;

    private Double totalPrice;

    private Long userId;

    // Manual getter and setter methods
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public List<CartItemDTO> getCartItems() { return cartItems; }
    public void setCartItems(List<CartItemDTO> cartItems) { this.cartItems = cartItems; }

    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}