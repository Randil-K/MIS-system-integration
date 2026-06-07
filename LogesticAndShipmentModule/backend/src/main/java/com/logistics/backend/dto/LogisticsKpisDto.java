package com.logistics.backend.dto;

public record LogisticsKpisDto(
    long totalWarehouses,
    long activeFleet,
    double fleetUtilizationPercent,
    double fuelEfficiencyMpg
) {}
