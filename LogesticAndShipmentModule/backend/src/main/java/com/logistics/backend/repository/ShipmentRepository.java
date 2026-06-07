package com.logistics.backend.repository;

import com.logistics.backend.entity.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    Optional<Shipment> findById(String id); // Legacy String ID lookup
    Optional<Shipment> findByTrackingNumber(String trackingNumber);
    List<Shipment> findByOrderId(Long orderId);
    List<Shipment> findByCustomerId(Long customerId);
    long countByStatus(String status);
}
