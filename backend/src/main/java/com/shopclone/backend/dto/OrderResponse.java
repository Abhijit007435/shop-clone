package com.shopclone.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private ShippingAddressResponse shippingAddress;

    private String orderId;

    private List<OrderItemResponse> items;

    private double totalAmount;

    private String status;

    private LocalDateTime orderedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemResponse {
        

        private String productId;

        private String productName;

        private double priceAtOrderTime;

        private int quantity;

        private double subtotal;
    }
    @Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public static class ShippingAddressResponse {

    private String fullName;
    private String phoneNumber;
    private String street;
    private String city;
    private String state;
    private String pincode;
    private String country;
}
}