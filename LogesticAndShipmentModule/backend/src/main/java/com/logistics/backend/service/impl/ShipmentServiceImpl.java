package com.logistics.backend.service.impl;

import com.logistics.backend.dto.ShipmentRequestDTO;
import com.logistics.backend.dto.ShipmentResponseDTO;
import com.logistics.backend.dto.ShipmentStatisticsDTO;
import com.logistics.backend.entity.Shipment;
import com.logistics.backend.entity.ShipmentStatus;
import com.logistics.backend.exception.InvalidShipmentStatusException;
import com.logistics.backend.exception.ResourceNotFoundException;
import com.logistics.backend.repository.ShipmentRepository;
import com.logistics.backend.service.ShipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ShipmentServiceImpl implements ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final RestTemplate restTemplate;

    @Value("${integration.order-service.url:http://localhost:8082}")
    private String orderServiceUrl;

    @Autowired
    public ShipmentServiceImpl(ShipmentRepository shipmentRepository, RestTemplate restTemplate) {
        this.shipmentRepository = shipmentRepository;
        this.restTemplate = restTemplate;
    }

    @Override
    public ShipmentResponseDTO createShipment(ShipmentRequestDTO request) {
        LocalDateTime shipmentDate = LocalDateTime.now();
        LocalDateTime expectedDelivery = request.getExpectedDeliveryDate() != null 
                ? request.getExpectedDeliveryDate() 
                : shipmentDate.plusDays(3);

        Shipment shipment = new Shipment();
        shipment.setOrderId(request.getOrderId() != null ? request.getOrderId() : 0L);
        shipment.setCustomerId(request.getCustomerId() != null ? request.getCustomerId() : 0L);
        shipment.setDeliveryAddress(request.getDeliveryAddress() != null ? request.getDeliveryAddress() : (request.getRecipientAddress() != null ? request.getRecipientAddress() : request.getDestination()));
        shipment.setCourierName(request.getCourierName() != null ? request.getCourierName() : (request.getCarrier() != null ? request.getCarrier() : "FastTrack Logistics"));
        shipment.setTrackingNumber("TEMP"); // Temporary placeholder before primary key generation
        shipment.setShipmentDate(shipmentDate);
        shipment.setExpectedDeliveryDate(expectedDelivery);
        
        // Legacy fields (for dashboard fallback compatibility)
        shipment.setProduct(request.getProduct() != null ? request.getProduct() : "Product Cargo");
        shipment.setDestination(request.getDestination() != null ? request.getDestination() : (request.getDeliveryAddress() != null ? request.getDeliveryAddress() : request.getRecipientAddress()));
        shipment.setCarrier(request.getCarrier() != null ? request.getCarrier() : (request.getCourierName() != null ? request.getCourierName() : "FastTrack Logistics"));
        shipment.setService(request.getService() != null ? request.getService() : "Express Freight");
        shipment.setOrigin(request.getOrigin() != null ? request.getOrigin() : "SCM Sorting Facility");
        shipment.setEstimatedDelivery(request.getEstimatedDelivery() != null ? request.getEstimatedDelivery() : (request.getEta() != null ? request.getEta() : "3 Days"));
        shipment.setQuantity(request.getQuantity() != null ? request.getQuantity() : 1);
        shipment.setWeight(request.getWeight() != null ? request.getWeight() : "15 kg");
        shipment.setDimensions(request.getDimensions() != null ? request.getDimensions() : "50x40x30 cm");
        shipment.setProgress(request.getProgress() != null ? request.getProgress() : 10);
        shipment.setEta(request.getEta() != null ? request.getEta() : "3 Days");
        
        // Sender details
        shipment.setSenderName(request.getSenderName() != null ? request.getSenderName() : "SCM Logistics Depot");
        shipment.setSenderPhone(request.getSenderPhone() != null ? request.getSenderPhone() : "+1 (800) 555-0199");
        shipment.setSenderEmail(request.getSenderEmail() != null ? request.getSenderEmail() : "depot@scmlogistics.com");
        
        // Recipient details
        shipment.setRecipientName(request.getRecipientName() != null ? request.getRecipientName() : "SCM Recipient");
        shipment.setRecipientPhone(request.getRecipientPhone() != null ? request.getRecipientPhone() : "");
        shipment.setRecipientEmail(request.getRecipientEmail() != null ? request.getRecipientEmail() : "");
        shipment.setRecipientAddress(request.getRecipientAddress() != null ? request.getRecipientAddress() : (request.getDeliveryAddress() != null ? request.getDeliveryAddress() : request.getDestination()));
        
        shipment.setCreatedMonth("May");

        // Parse status to enum
        String statusStr = request.getStatus();
        if (statusStr == null) {
            shipment.setShipmentStatus(ShipmentStatus.PENDING);
        } else {
            try {
                if ("In Transit".equalsIgnoreCase(statusStr)) {
                    shipment.setShipmentStatus(ShipmentStatus.IN_TRANSIT);
                } else if ("On Time".equalsIgnoreCase(statusStr) || "Delivered".equalsIgnoreCase(statusStr)) {
                    shipment.setShipmentStatus(ShipmentStatus.DELIVERED);
                } else if ("Delayed".equalsIgnoreCase(statusStr)) {
                    shipment.setShipmentStatus(ShipmentStatus.IN_TRANSIT);
                } else {
                    shipment.setShipmentStatus(ShipmentStatus.valueOf(statusStr.toUpperCase().replace(" ", "_")));
                }
            } catch (Exception e) {
                shipment.setShipmentStatus(ShipmentStatus.PENDING);
            }
        }

        // 1. Initial save to generate database auto-increment shipmentId
        Shipment saved = shipmentRepository.save(shipment);

        // 2. Generate thread-safe sequential tracking number
        String trackingNum = "TRK" + (10000 + saved.getShipmentId());
        saved.setTrackingNumber(trackingNum);

        // 3. Final save to commit unique sequential tracking number
        saved = shipmentRepository.save(saved);

        return mapToResponseDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ShipmentResponseDTO getShipmentById(Long shipmentId) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found with ID: " + shipmentId));
        return mapToResponseDTO(shipment);
    }

    @Override
    @Transactional(readOnly = true)
    public ShipmentResponseDTO getShipmentByLegacyId(String legacyId) {
        Shipment shipment = shipmentRepository.findById(legacyId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found with Legacy ID: " + legacyId));
        return mapToResponseDTO(shipment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ShipmentResponseDTO> getAllShipments() {
        return shipmentRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ShipmentResponseDTO updateShipment(Long shipmentId, ShipmentRequestDTO request) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found with ID: " + shipmentId));

        shipment.setOrderId(request.getOrderId());
        shipment.setCustomerId(request.getCustomerId());
        shipment.setDeliveryAddress(request.getDeliveryAddress());
        shipment.setCourierName(request.getCourierName());
        if (request.getExpectedDeliveryDate() != null) {
            shipment.setExpectedDeliveryDate(request.getExpectedDeliveryDate());
        }

        // Keep legacy properties synced
        shipment.setDestination(request.getDeliveryAddress());
        shipment.setCarrier(request.getCourierName());

        Shipment saved = shipmentRepository.save(shipment);
        return mapToResponseDTO(saved);
    }

    @Override
    public void deleteShipment(Long shipmentId) {
        if (!shipmentRepository.existsById(shipmentId)) {
            throw new ResourceNotFoundException("Shipment not found with ID: " + shipmentId);
        }
        shipmentRepository.deleteById(shipmentId);
    }

    @Override
    public ShipmentResponseDTO updateStatus(Long shipmentId, String status) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found with ID: " + shipmentId));

        try {
            ShipmentStatus newStatus = ShipmentStatus.valueOf(status.toUpperCase().replace(" ", "_"));
            shipment.setShipmentStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new InvalidShipmentStatusException("Invalid status: " + status + ". Allowed values: PENDING, PACKED, DISPATCHED, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, CANCELLED");
        }

        Shipment saved = shipmentRepository.save(shipment);

        // Synchronize status with Order service
        if (saved.getOrderId() != null) {
            try {
                String orderStatus;
                ShipmentStatus newStatus = saved.getShipmentStatus();
                if (newStatus == ShipmentStatus.DELIVERED) {
                    orderStatus = "COMPLETED";
                } else if (newStatus == ShipmentStatus.CANCELLED) {
                    orderStatus = "CANCELLED";
                } else if (newStatus == ShipmentStatus.PENDING) {
                    orderStatus = "PENDING";
                } else {
                    orderStatus = "SHIPPED";
                }
                String syncUrl = orderServiceUrl + "/api/orders/" + saved.getOrderId() + "/status?status=" + orderStatus;
                restTemplate.put(syncUrl, null);
            } catch (Exception e) {
                System.err.println("Warning: Failed to sync order status to order service: " + e.getMessage());
            }
        }

        return mapToResponseDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ShipmentResponseDTO getShipmentByTrackingNumber(String trackingNumber) {
        Shipment shipment = shipmentRepository.findByTrackingNumber(trackingNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found with tracking number: " + trackingNumber));
        return mapToResponseDTO(shipment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ShipmentResponseDTO> getShipmentsByOrderId(Long orderId) {
        return shipmentRepository.findByOrderId(orderId).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ShipmentResponseDTO> getShipmentsByCustomerId(Long customerId) {
        return shipmentRepository.findByCustomerId(customerId).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ShipmentStatisticsDTO getStatistics() {
        List<Shipment> shipments = shipmentRepository.findAll();
        
        long total = shipments.stream().filter(s -> s.getShipmentStatus() != null).count();
        long pending = shipments.stream().filter(s -> s.getShipmentStatus() == ShipmentStatus.PENDING).count();
        long inTransit = shipments.stream().filter(s -> s.getShipmentStatus() == ShipmentStatus.IN_TRANSIT || s.getShipmentStatus() == ShipmentStatus.DISPATCHED || s.getShipmentStatus() == ShipmentStatus.OUT_FOR_DELIVERY).count();
        long delivered = shipments.stream().filter(s -> s.getShipmentStatus() == ShipmentStatus.DELIVERED).count();
        long cancelled = shipments.stream().filter(s -> s.getShipmentStatus() == ShipmentStatus.CANCELLED).count();

        ShipmentStatisticsDTO stats = new ShipmentStatisticsDTO();
        stats.setTotalShipments(total);
        stats.setPendingShipments(pending);
        stats.setInTransitShipments(inTransit);
        stats.setDeliveredShipments(delivered);
        stats.setCancelledShipments(cancelled);
        return stats;
    }

    @Override
    @Transactional(readOnly = true)
    public ShipmentResponseDTO trackProgress(Long shipmentId) {
        return getShipmentById(shipmentId);
    }

    // =========================================================================
    // SCM MODULE INTEGRATION SERVICES
    // =========================================================================

    @Override
    @Transactional(readOnly = true)
    public boolean isOrderShipped(Long orderId) {
        List<Shipment> shipments = shipmentRepository.findByOrderId(orderId);
        if (shipments.isEmpty()) {
            return false;
        }
        return shipments.stream()
                .anyMatch(s -> s.getShipmentStatus() != ShipmentStatus.CANCELLED);
    }

    @Override
    public ShipmentResponseDTO createShipmentFromOrder(Long orderId, Long customerId, String deliveryAddress, String courierName) {
        ShipmentRequestDTO request = new ShipmentRequestDTO(orderId, customerId, deliveryAddress, courierName, LocalDateTime.now().plusDays(3));
        return createShipment(request);
    }

    private ShipmentResponseDTO mapToResponseDTO(Shipment shipment) {
        ShipmentResponseDTO response = new ShipmentResponseDTO();
        response.setShipmentId(shipment.getShipmentId());
        response.setLegacyId(shipment.getId());
        response.setId(shipment.getId());
        response.setOrderId(shipment.getOrderId());
        response.setCustomerId(shipment.getCustomerId());
        response.setDeliveryAddress(shipment.getDeliveryAddress());
        response.setTrackingNumber(shipment.getTrackingNumber());
        response.setCourierName(shipment.getCourierName());
        response.setShipmentDate(shipment.getShipmentDate());
        response.setExpectedDeliveryDate(shipment.getExpectedDeliveryDate());
        response.setShipmentStatus(shipment.getShipmentStatus());
        response.setProgress(shipment.getProgress());
        response.setEta(shipment.getEta());
        return response;
    }
}
