package com.logistics.backend.repository;

import com.logistics.backend.entity.TrackingEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrackingEventRepository extends JpaRepository<TrackingEvent, Long> {
    List<TrackingEvent> findByShipmentIdOrderByTimestampDesc(String shipmentId);
    void deleteByShipmentId(String shipmentId);
}
