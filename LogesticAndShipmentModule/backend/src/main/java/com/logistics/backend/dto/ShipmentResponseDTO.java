package com.logistics.backend.dto;

import com.logistics.backend.entity.ShipmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShipmentResponseDTO {
    private Long shipmentId;
    private String legacyId;
    private String id; // Exposed for React frontend dashboard compatibility
    private Long orderId;
    private Long customerId;
    private String deliveryAddress;
    private String trackingNumber;
    private String courierName;
    private LocalDateTime shipmentDate;
    private LocalDateTime expectedDeliveryDate;
    private ShipmentStatus shipmentStatus;
    private int progress;
    private String eta;
}
