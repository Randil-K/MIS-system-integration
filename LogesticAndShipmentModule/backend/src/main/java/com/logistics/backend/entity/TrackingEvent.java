package com.logistics.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tracking_events")
public class TrackingEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String shipmentId;
    private String status;
    private String location;
    private String timestamp;
    private String description;
    private boolean completed;
    private String iconName;

    public TrackingEvent() {}

    public TrackingEvent(String shipmentId, String status, String location, String timestamp, String description, boolean completed, String iconName) {
        this.shipmentId = shipmentId;
        this.status = status;
        this.location = location;
        this.timestamp = timestamp;
        this.description = description;
        this.completed = completed;
        this.iconName = iconName;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getShipmentId() { return shipmentId; }
    public void setShipmentId(String shipmentId) { this.shipmentId = shipmentId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public String getIconName() { return iconName; }
    public void setIconName(String iconName) { this.iconName = iconName; }
}
