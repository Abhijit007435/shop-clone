package com.shopclone.backend.controller;

import com.shopclone.backend.dto.OrderResponse;
import com.shopclone.backend.dto.UpdateOrderStatusRequest;
import com.shopclone.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping
    public List<OrderResponse> getAllOrders() {
        return orderService.getAllOrders();
    }

    @PutMapping("/{orderId}/status")
    public OrderResponse updateStatus(
            @PathVariable @NonNull String orderId,
            @Valid @RequestBody UpdateOrderStatusRequest request
    ) {
        return orderService.updateOrderStatus(
                orderId,
                request.getStatus()
        );
    }
}