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

    // Custom 22-argument constructor for DbSeeder compatibility
    public Shipment(String id, String trackingNumber, String product, String destination, String status, String eta, int progress, int quantity, String weight, String dimensions, String carrier, String service, String origin, String estimatedDelivery, String senderName, String senderPhone, String senderEmail, String recipientName, String recipientPhone, String recipientEmail, String recipientAddress, String createdMonth) {
        this.id = id;
        this.trackingNumber = trackingNumber;
        this.product = product;
        this.destination = destination;
        this.status = status;
        this.eta = eta;
        this.progress = progress;
        this.quantity = quantity;
        this.weight = weight;
        this.dimensions = dimensions;
        this.carrier = carrier;
        this.service = service;
        this.origin = origin;
        this.estimatedDelivery = estimatedDelivery;
        this.senderName = senderName;
        this.senderPhone = senderPhone;
        this.senderEmail = senderEmail;
        this.recipientName = recipientName;
        this.recipientPhone = recipientPhone;
        this.recipientEmail = recipientEmail;
        this.recipientAddress = recipientAddress;
        this.createdMonth = createdMonth;

        // Auto-initialize new fields from legacy input data
        this.deliveryAddress = recipientAddress != null ? recipientAddress : destination;
        this.courierName = carrier != null ? carrier : "FastTrack Logistics";
        this.shipmentDate = LocalDateTime.now();
        this.expectedDeliveryDate = LocalDateTime.now().plusDays(3);
        
        // Setup dummy identifiers
        this.orderId = 1000L + (long) (Math.random() * 9000L);
        this.customerId = 2000L + (long) (Math.random() * 9000L);

        // Sync enum
        syncEnumFromStatusString(status);
    }

    @PrePersist
    @PreUpdate
    public void syncLegacyFields() {
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
}
