package com.logistics.backend.repository;

import com.logistics.backend.entity.FleetUtilization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FleetUtilizationRepository extends JpaRepository<FleetUtilization, String> {
}
