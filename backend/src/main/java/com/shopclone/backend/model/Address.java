package com.shopclone.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "addresses")
public class Address {

    @Id
    private String id;

    private String userId;

    private String fullName;

    private String phoneNumber;

    private String street;

    private String city;

    private String state;

    private String pincode;

    private String country;

    @Builder.Default
    private boolean defaultAddress = false;

    private LocalDateTime createdAt;
}