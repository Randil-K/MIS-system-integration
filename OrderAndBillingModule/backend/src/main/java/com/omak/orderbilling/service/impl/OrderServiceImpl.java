package com.omak.orderbilling.service.impl;

import com.omak.orderbilling.entity.Customer;
import com.omak.orderbilling.entity.Order;
import com.omak.orderbilling.entity.OrderItem;
import com.omak.orderbilling.entity.Product;
import com.omak.orderbilling.exception.*;
import com.omak.orderbilling.repository.CustomerRepository;
import com.omak.orderbilling.repository.OrderItemRepository;
import com.omak.orderbilling.repository.OrderRepository;
import com.omak.orderbilling.repository.ProductRepository;
import com.omak.orderbilling.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final RestTemplate restTemplate;

    @Value("${integration.user-service.url:http://localhost:8085}")
    private String userServiceUrl;

    @Value("${integration.inventory-service.url:http://localhost:8081}")
    private String inventoryServiceUrl;

    @Value("${integration.logistics-service.url:http://localhost:8080}")
    private String logisticsServiceUrl;

    @Autowired
    public OrderServiceImpl(OrderRepository orderRepository,
                            ProductRepository productRepository,
                            CustomerRepository customerRepository,
                            RestTemplate restTemplate) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.restTemplate = restTemplate;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    @Override
    public Order createOrder(Order order) {
        // 1. Validate Customer
        if (order.getCustomer() == null || order.getCustomer().getId() == null) {
            throw new ValidationException("Customer information is required");
        }
        Long customerId = order.getCustomer().getId();
        
        Map<String, Object> userMap;
        try {
            String url = userServiceUrl + "/api/public/users/" + customerId;
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            userMap = response.getBody();
        } catch (HttpClientErrorException.NotFound ex) {
            throw new UserNotFoundException("Customer not found in User Management system with ID: " + customerId);
        } catch (Exception ex) {
            throw new InvalidOrderException("Failed to validate customer against User Management service: " + ex.getMessage());
        }

        if (userMap == null || userMap.containsKey("error")) {
            throw new UserNotFoundException("Customer not found in User Management system with ID: " + customerId);
        }

        // Cache customer details locally in database
        String email = (String) userMap.get("email");
        Customer localCustomer = customerRepository.findByEmail(email).orElse(null);
        if (localCustomer == null) {
            localCustomer = new Customer();
            localCustomer.setId(customerId);
        }
        localCustomer.setName((String) userMap.get("name"));
        localCustomer.setEmail(email);
        String phone = (String) userMap.get("contactNumber");
        localCustomer.setPhone((phone != null && !phone.isBlank()) ? phone : "N/A");
        if (order.getCustomer().getAddress() != null && !order.getCustomer().getAddress().isBlank()) {
            localCustomer.setAddress(order.getCustomer().getAddress());
        } else if (localCustomer.getAddress() == null) {
            localCustomer.setAddress("No shipping address provided");
        }
        localCustomer = customerRepository.save(localCustomer);
        order.setCustomer(localCustomer);

        // 2. Validate Products & Verify Stock Availability
        if (order.getItems() == null || order.getItems().isEmpty()) {
            throw new ValidationException("Order must contain at least one item");
        }

        BigDecimal total = BigDecimal.ZERO;
        for (OrderItem item : order.getItems()) {
            if (item.getProduct() == null || item.getProduct().getId() == null) {
                throw new ValidationException("Product is required for all order items");
            }
            if (item.getQuantity() == null || item.getQuantity() <= 0) {
                throw new ValidationException("Quantity must be greater than zero");
            }

            Long productId = item.getProduct().getId();
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found locally with ID: " + productId));

            // Check stock in Inventory service
            try {
                String checkUrl = inventoryServiceUrl + "/api/inventory/check/" + productId + "?quantity=" + item.getQuantity();
                ResponseEntity<Map> checkResponse = restTemplate.getForEntity(checkUrl, Map.class);
                Map<String, Boolean> checkBody = checkResponse.getBody();
                if (checkBody == null || !Boolean.TRUE.equals(checkBody.get("available"))) {
                    throw new InsufficientStockException("Insufficient stock in inventory for product: " + product.getName());
                }
            } catch (InsufficientStockException ex) {
                throw ex;
            } catch (Exception ex) {
                throw new InvalidOrderException("Failed to check inventory for product: " + product.getName() + " - " + ex.getMessage());
            }

            item.setOrder(order);
            item.setProduct(product);
            item.setUnitPrice(product.getPrice());
            BigDecimal itemSubtotal = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            item.setSubtotal(itemSubtotal);
            total = total.add(itemSubtotal);
        }

        order.setTotalAmount(total);
        order.setStatus("PENDING");

        // 3. Save Order (Persist to Database)
        Order savedOrder = orderRepository.save(order);

        // 4. Automatically Reduce Stock in Inventory Service
        for (OrderItem item : savedOrder.getItems()) {
            try {
                String reduceUrl = inventoryServiceUrl + "/api/inventory/reduce";
                Map<String, Object> reduceRequest = new HashMap<>();
                reduceRequest.put("productId", item.getProduct().getId());
                reduceRequest.put("quantity", item.getQuantity());
                reduceRequest.put("referenceDoc", "Order #" + savedOrder.getId());
                
                restTemplate.postForEntity(reduceUrl, reduceRequest, Map.class);
            } catch (Exception ex) {
                throw new InvalidOrderException("Failed to reduce stock in inventory for product: " + item.getProduct().getName() + " - " + ex.getMessage());
            }
        }

        // 5. Trigger Shipment Creation automatically
        try {
            String shipmentUrl = logisticsServiceUrl + "/api/shipments";
            Map<String, Object> shipmentRequest = new HashMap<>();
            shipmentRequest.put("orderId", savedOrder.getId());
            shipmentRequest.put("customerId", customerId);
            shipmentRequest.put("deliveryAddress", localCustomer.getAddress());
            shipmentRequest.put("courierName", "FastTrack Logistics");

            restTemplate.postForEntity(shipmentUrl, shipmentRequest, Map.class);
        } catch (Exception ex) {
            // We log the shipment trigger error, but do not fail the order since order database is saved
            System.err.println("Warning: Failed to auto-trigger shipment creation: " + ex.getMessage());
        }

        return savedOrder;
    }

    @Override
    public Order updateOrder(Long id, Order orderDetails) {
        return orderRepository.findById(id)
                .map(order -> {
                    if (orderDetails.getCustomer() != null) {
                        order.setCustomer(orderDetails.getCustomer());
                    }
                    if (orderDetails.getTotalAmount() != null) {
                        order.setTotalAmount(orderDetails.getTotalAmount());
                    }
                    if (orderDetails.getStatus() != null) {
                        order.setStatus(orderDetails.getStatus());
                    }
                    return orderRepository.save(order);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));
    }

    @Override
    public boolean deleteOrder(Long id) {
        if (orderRepository.existsById(id)) {
            orderRepository.deleteById(id);
            return true;
        }
        throw new ResourceNotFoundException("Order not found with ID: " + id);
    }
}
