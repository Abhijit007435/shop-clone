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
public class ProductResponse {

    private String id;
    private String name;
    private String description;
    private double price;
    private double discountPercentage;
    private double finalPrice; // computed: price after discount applied
    private String category;
    private String brand;
    private List<String> imageUrls;
    private int stockQuantity;
    private boolean inStock; // computed: stockQuantity > 0
    private double averageRating;
    private int numberOfReviews;
    private LocalDateTime createdAt;
}