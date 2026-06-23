package com.shopclone.backend.controller;

import com.shopclone.backend.dto.ProductRequest;
import com.shopclone.backend.dto.ProductResponse;
import com.shopclone.backend.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // Public — anyone can browse/search/filter products
    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductResponse> products = productService.getProducts(category, search, pageable);
        return ResponseEntity.ok(products);
    }

    // Public — view a single product's details
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable @NonNull String id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    // Admin only — create a new product
    @PostMapping("/admin")
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        ProductResponse response = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Admin only — update an existing product
    @PutMapping("/admin/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable @NonNull String id,
            @Valid @RequestBody ProductRequest request
    ) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    // Admin only — soft-delete a product
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable @NonNull String id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}