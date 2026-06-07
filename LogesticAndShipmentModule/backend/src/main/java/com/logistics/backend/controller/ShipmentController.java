package com.logistics.backend.controller;

import com.logistics.backend.dto.*;
import com.logistics.backend.entity.Shipment;
import com.logistics.backend.entity.TrackingEvent;
import com.logistics.backend.repository.ShipmentRepository;
import com.logistics.backend.repository.TrackingEventRepository;
import com.logistics.backend.service.ShipmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/shipments")
@CrossOrigin(origins = "*")
public class ShipmentController {

    private final ShipmentService shipmentService;
    private final ShipmentRepository shipmentRepository;
    private final TrackingEventRepository trackingEventRepository;

    public ShipmentController(ShipmentService shipmentService,
                              ShipmentRepository shipmentRepository,
                              TrackingEventRepository trackingEventRepository) {
        this.shipmentService = shipmentService;
        this.shipmentRepository = shipmentRepository;
        this.trackingEventRepository = trackingEventRepository;
    }

    // 1. Create Shipment
    @PostMapping
    public ResponseEntity<ShipmentResponseDTO> createShipment(@Valid @RequestBody ShipmentRequestDTO request) {
        ShipmentResponseDTO response = shipmentService.createShipment(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // 2. View All Shipments
    @GetMapping
    public ResponseEntity<List<ShipmentResponseDTO>> getAllShipments() {
        return ResponseEntity.ok(shipmentService.getAllShipments());
    }

    // 3. View Shipment By ID (Supports both Long shipmentId and legacy String id)
    // Safeguarded against "statistics" routing collision
    @GetMapping("/{id}")
    public ResponseEntity<?> getShipmentById(@PathVariable String id) {
        if ("statistics".equalsIgnoreCase(id)) {
            return getStatistics();
        }
        try {
            Long numericId = Long.parseLong(id);
            return ResponseEntity.ok(shipmentService.getShipmentById(numericId));
        } catch (NumberFormatException e) {
            return ResponseEntity.ok(shipmentService.getShipmentByLegacyId(id));
        }
    }

    // 4. Update Shipment Details
    @PutMapping("/{id}")
    public ResponseEntity<ShipmentResponseDTO> updateShipment(@PathVariable Long id, @Valid @RequestBody ShipmentRequestDTO request) {
        return ResponseEntity.ok(shipmentService.updateShipment(id, request));
    }

    // 5. Delete Shipment
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShipment(@PathVariable Long id) {
        shipmentService.deleteShipment(id);
        return ResponseEntity.noContent().build();
    }

    // 6. Update Shipment Status
    @PutMapping("/{id}/status")
    public ResponseEntity<ShipmentResponseDTO> updateStatus(@PathVariable Long id, @Valid @RequestBody ShipmentStatusUpdateDTO statusDto) {
        return ResponseEntity.ok(shipmentService.updateStatus(id, statusDto.getStatus()));
    }

    // 7. Search Shipment By Tracking Number
    @GetMapping("/tracking/{trackingNumber}")
    public ResponseEntity<ShipmentResponseDTO> getShipmentByTrackingNumber(@PathVariable String trackingNumber) {
        return ResponseEntity.ok(shipmentService.getShipmentByTrackingNumber(trackingNumber));
    }

    // 8. View All Shipments By Order ID
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<ShipmentResponseDTO>> getShipmentsByOrderId(@PathVariable Long orderId) {
        return ResponseEntity.ok(shipmentService.getShipmentsByOrderId(orderId));
    }

    // 9. View All Shipments By Customer ID
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<ShipmentResponseDTO>> getShipmentsByCustomerId(@PathVariable Long customerId) {
        return ResponseEntity.ok(shipmentService.getShipmentsByCustomerId(customerId));
    }

    // 10. Get Shipment Statistics
    @GetMapping("/statistics")
    public ResponseEntity<ShipmentStatisticsDTO> getStatistics() {
        return ResponseEntity.ok(shipmentService.getStatistics());
    }

    // =========================================================================
    // LEGACY ENDPOINTS (Preserved for dashboard frontend compatibility)
    // =========================================================================

    @GetMapping("/{id}/tracking")
    public ResponseEntity<TrackingDetailsDto> getTrackingDetails(@PathVariable String id) {
        Shipment shipment = null;
        try {
            Long numericId = Long.parseLong(id);
            shipment = shipmentRepository.findById(numericId).orElse(null);
        } catch (NumberFormatException e) {
            // Ignore, not a numeric ID
        }

        if (shipment == null) {
            shipment = shipmentRepository.findById(id).orElse(null);
        }

        if (shipment == null) {
            shipment = shipmentRepository.findByTrackingNumber(id).orElse(null);
        }

        if (shipment == null) {
            return ResponseEntity.notFound().build();
        }

        List<TrackingEvent> events = trackingEventRepository.findByShipmentIdOrderByTimestampDesc(shipment.getId());

        TrackingDetailsDto.SenderDto sender = new TrackingDetailsDto.SenderDto(
                shipment.getSenderName() != null ? shipment.getSenderName() : "TechParts Warehouse",
                shipment.getSenderPhone() != null ? shipment.getSenderPhone() : "+1 (415) 555-0123",
                shipment.getSenderEmail() != null ? shipment.getSenderEmail() : "shipping@techparts.com"
        );

        TrackingDetailsDto.RecipientDto recipient = new TrackingDetailsDto.RecipientDto(
                shipment.getRecipientName() != null ? shipment.getRecipientName() : "Elite Electronics Store",
                shipment.getRecipientPhone() != null ? shipment.getRecipientPhone() : "+1 (212) 555-0198",
                shipment.getRecipientEmail() != null ? shipment.getRecipientEmail() : "receiving@eliteelectronics.com",
                shipment.getRecipientAddress() != null ? shipment.getRecipientAddress() : shipment.getDestination()
        );

        TrackingDetailsDto dto = new TrackingDetailsDto(
                shipment.getId(),
                shipment.getTrackingNumber(),
                shipment.getProduct() != null ? shipment.getProduct() : "Electronics Cargo",
                shipment.getQuantity() > 0 ? shipment.getQuantity() : 1,
                shipment.getWeight() != null ? shipment.getWeight() : "10.0 kg",
                shipment.getDimensions() != null ? shipment.getDimensions() : "50x50x50 cm",
                shipment.getCarrier() != null ? shipment.getCarrier() : shipment.getCourierName(),
                shipment.getService() != null ? shipment.getService() : "Express Delivery",
                shipment.getOrigin() != null ? shipment.getOrigin() : "San Francisco, CA",
                shipment.getDestination() != null ? shipment.getDestination() : shipment.getDeliveryAddress(),
                shipment.getEstimatedDelivery() != null ? shipment.getEstimatedDelivery() : "3 days",
                shipment.getStatus() != null ? shipment.getStatus() : (shipment.getShipmentStatus() != null ? shipment.getShipmentStatus().name() : "PENDING"),
                shipment.getProgress() > 0 ? shipment.getProgress() : 15,
                sender,
                recipient,
                events
        );
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/{id}/action/download-label")
    public ResponseEntity<String> downloadLabel(@PathVariable String id) {
        return ResponseEntity.ok("Label download triggered successfully for shipment: " + id);
    }

    @PostMapping("/{id}/action/report-issue")
    public ResponseEntity<?> reportIssue(@PathVariable String id) {
        Shipment shipment = null;
        try {
            Long numericId = Long.parseLong(id);
            shipment = shipmentRepository.findById(numericId).orElse(null);
        } catch (NumberFormatException e) {
            shipment = shipmentRepository.findById(id).orElse(null);
        }

        if (shipment == null) {
            return ResponseEntity.notFound().build();
        }

        shipment.setStatus("Delayed");
        shipment.setProgress(Math.max(20, shipment.getProgress() - 10)); 
        shipment.setEta("Delayed - Check Updates");
        Shipment updated = shipmentRepository.save(shipment);

        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        trackingEventRepository.save(new TrackingEvent(
                updated.getId(), "Delayed", "En-Route Facility", dtf.format(LocalDateTime.now()),
                "Shipment delayed - Alert raised by operations team", true, "AlertTriangle"
        ));

        return ResponseEntity.ok(updated);
    }

    // Add Tracking Event manually
    @PostMapping("/{id}/events")
    public ResponseEntity<TrackingEvent> addTrackingEvent(
            @PathVariable String id,
            @RequestBody TrackingEvent event) {
        
        Shipment shipment = null;
        try {
            Long numericId = Long.parseLong(id);
            shipment = shipmentRepository.findById(numericId).orElse(null);
        } catch (NumberFormatException e) {
            shipment = shipmentRepository.findById(id).orElse(null);
        }

        if (shipment == null) {
            throw new com.logistics.backend.exception.ResourceNotFoundException("Shipment not found with ID: " + id);
        }

        event.setShipmentId(shipment.getId());
        if (event.getTimestamp() == null || event.getTimestamp().isBlank()) {
            event.setTimestamp(java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        }
        
        TrackingEvent saved = trackingEventRepository.save(event);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // Get all Tracking Events for a shipment
    @GetMapping("/{id}/events")
    public ResponseEntity<List<TrackingEvent>> getTrackingEvents(@PathVariable String id) {
        Shipment shipment = null;
        try {
            Long numericId = Long.parseLong(id);
            shipment = shipmentRepository.findById(numericId).orElse(null);
        } catch (NumberFormatException e) {
            shipment = shipmentRepository.findById(id).orElse(null);
        }

        if (shipment == null) {
            throw new com.logistics.backend.exception.ResourceNotFoundException("Shipment not found with ID: " + id);
        }

        List<TrackingEvent> events = trackingEventRepository.findByShipmentIdOrderByTimestampDesc(shipment.getId());
        return ResponseEntity.ok(events);
    }
}
