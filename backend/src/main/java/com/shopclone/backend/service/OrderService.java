package com.shopclone.backend.service;

import com.shopclone.backend.dto.OrderResponse;
import com.shopclone.backend.dto.PlaceOrderRequest;
import com.shopclone.backend.model.Cart;
import com.shopclone.backend.model.Order;
import com.shopclone.backend.model.Product;
import com.shopclone.backend.repository.CartRepository;
import com.shopclone.backend.repository.OrderRepository;
import com.shopclone.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;

import com.shopclone.backend.model.Address;
import com.shopclone.backend.repository.AddressRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.lang.NonNull;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderService {

    @SuppressWarnings("unused")
    private final OrderRepository orderRepository;
    @SuppressWarnings("unused")
    private final CartRepository cartRepository;
    @SuppressWarnings("unused")
    private final ProductRepository productRepository;
    @SuppressWarnings("unused")
private final AddressRepository addressRepository;

    @SuppressWarnings("unused")
    private String getCurrentUserId() {
        return SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
    }
    @SuppressWarnings("null")
public OrderResponse placeOrder(
        PlaceOrderRequest request
) {

    String userId = getCurrentUserId();

    Address address = addressRepository
            .findById(request.getAddressId())
            .orElseThrow(() ->
                    new IllegalArgumentException(
                            "Address not found"));

    if (!address.getUserId().equals(userId)) {
        throw new IllegalArgumentException(
                "Access denied");
    }

    Cart cart = cartRepository.findByUserId(userId)
            .orElseThrow(() ->
                    new IllegalArgumentException("Cart not found"));

    if (cart.getItems().isEmpty()) {
        throw new IllegalArgumentException("Cart is empty");
    }

    List<Order.OrderItem> orderItems = new ArrayList<>();

    double totalAmount = 0;

    for (Cart.CartItem cartItem : cart.getItems()) {

        Product product = productRepository
                .findById(cartItem.getProductId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Product not found"));

        if (!product.isActive()) {
            throw new IllegalArgumentException(
                    product.getName() + " is unavailable");
        }

        if (product.getStockQuantity()
                < cartItem.getQuantity()) {

            throw new IllegalArgumentException(
                    "Insufficient stock for "
                            + product.getName());
        }

        double subtotal =
                cartItem.getPriceAtAddTime()
                        * cartItem.getQuantity();

        totalAmount += subtotal;

        orderItems.add(
                Order.OrderItem.builder()
                        .productId(cartItem.getProductId())
                        .productName(cartItem.getProductName())
                        .priceAtOrderTime(
                                cartItem.getPriceAtAddTime())
                        .imageUrl(cartItem.getImageUrl())
                        .quantity(cartItem.getQuantity())
                        .subtotal(subtotal)
                        .build()
        );

        product.setStockQuantity(
                product.getStockQuantity()
                        - cartItem.getQuantity());

        productRepository.save(product);
    }

    Order order = Order.builder()
            .userId(userId)
            .shippingAddress(
                    Order.ShippingAddress.builder()
                            .fullName(address.getFullName())
                            .phoneNumber(address.getPhoneNumber())
                            .street(address.getStreet())
                            .city(address.getCity())
                            .state(address.getState())
                            .pincode(address.getPincode())
                            .country(address.getCountry())
                            .build()
            )
            .items(orderItems)
            .totalAmount(
                    Math.round(totalAmount * 100) / 100.0)
            .status("PENDING")
            .orderedAt(LocalDateTime.now())
            .build();

    Order savedOrder =
            orderRepository.save(order);

    cart.getItems().clear();
    cartRepository.save(cart);

    return toResponse(savedOrder);
}
private OrderResponse toResponse(Order order) {

    List<OrderResponse.OrderItemResponse> items =
            order.getItems()
                    .stream()
                    .map(item ->
                            OrderResponse.OrderItemResponse
                                    .builder()
                                    .productId(item.getProductId())
                                    .productName(item.getProductName())
                                    .priceAtOrderTime(item.getPriceAtOrderTime())
                                    .quantity(item.getQuantity())
                                    .subtotal(item.getSubtotal())
                                    .build()
                    )
                    .toList();

    return OrderResponse.builder()
            .orderId(order.getId())
            .items(items)
            .shippingAddress(
                    OrderResponse.ShippingAddressResponse.builder()
                            .fullName(order.getShippingAddress().getFullName())
                            .phoneNumber(order.getShippingAddress().getPhoneNumber())
                            .street(order.getShippingAddress().getStreet())
                            .city(order.getShippingAddress().getCity())
                            .state(order.getShippingAddress().getState())
                            .pincode(order.getShippingAddress().getPincode())
                            .country(order.getShippingAddress().getCountry())
                            .build()
            )
            .totalAmount(order.getTotalAmount())
            .status(order.getStatus())
            .orderedAt(order.getOrderedAt())
            .build();
}
public List<OrderResponse> getMyOrders() {

    String userId = getCurrentUserId();

    return orderRepository
            .findByUserIdOrderByOrderedAtDesc(userId)
            .stream()
            .map(this::toResponse)
            .toList();
}
public OrderResponse getOrderById(@NonNull String orderId) {

    String userId = getCurrentUserId();

    Order order = orderRepository.findById(orderId)
            .orElseThrow(() ->
                    new IllegalArgumentException("Order not found"));

    if (!order.getUserId().equals(userId)) {
        throw new IllegalArgumentException("Access denied");
    }

    return toResponse(order);
}
@SuppressWarnings("null")
public OrderResponse cancelOrder(String orderId) {

    String userId = getCurrentUserId();

    Order order = orderRepository.findById(orderId)
            .orElseThrow(() ->
                    new IllegalArgumentException("Order not found"));

    if (!order.getUserId().equals(userId)) {
        throw new IllegalArgumentException("Access denied");
    }

    if ("CANCELLED".equals(order.getStatus())) {
        throw new IllegalArgumentException("Order already cancelled");
    }

    if (!"PENDING".equals(order.getStatus())) {
        throw new IllegalArgumentException(
                "Only pending orders can be cancelled");
    }

    // Restore stock
    for (Order.OrderItem item : order.getItems()) {

        Product product = productRepository
                .findById(item.getProductId())
                .orElse(null);

        if (product != null) {

            product.setStockQuantity(
                    product.getStockQuantity()
                            + item.getQuantity()
            );

            productRepository.save(product);
        }
    }

    order.setStatus("CANCELLED");

    Order updatedOrder =
            orderRepository.save(order);

    return toResponse(updatedOrder);
}
public List<OrderResponse> getAllOrders() {

    return orderRepository
            .findAllByOrderByOrderedAtDesc()
            .stream()
            .map(this::toResponse)
            .toList();
}
public OrderResponse updateOrderStatus(
        @NonNull String orderId,
        String status
) {

    Order order = orderRepository.findById(orderId)
            .orElseThrow(() ->
                    new IllegalArgumentException(
                            "Order not found"));

    List<String> validStatuses = List.of(
            "PENDING",
            "CONFIRMED",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED"
    );

    status = status.toUpperCase();

    if (!validStatuses.contains(status)) {
        throw new IllegalArgumentException(
                "Invalid order status");
    }

    order.setStatus(status);

    Order updatedOrder =
            orderRepository.save(order);

    return toResponse(updatedOrder);
}
}