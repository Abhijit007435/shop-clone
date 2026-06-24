package com.shopclone.backend.service;

import com.shopclone.backend.dto.AddToCartRequest;
import com.shopclone.backend.dto.CartResponse;
import com.shopclone.backend.dto.UpdateCartItemRequest;
import com.shopclone.backend.model.Cart;
import com.shopclone.backend.model.Product;
import com.shopclone.backend.repository.CartRepository;
import com.shopclone.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.lang.NonNull;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    private String getCurrentUserId() {
        return SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
    }

    @SuppressWarnings("null")
    private Cart getOrCreateCart() {

        String userId = getCurrentUserId();

        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {

                    Cart cart = Cart.builder()
                            .userId(userId)
                            .createdAt(LocalDateTime.now())
                            .updatedAt(LocalDateTime.now())
                            .build();

                    return cartRepository.save(cart);
                });
    }

    @SuppressWarnings("null")
    public CartResponse addToCart(AddToCartRequest request) {

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Product not found"));

        if (!product.isActive()) {
            throw new IllegalArgumentException("Product unavailable");
        }

        if (product.getStockQuantity() < request.getQuantity()) {
            throw new IllegalArgumentException("Insufficient stock");
        }

        Cart cart = getOrCreateCart();

        Optional<Cart.CartItem> existingItem =
                cart.getItems()
                        .stream()
                        .filter(item ->
                                item.getProductId().equals(product.getId()))
                        .findFirst();

        if (existingItem.isPresent()) {

            Cart.CartItem item = existingItem.get();

            int newQuantity =
                    item.getQuantity() + request.getQuantity();

            if (newQuantity > product.getStockQuantity()) {
                throw new IllegalArgumentException("Insufficient stock");
            }

            item.setQuantity(newQuantity);

        } else {

            double finalPrice =
                    product.getPrice()
                            * (1 - product.getDiscountPercentage() / 100.0);

            Cart.CartItem item =
                    Cart.CartItem.builder()
                            .productId(product.getId())
                            .productName(product.getName())
                            .priceAtAddTime(
                                    Math.round(finalPrice * 100) / 100.0)
                            .imageUrl(
                                    product.getImageUrls().isEmpty()
                                            ? null
                                            : product.getImageUrls().get(0))
                            .quantity(request.getQuantity())
                            .build();

            cart.getItems().add(item);
        }

        cart.setUpdatedAt(LocalDateTime.now());

        cartRepository.save(cart);

        return buildCartResponse(cart);
    }

    public CartResponse getCart() {

        Cart cart = getOrCreateCart();

        return buildCartResponse(cart);
    }

    @SuppressWarnings("null")
    private CartResponse buildCartResponse(Cart cart) {

        var items =
                new ArrayList<CartResponse.CartItemResponse>();

        int totalItems = 0;
        double totalPrice = 0;

        for (Cart.CartItem item : cart.getItems()) {

            double subtotal =
                    item.getPriceAtAddTime()
                            * item.getQuantity();

            totalItems += item.getQuantity();
            totalPrice += subtotal;

            Product product =
                    productRepository.findById(item.getProductId())
                            .orElse(null);

            boolean inStock = false;
            int availableStock = 0;

            if (product != null) {

                availableStock =
                        product.getStockQuantity();

                inStock =
                        availableStock >= item.getQuantity();
            }

            items.add(
                    CartResponse.CartItemResponse.builder()
                            .productId(item.getProductId())
                            .productName(item.getProductName())
                            .priceAtAddTime(item.getPriceAtAddTime())
                            .imageUrl(item.getImageUrl())
                            .quantity(item.getQuantity())
                            .subtotal(
                                    Math.round(subtotal * 100) / 100.0)
                            .inStock(inStock)
                            .availableStock(availableStock)
                            .build()
            );
        }

        return CartResponse.builder()
                .items(items)
                .totalItems(totalItems)
                .totalPrice(Math.round(totalPrice * 100) / 100.0)
                .build();
    }
    public CartResponse removeItem(String productId) {

    Cart cart = getOrCreateCart();

    boolean removed = cart.getItems()
            .removeIf(item ->
                    item.getProductId().equals(productId));

    if (!removed) {
        throw new IllegalArgumentException("Item not found in cart");
    }

    cart.setUpdatedAt(LocalDateTime.now());

    cartRepository.save(cart);

    return buildCartResponse(cart);
}
public void clearCart() {

    Cart cart = getOrCreateCart();

    cart.getItems().clear();

    cart.setUpdatedAt(LocalDateTime.now());

    cartRepository.save(cart);
}
public CartResponse updateQuantity(
        @NonNull String productId,
        UpdateCartItemRequest request
) {

    Cart cart = getOrCreateCart();

    Cart.CartItem item = cart.getItems()
            .stream()
            .filter(i ->
                    i.getProductId().equals(productId))
            .findFirst()
            .orElseThrow(() ->
                    new IllegalArgumentException("Cart item not found"));

    Product product = productRepository.findById(productId)
            .orElseThrow(() ->
                    new IllegalArgumentException("Product not found"));

    if (request.getQuantity() > product.getStockQuantity()) {
        throw new IllegalArgumentException("Insufficient stock");
    }

    item.setQuantity(request.getQuantity());

    cart.setUpdatedAt(LocalDateTime.now());

    cartRepository.save(cart);

    return buildCartResponse(cart);
}
}