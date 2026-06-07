package com.omak.orderbilling.service;

import com.omak.orderbilling.entity.Order;
import java.util.List;
import java.util.Optional;

public interface OrderService {
    List<Order> getAllOrders();
    Optional<Order> getOrderById(Long id);
    Order createOrder(Order order);
    Order updateOrder(Long id, Order orderDetails);
    boolean deleteOrder(Long id);
}
