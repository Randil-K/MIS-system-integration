package com.logistics.backend.service;

import com.logistics.backend.dto.ShipmentRequestDTO;
import com.logistics.backend.dto.ShipmentResponseDTO;
import com.logistics.backend.dto.ShipmentStatisticsDTO;

import java.util.List;

public interface ShipmentService {
    ShipmentResponseDTO createShipment(ShipmentRequestDTO request);
    ShipmentResponseDTO getShipmentById(Long shipmentId);
    ShipmentResponseDTO getShipmentByLegacyId(String legacyId);
    List<ShipmentResponseDTO> getAllShipments();
    ShipmentResponseDTO updateShipment(Long shipmentId, ShipmentRequestDTO request);
    void deleteShipment(Long shipmentId);
    ShipmentResponseDTO updateStatus(Long shipmentId, String status);
    ShipmentResponseDTO getShipmentByTrackingNumber(String trackingNumber);
    List<ShipmentResponseDTO> getShipmentsByOrderId(Long orderId);
    List<ShipmentResponseDTO> getShipmentsByCustomerId(Long customerId);
    ShipmentStatisticsDTO getStatistics();
    ShipmentResponseDTO trackProgress(Long shipmentId);

    // SCM Module Integration Services
    boolean isOrderShipped(Long orderId);
    ShipmentResponseDTO createShipmentFromOrder(Long orderId, Long customerId, String deliveryAddress, String courierName);
}
