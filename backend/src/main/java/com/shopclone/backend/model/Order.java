package com.shopclone.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "orders")
public class Order {

    @Id
    private String id;

    private String userId;
    private ShippingAddress shippingAddress;

    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    private double totalAmount;

    private String status;

    private LocalDateTime orderedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItem {

        private String productId;

        private String productName;

        private double priceAtOrderTime;

        private String imageUrl;

        private int quantity;

        private double subtotal;
    }
        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class ShippingAddress {

            private String fullName;
            private String phoneNumber;
            private String street;
            private String city;
            private String state;
            private String pincode;
            private String country;
        }
}