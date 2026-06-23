package com.shopclone.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String fullName;

    @Indexed(unique = true)
    private String email;

    private String password; // stored as a bcrypt hash, never plain text

    @Builder.Default
    private Set<String> roles = new HashSet<>(); // e.g. "ROLE_USER", "ROLE_ADMIN"

    private String phoneNumber;

    @Builder.Default
    private boolean enabled = true;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}