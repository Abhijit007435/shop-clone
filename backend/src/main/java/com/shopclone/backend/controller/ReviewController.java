package com.shopclone.backend.controller;

import com.shopclone.backend.dto.ReviewRequest;
import com.shopclone.backend.dto.ReviewResponse;
import com.shopclone.backend.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ReviewResponse addReview(
            @Valid @RequestBody ReviewRequest request
    ) {
        return reviewService.addReview(request);
    }

    @GetMapping("/product/{productId}")
    public List<ReviewResponse> getProductReviews(
            @PathVariable String productId
    ) {
        return reviewService.getProductReviews(productId);
    }
}