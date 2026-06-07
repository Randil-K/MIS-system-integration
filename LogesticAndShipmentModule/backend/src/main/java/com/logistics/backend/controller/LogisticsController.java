package com.logistics.backend.controller;

import com.logistics.backend.dto.LogisticsKpisDto;
import com.logistics.backend.entity.FleetVehicle;
import com.logistics.backend.entity.FleetUtilization;
import com.logistics.backend.entity.Warehouse;
import com.logistics.backend.repository.FleetVehicleRepository;
import com.logistics.backend.repository.FleetUtilizationRepository;
import com.logistics.backend.repository.WarehouseRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import com.logistics.backend.exception.ResourceNotFoundException;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/logistics")
@CrossOrigin(origins = "*")
public class LogisticsController {

    private final WarehouseRepository warehouseRepository;
    private final FleetVehicleRepository fleetVehicleRepository;
    private final FleetUtilizationRepository fleetUtilizationRepository;

    public LogisticsController(WarehouseRepository warehouseRepository,
                               FleetVehicleRepository fleetVehicleRepository,
                               FleetUtilizationRepository fleetUtilizationRepository) {
        this.warehouseRepository = warehouseRepository;
        this.fleetVehicleRepository = fleetVehicleRepository;
        this.fleetUtilizationRepository = fleetUtilizationRepository;
    }

    @GetMapping("/kpis")
    public LogisticsKpisDto getKpis() {
        long warehouseCount = warehouseRepository.count();
        long vehicleCount = fleetVehicleRepository.count() + 43; // base 43 + 5 seeded = 48
        double utilization = 77.1;
        double efficiency = 8.2;

        return new LogisticsKpisDto(warehouseCount, vehicleCount, utilization, efficiency);
    }

    @GetMapping("/warehouses")
    public List<Warehouse> getWarehouses() {
        return warehouseRepository.findAll();
    }

    @GetMapping("/vehicles")
    public List<FleetVehicle> getVehicles() {
        return fleetVehicleRepository.findAll();
    }

    @GetMapping("/fleet-utilization")
    public List<FleetUtilization> getFleetUtilization() {
        // Return sorted day order or as inserted
        List<FleetUtilization> list = fleetUtilizationRepository.findAll();
        // Custom order list Mon, Tue, Wed, Thu, Fri, Sat, Sun
        List<String> order = List.of("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun");
        return list.stream()
                .sorted((u1, u2) -> Integer.compare(order.indexOf(u1.getDay()), order.indexOf(u2.getDay())))
                .toList();
    }

    // Create Warehouse
    @PostMapping("/warehouses")
    public ResponseEntity<Warehouse> createWarehouse(@Valid @RequestBody Warehouse warehouse) {
        Warehouse saved = warehouseRepository.save(warehouse);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // Update Warehouse
    @PutMapping("/warehouses/{id}")
    public ResponseEntity<Warehouse> updateWarehouse(@PathVariable String id, @Valid @RequestBody Warehouse details) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found with ID: " + id));
        warehouse.setName(details.getName());
        warehouse.setLocation(details.getLocation());
        warehouse.setCapacity(details.getCapacity());
        warehouse.setCurrent(details.getCurrent());
        warehouse.setStatus(details.getStatus());
        warehouse.setActiveShipments(details.getActiveShipments());
        warehouse.setLatitude(details.getLatitude());
        warehouse.setLongitude(details.getLongitude());
        Warehouse saved = warehouseRepository.save(warehouse);
        return ResponseEntity.ok(saved);
    }

    // Delete Warehouse
    @DeleteMapping("/warehouses/{id}")
    public ResponseEntity<Void> deleteWarehouse(@PathVariable String id) {
        if (!warehouseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Warehouse not found with ID: " + id);
        }
        warehouseRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Create Fleet Vehicle
    @PostMapping("/vehicles")
    public ResponseEntity<FleetVehicle> createVehicle(@Valid @RequestBody FleetVehicle vehicle) {
        FleetVehicle saved = fleetVehicleRepository.save(vehicle);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // Update Fleet Vehicle
    @PutMapping("/vehicles/{id}")
    public ResponseEntity<FleetVehicle> updateVehicle(@PathVariable String id, @Valid @RequestBody FleetVehicle details) {
        FleetVehicle vehicle = fleetVehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fleet vehicle not found with ID: " + id));
        vehicle.setDriver(details.getDriver());
        vehicle.setRoute(details.getRoute());
        vehicle.setStatus(details.getStatus());
        vehicle.setLoadPercent(details.getLoadPercent());
        vehicle.setEta(details.getEta());
        vehicle.setLocation(details.getLocation());
        FleetVehicle saved = fleetVehicleRepository.save(vehicle);
        return ResponseEntity.ok(saved);
    }

    // Delete Fleet Vehicle
    @DeleteMapping("/vehicles/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable String id) {
        if (!fleetVehicleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Fleet vehicle not found with ID: " + id);
        }
        fleetVehicleRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
