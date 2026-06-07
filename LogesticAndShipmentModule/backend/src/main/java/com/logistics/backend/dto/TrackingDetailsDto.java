package com.logistics.backend.dto;

import com.logistics.backend.entity.TrackingEvent;
import java.util.List;

public record TrackingDetailsDto(
    String id,
    String trackingNumber,
    String product,
    int quantity,
    String weight,
    String dimensions,
    String carrier,
    String service,
    String origin,
    String destination,
    String estimatedDelivery,
    String status,
    int progress,
    SenderDto sender,
    RecipientDto recipient,
    List<TrackingEvent> events
) {
    public record SenderDto(
        String name,
        String phone,
        String email
    ) {}

    public record RecipientDto(
        String name,
        String phone,
        String email,
        String address
    ) {}
}
