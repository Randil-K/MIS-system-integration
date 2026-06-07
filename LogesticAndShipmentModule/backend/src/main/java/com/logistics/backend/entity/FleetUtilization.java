package com.logistics.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "fleet_utilization")
public class FleetUtilization {

    @Id
    @Column(name = "day_name")
    private String day;
    private double utilization;

    public FleetUtilization() {}

    public FleetUtilization(String day, double utilization) {
        this.day = day;
        this.utilization = utilization;
    }

    public String getDay() { return day; }
    public void setDay(String day) { this.day = day; }

    public double getUtilization() { return utilization; }
    public void setUtilization(double utilization) { this.utilization = utilization; }
}
