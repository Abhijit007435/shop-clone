package com.shopclone.backend.service;

import com.shopclone.backend.dto.ProductRequest;
import com.shopclone.backend.dto.ProductResponse;
import com.shopclone.backend.model.Product;
import com.shopclone.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final MongoTemplate mongoTemplate;

    @SuppressWarnings("null")
    public ProductResponse createProduct(ProductRequest request) {
        if (productRepository.existsByBrandIgnoreCaseAndNameIgnoreCase(request.getBrand(),request.getName())) {
        throw new IllegalArgumentException(
                "Product with name '" + request.getName() + "' already exists."
        );
    }
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .discountPercentage(request.getDiscountPercentage())
                .category(request.getCategory())
                .brand(request.getBrand())
                .imageUrls(request.getImageUrls() != null ? request.getImageUrls() : new java.util.ArrayList<>())
                .stockQuantity(request.getStockQuantity())
                .active(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Product saved = productRepository.save(product);
        return toResponse(saved);
    }

    public ProductResponse updateProduct(@NonNull String id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setDiscountPercentage(request.getDiscountPercentage());
        product.setCategory(request.getCategory());
        product.setBrand(request.getBrand());
        if (request.getImageUrls() != null) {
            product.setImageUrls(request.getImageUrls());
        }
        product.setStockQuantity(request.getStockQuantity());
        product.setUpdatedAt(LocalDateTime.now());

        Product updated = productRepository.save(product);
        return toResponse(updated);
    }

    public void deleteProduct(@NonNull String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        // Soft delete — keeps the record (needed for past order history) but hides it from listings
        product.setActive(false);
        product.setUpdatedAt(LocalDateTime.now());
        productRepository.save(product);
    }

    public ProductResponse getProductById(@NonNull String id) {
        Product product = productRepository.findById(id)
                .filter(Product::isActive)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        return toResponse(product);
    }

    @SuppressWarnings("null")
    public Page<ProductResponse> getProducts(String category, String search, @NonNull Pageable pageable) {
        boolean hasCategory = category != null && !category.isBlank();
        boolean hasSearch = search != null && !search.isBlank();

        // Simple cases: no search term needed, the repository methods handle these fine
        if (!hasSearch) {
            Page<Product> products = hasCategory
                    ? productRepository.findByActiveTrueAndCategoryIgnoreCase(category, pageable)
                    : productRepository.findByActiveTrue(pageable);
            return products.map(this::toResponse);
        }

        // Search case: match against name OR description, optionally narrowed by category
        Pattern searchPattern = Pattern.compile(Pattern.quote(search), Pattern.CASE_INSENSITIVE);

        List<Criteria> andConditions = new java.util.ArrayList<>();
        andConditions.add(Criteria.where("active").is(true));
        andConditions.add(new Criteria().orOperator(
                Criteria.where("name").regex(searchPattern),
                Criteria.where("description").regex(searchPattern)
        ));

        if (hasCategory) {
            Pattern categoryPattern = Pattern.compile(
                    "^" + Pattern.quote(category) + "$", Pattern.CASE_INSENSITIVE);
            andConditions.add(Criteria.where("category").regex(categoryPattern));
        }

        @SuppressWarnings("null")
        Criteria finalCriteria = new Criteria().andOperator(andConditions.toArray(new Criteria[0]));
        Query query = new Query(finalCriteria);

        long total = mongoTemplate.count(query, Product.class);

        query.with(pageable);
        List<Product> matches = mongoTemplate.find(query, Product.class);

        Page<Product> page = new PageImpl<>(matches, pageable, total);
        return page.map(this::toResponse);
    }

    // Converts a Product entity into a ProductResponse, computing finalPrice and inStock
    private ProductResponse toResponse(Product product) {
        double finalPrice = product.getPrice() * (1 - product.getDiscountPercentage() / 100.0);

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .discountPercentage(product.getDiscountPercentage())
                .finalPrice(Math.round(finalPrice * 100) / 100.0) // round to 2 decimal places
                .category(product.getCategory())
                .brand(product.getBrand())
                .imageUrls(product.getImageUrls())
                .stockQuantity(product.getStockQuantity())
                .inStock(product.getStockQuantity() > 0)
                .averageRating(product.getAverageRating())
                .numberOfReviews(product.getNumberOfReviews())
                .createdAt(product.getCreatedAt())
                .build();
    }
}