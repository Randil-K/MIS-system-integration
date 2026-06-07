package com.logistics.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "fleet_vehicles")
public class FleetVehicle {

    @Id
    private String id;
    private String driver;
    private String route;
    private String status;
    private int loadPercent; // Rename load to loadPercent because "load" is a SQL reserved word in some databases
    private String eta;
    private String location;

    public FleetVehicle() {}

    public FleetVehicle(String id, String driver, String route, String status, int loadPercent, String eta, String location) {
        this.id = id;
        this.driver = driver;
        this.route = route;
        this.status = status;
        this.loadPercent = loadPercent;
        this.eta = eta;
        this.location = location;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDriver() { return driver; }
    public void setDriver(String driver) { this.driver = driver; }

    public String getRoute() { return route; }
    public void setRoute(String route) { this.route = route; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getLoadPercent() { return loadPercent; }
    public void setLoadPercent(int loadPercent) { this.loadPercent = loadPercent; }

    public String getEta() { return eta; }
    public void setEta(String eta) { this.eta = eta; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
