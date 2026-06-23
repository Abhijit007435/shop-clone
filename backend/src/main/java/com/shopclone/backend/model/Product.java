package com.shopclone.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;


import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products")
public class Product {

    @Id
    private String id;

    @Indexed
    private String name;

    private String description;

    private  double price;

    @Builder.Default
    private  double discountPercentage = 0.0; // e.g. 15.0 = 15% off

    @Indexed
    private String category; // e.g. "Electronics", "Books", "Clothing"

    private String brand;

    @Builder.Default
    private List<String> imageUrls = new java.util.ArrayList<>();

    @Builder.Default
    private int stockQuantity = 0;

    @Builder.Default
    private double averageRating = 0.0;

    @Builder.Default
    private int numberOfReviews = 0;

    @Builder.Default
    private boolean active = true; // soft-delete / hide from listings without deleting

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}