package com.logistics.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentRequestDTO {

    private Long orderId;
    private Long customerId;
    private String deliveryAddress;
    private String courierName;
    private LocalDateTime expectedDeliveryDate;

    // Optional legacy/frontend fields for ad-hoc manual shipments
    private String product;
    private Integer quantity;
    private String destination;
    private String recipientName;
    private String recipientEmail;
    private String recipientPhone;
    private String recipientAddress;
    private String status;
    private Integer progress;
    private String eta;
    private String carrier;
    private String service;
    private String origin;
    private String estimatedDelivery;
    private String weight;
    private String dimensions;
    private String senderName;
    private String senderPhone;
    private String senderEmail;

    // Custom 5-argument constructor for createShipmentFromOrder compatibility
    public ShipmentRequestDTO(Long orderId, Long customerId, String deliveryAddress, String courierName, LocalDateTime expectedDeliveryDate) {
        this.orderId = orderId;
        this.customerId = customerId;
        this.deliveryAddress = deliveryAddress;
        this.courierName = courierName;
        this.expectedDeliveryDate = expectedDeliveryDate;
    }
}
