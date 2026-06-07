package com.logistics.backend.repository;

import com.logistics.backend.entity.FleetVehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FleetVehicleRepository extends JpaRepository<FleetVehicle, String> {
}
