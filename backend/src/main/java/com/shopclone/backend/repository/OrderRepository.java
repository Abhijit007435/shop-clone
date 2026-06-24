package com.shopclone.backend.repository;

import com.shopclone.backend.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {

    List<Order> findByUserIdOrderByOrderedAtDesc(String userId);
    List<Order> findAllByOrderByOrderedAtDesc();
}