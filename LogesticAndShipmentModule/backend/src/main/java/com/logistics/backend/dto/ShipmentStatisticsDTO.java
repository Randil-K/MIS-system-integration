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

    // Explicit getters and setters (fallback for Lombok processing issues)
    public long getTotalShipments() { return totalShipments; }
    public void setTotalShipments(long totalShipments) { this.totalShipments = totalShipments; }
    public long getPendingShipments() { return pendingShipments; }
    public void setPendingShipments(long pendingShipments) { this.pendingShipments = pendingShipments; }
    public long getInTransitShipments() { return inTransitShipments; }
    public void setInTransitShipments(long inTransitShipments) { this.inTransitShipments = inTransitShipments; }
    public long getDeliveredShipments() { return deliveredShipments; }
    public void setDeliveredShipments(long deliveredShipments) { this.deliveredShipments = deliveredShipments; }
    public long getCancelledShipments() { return cancelledShipments; }
    public void setCancelledShipments(long cancelledShipments) { this.cancelledShipments = cancelledShipments; }
}
