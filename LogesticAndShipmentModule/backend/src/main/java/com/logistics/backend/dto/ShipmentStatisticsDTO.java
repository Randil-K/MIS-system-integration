package com.logistics.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShipmentStatisticsDTO {
    private long totalShipments;
    private long pendingShipments;
    private long inTransitShipments;
    private long deliveredShipments;
    private long cancelledShipments;
}
