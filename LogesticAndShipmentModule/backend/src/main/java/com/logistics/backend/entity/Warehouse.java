package com.logistics.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "warehouses")
public class Warehouse {

    @Id
    private String id;
    private String name;
    private String location;
    private int capacity;
    private int current;
    private String status;
    private int activeShipments;
    private double latitude;
    private double longitude;

    public Warehouse() {}

    public Warehouse(String id, String name, String location, int capacity, int current, String status, int activeShipments, double latitude, double longitude) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.capacity = capacity;
        this.current = current;
        this.status = status;
        this.activeShipments = activeShipments;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }

    public int getCurrent() { return current; }
    public void setCurrent(int current) { this.current = current; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getActiveShipments() { return activeShipments; }
    public void setActiveShipments(int activeShipments) { this.activeShipments = activeShipments; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }
}
