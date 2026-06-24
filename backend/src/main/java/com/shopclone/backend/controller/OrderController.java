package com.shopclone.backend.controller;

import com.shopclone.backend.dto.OrderResponse;
import com.shopclone.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import com.shopclone.backend.dto.PlaceOrderRequest;
import jakarta.validation.Valid;

import java.util.List;

import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/place")
    public OrderResponse placeOrder(@Valid @RequestBody PlaceOrderRequest request) {
        return orderService.placeOrder(request);
    }

    @GetMapping
public List<OrderResponse> getMyOrders() {
    return orderService.getMyOrders();
}
@GetMapping("/{orderId}")
public OrderResponse getOrderById(
        @PathVariable @NonNull String orderId
) {
    return orderService.getOrderById(orderId);
}
@PutMapping("/{orderId}/cancel")
public OrderResponse cancelOrder(
        @PathVariable String orderId
) {
    return orderService.cancelOrder(orderId);
}
}