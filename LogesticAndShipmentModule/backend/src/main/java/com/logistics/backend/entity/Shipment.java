package com.logistics.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "shipments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long shipmentId;

    // Legacy String ID (e.g. SH-2026-1847) for dashboard compatibility
    private String id;

    // New Schema Fields
    private Long orderId;
    private Long customerId;
    private String deliveryAddress;
    private String trackingNumber;
    private String courierName;
    private LocalDateTime shipmentDate;
    private LocalDateTime expectedDeliveryDate;

    @Enumerated(EnumType.STRING)
    private ShipmentStatus shipmentStatus;

    // Legacy Fields (retained for backward compatibility with the React dashboard UI)
    private String product;
    private String destination;
    private String status; // String representation (synced to Enum)
    private String eta;
    private int progress;
    private int quantity;
    private String weight;
    private String dimensions;
    private String carrier;
    private String service;
    private String origin;
    private String estimatedDelivery;

    // Sender Info
    private String senderName;
    private String senderPhone;
    private String senderEmail;

    // Recipient Info
    private String recipientName;
    private String recipientPhone;
    private String recipientEmail;
    private String recipientAddress;

    // Creation month helper for aggregation (e.g. "Jan", "Feb")
    private String createdMonth;

    @PostLoad
    @PrePersist
    @PreUpdate
    public void syncLegacyFields() {
        // Auto-initialize new fields from legacy input data
        if (this.deliveryAddress == null && this.recipientAddress != null) {
            this.deliveryAddress = this.recipientAddress;
        }
        if (this.deliveryAddress == null && this.destination != null) {
            this.deliveryAddress = this.destination;
        }
        if (this.courierName == null && this.carrier != null) {
            this.courierName = this.carrier;
        }
        if (this.courierName == null) {
            this.courierName = "FastTrack Logistics";
        }
        
        // Initialize timestamps if not set
        if (this.shipmentDate == null) {
            this.shipmentDate = LocalDateTime.now();
        }
        if (this.expectedDeliveryDate == null) {
            this.expectedDeliveryDate = LocalDateTime.now().plusDays(3);
        }
        
        // Setup dummy identifiers if not set
        if (this.orderId == null || this.orderId == 0) {
            this.orderId = 1000L + (long) (Math.random() * 9000L);
        }
        if (this.customerId == null || this.customerId == 0) {
            this.customerId = 2000L + (long) (Math.random() * 9000L);
        }
        
        // Sync enum from status string if not already set
        if (this.shipmentStatus == null && this.status != null) {
            syncEnumFromStatusString(this.status);
        }
        
        // Sync enum to status string for legacy compatibility
        if (id == null && shipmentId != null) {
            id = "SH-2026-" + shipmentId;
        }
        if (shipmentStatus != null) {
            this.status = shipmentStatus.name();
            switch (shipmentStatus) {
                case PENDING -> this.progress = 10;
                case PACKED -> this.progress = 25;
                case DISPATCHED -> this.progress = 40;
                case IN_TRANSIT -> this.progress = 65;
                case OUT_FOR_DELIVERY -> this.progress = 85;
                case DELIVERED -> this.progress = 100;
                case CANCELLED -> this.progress = 0;
            }
        }
    }

    private void syncEnumFromStatusString(String statusStr) {
        if (statusStr == null) {
            this.shipmentStatus = ShipmentStatus.PENDING;
            return;
        }
        try {
            if ("In Transit".equalsIgnoreCase(statusStr)) {
                this.shipmentStatus = ShipmentStatus.IN_TRANSIT;
            } else if ("On Time".equalsIgnoreCase(statusStr) || "Delivered".equalsIgnoreCase(statusStr)) {
                this.shipmentStatus = ShipmentStatus.DELIVERED;
            } else if ("Delayed".equalsIgnoreCase(statusStr)) {
                this.shipmentStatus = ShipmentStatus.IN_TRANSIT;
            } else {
                this.shipmentStatus = ShipmentStatus.valueOf(statusStr.toUpperCase().replace(" ", "_"));
            }
        } catch (Exception e) {
            this.shipmentStatus = ShipmentStatus.PENDING;
        }
    }

    // Explicit Getters and Setters (fallback for Lombok processing issues)
    public Long getShipmentId() { return shipmentId; }
    public void setShipmentId(Long shipmentId) { this.shipmentId = shipmentId; }
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    
    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }
    
    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }
    
    public String getCourierName() { return courierName; }
    public void setCourierName(String courierName) { this.courierName = courierName; }
    
    public LocalDateTime getShipmentDate() { return shipmentDate; }
    public void setShipmentDate(LocalDateTime shipmentDate) { this.shipmentDate = shipmentDate; }
    
    public LocalDateTime getExpectedDeliveryDate() { return expectedDeliveryDate; }
    public void setExpectedDeliveryDate(LocalDateTime expectedDeliveryDate) { this.expectedDeliveryDate = expectedDeliveryDate; }
    
    public ShipmentStatus getShipmentStatus() { return shipmentStatus; }
    public void setShipmentStatus(ShipmentStatus shipmentStatus) { this.shipmentStatus = shipmentStatus; }
    
    public String getProduct() { return product; }
    public void setProduct(String product) { this.product = product; }
    
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getEta() { return eta; }
    public void setEta(String eta) { this.eta = eta; }
    
    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }
    
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    
    public String getWeight() { return weight; }
    public void setWeight(String weight) { this.weight = weight; }
    
    public String getDimensions() { return dimensions; }
    public void setDimensions(String dimensions) { this.dimensions = dimensions; }
    
    public String getCarrier() { return carrier; }
    public void setCarrier(String carrier) { this.carrier = carrier; }
    
    public String getService() { return service; }
    public void setService(String service) { this.service = service; }
    
    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }
    
    public String getEstimatedDelivery() { return estimatedDelivery; }
    public void setEstimatedDelivery(String estimatedDelivery) { this.estimatedDelivery = estimatedDelivery; }
    
    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }
    
    public String getSenderPhone() { return senderPhone; }
    public void setSenderPhone(String senderPhone) { this.senderPhone = senderPhone; }
    
    public String getSenderEmail() { return senderEmail; }
    public void setSenderEmail(String senderEmail) { this.senderEmail = senderEmail; }
    
    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }
    
    public String getRecipientPhone() { return recipientPhone; }
    public void setRecipientPhone(String recipientPhone) { this.recipientPhone = recipientPhone; }
    
    public String getRecipientEmail() { return recipientEmail; }
    public void setRecipientEmail(String recipientEmail) { this.recipientEmail = recipientEmail; }
    
    public String getRecipientAddress() { return recipientAddress; }
    public void setRecipientAddress(String recipientAddress) { this.recipientAddress = recipientAddress; }
    
    public String getCreatedMonth() { return createdMonth; }
    public void setCreatedMonth(String createdMonth) { this.createdMonth = createdMonth; }
}
