package com.shopclone.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {

    private List<CartItemResponse> items;
    private int totalItems; // sum of all quantities
    private double totalPrice; // sum of (priceAtAddTime * quantity) across all items

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartItemResponse {
        private String productId;
        private String productName;
        private double priceAtAddTime;
        private String imageUrl;
        private int quantity;
        private double subtotal; // priceAtAddTime * quantity
        private boolean inStock; // re-checked live against the product at response time
        private int availableStock;
    }
}