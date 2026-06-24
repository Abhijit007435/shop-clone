package com.shopclone.backend.repository;

import com.shopclone.backend.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository
        extends MongoRepository<Review, String> {

    List<Review> findByProductIdOrderByCreatedAtDesc(
            String productId
    );

    Optional<Review> findByProductIdAndUserId(
            String productId,
            String userId
    );
}