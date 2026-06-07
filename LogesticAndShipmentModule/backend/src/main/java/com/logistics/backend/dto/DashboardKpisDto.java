package com.logistics.backend.dto;

public record DashboardKpisDto(
    long activeShipments,
    double onTimeDeliveryPercent,
    long delayedShipments,
    double fleetUtilizationPercent
) {}
