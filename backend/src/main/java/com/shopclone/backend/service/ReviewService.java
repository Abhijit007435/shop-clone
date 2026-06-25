package com.shopclone.backend.service;

import com.shopclone.backend.dto.ReviewRequest;
import com.shopclone.backend.dto.ReviewResponse;
import com.shopclone.backend.model.Product;
import com.shopclone.backend.model.Review;
import com.shopclone.backend.model.User;
import com.shopclone.backend.repository.ProductRepository;
import com.shopclone.backend.repository.ReviewRepository;
import com.shopclone.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    private String getCurrentUserId() {
        return SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
    }

    @SuppressWarnings("null")
    public ReviewResponse addReview(
            ReviewRequest request
    ) {

        Product product = productRepository
                .findById(request.getProductId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Product not found"));

        String userId = getCurrentUserId();

        reviewRepository
                .findByProductIdAndUserId(
                        request.getProductId(),
                        userId
                )
                .ifPresent(review -> {
                    throw new IllegalArgumentException(
                            "You have already reviewed this product");
                });

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"));

        Review review = Review.builder()
                .productId(product.getId())
                .userId(userId)
                .userName(user.getFullName())
                .rating(request.getRating())
                .comment(request.getComment())
                .createdAt(LocalDateTime.now())
                .build();

        Review savedReview =
                reviewRepository.save(review);

        updateProductRating(product);

        return toResponse(savedReview);
    }

    public List<ReviewResponse> getProductReviews(
            String productId
    ) {

        return reviewRepository
                .findByProductIdOrderByCreatedAtDesc(productId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private void updateProductRating(
            Product product
    ) {

        List<Review> reviews =
                reviewRepository.findByProductIdOrderByCreatedAtDesc(
                        product.getId());

        double average =
                reviews.stream()
                        .mapToInt(Review::getRating)
                        .average()
                        .orElse(0);

        product.setAverageRating(
                Math.round(average * 100) / 100.0);

        product.setNumberOfReviews(
                reviews.size());

        productRepository.save(product);
    }

    private ReviewResponse toResponse(
            Review review
    ) {

        return ReviewResponse.builder()
                .reviewId(review.getId())
                .productId(review.getProductId())
                .userName(review.getUserName())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}