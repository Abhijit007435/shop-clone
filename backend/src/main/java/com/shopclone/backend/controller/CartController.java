package com.shopclone.backend.controller;

import com.shopclone.backend.dto.AddToCartRequest;
import com.shopclone.backend.dto.CartResponse;
import com.shopclone.backend.dto.UpdateCartItemRequest;
import com.shopclone.backend.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/add")
    public CartResponse addToCart(
            @Valid @RequestBody AddToCartRequest request
    ) {
        System.out.println(">>> CartController addToCart called <<<");
        return cartService.addToCart(request);
    }

    @GetMapping
    public CartResponse getCart() {
        return cartService.getCart();
    }
    @DeleteMapping("/{productId}")
public CartResponse removeItem(
        @PathVariable String productId
) {
    return cartService.removeItem(productId);
}
@DeleteMapping("/clear")
public void clearCart() {
    cartService.clearCart();
}
@PutMapping("/{productId}")
public CartResponse updateQuantity(
        @PathVariable @NonNull String productId,
        @Valid @RequestBody UpdateCartItemRequest request
) {
    return cartService.updateQuantity(productId, request);
}
}