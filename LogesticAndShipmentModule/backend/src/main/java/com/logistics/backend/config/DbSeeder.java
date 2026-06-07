package com.logistics.backend.config;

import com.logistics.backend.entity.*;
import com.logistics.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DbSeeder implements CommandLineRunner {

    private final WarehouseRepository warehouseRepository;
    private final FleetVehicleRepository fleetVehicleRepository;
    private final FleetUtilizationRepository fleetUtilizationRepository;
    private final ShipmentRepository shipmentRepository;
    private final TrackingEventRepository trackingEventRepository;

    public DbSeeder(WarehouseRepository warehouseRepository,
                    FleetVehicleRepository fleetVehicleRepository,
                    FleetUtilizationRepository fleetUtilizationRepository,
                    ShipmentRepository shipmentRepository,
                    TrackingEventRepository trackingEventRepository) {
        this.warehouseRepository = warehouseRepository;
        this.fleetVehicleRepository = fleetVehicleRepository;
        this.fleetUtilizationRepository = fleetUtilizationRepository;
        this.shipmentRepository = shipmentRepository;
        this.trackingEventRepository = trackingEventRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        seedWarehouses();
        seedFleetVehicles();
        seedFleetUtilization();
        seedShipmentsAndEvents();
    }

    private void seedWarehouses() {
        if (warehouseRepository.count() == 0) {
            warehouseRepository.saveAll(List.of(
                new Warehouse("WH-001", "San Francisco Hub", "San Francisco, CA", 50000, 38500, "Operational", 145, 37.7749, -122.4194),
                new Warehouse("WH-002", "Chicago Distribution", "Chicago, IL", 75000, 62100, "Operational", 218, 41.8781, -87.6298),
                new Warehouse("WH-003", "New York Center", "New York, NY", 40000, 35800, "Near Capacity", 187, 40.7128, -74.0060),
                new Warehouse("WH-004", "Dallas Facility", "Dallas, TX", 60000, 28300, "Operational", 96, 32.7767, -96.7970)
            ));
        }
    }

    private void seedFleetVehicles() {
        if (fleetVehicleRepository.count() == 0) {
            fleetVehicleRepository.saveAll(List.of(
                new FleetVehicle("TRK-101", "John Martinez", "SF → LA", "In Transit", 85, "2h 15m", "Fresno, CA"),
                new FleetVehicle("TRK-102", "Sarah Johnson", "CHI → NYC", "In Transit", 92, "8h 30m", "Cleveland, OH"),
                new FleetVehicle("TRK-103", "Mike Chen", "DAL → HOU", "Loading", 45, "4h 10m", "Dallas, TX"),
                new FleetVehicle("TRK-104", "Emily Davis", "NYC → BOS", "In Transit", 78, "1h 45m", "Hartford, CT"),
                new FleetVehicle("TRK-105", "Robert Wilson", "SF → SEA", "Maintenance", 0, "N/A", "San Francisco, CA")
            ));
        }
    }

    private void seedFleetUtilization() {
        if (fleetUtilizationRepository.count() == 0) {
            fleetUtilizationRepository.saveAll(List.of(
                new FleetUtilization("Mon", 72),
                new FleetUtilization("Tue", 78),
                new FleetUtilization("Wed", 85),
                new FleetUtilization("Thu", 81),
                new FleetUtilization("Fri", 88),
                new FleetUtilization("Sat", 65),
                new FleetUtilization("Sun", 58)
            ));
        }
    }

    private void seedShipmentsAndEvents() {
        if (shipmentRepository.count() == 0) {
            // Seed Shipment 1
            Shipment s1 = new Shipment(
                "SH-2026-1847", "TRK847291JK9274", "Wireless Keyboards (50 units)", "New York, NY",
                "In Transit", "2 days", 65, 50, "45.5 kg", "120 x 80 x 60 cm",
                "FastTrack Logistics", "Express Delivery", "San Francisco, CA 94102", "2026-05-05 17:00",
                "TechParts Warehouse", "+1 (415) 555-0123", "shipping@techparts.com",
                "Elite Electronics Store", "+1 (212) 555-0198", "receiving@eliteelectronics.com",
                "145 West 34th Street, New York, NY 10001", "May"
            );
            shipmentRepository.save(s1);

            trackingEventRepository.saveAll(List.of(
                new TrackingEvent("SH-2026-1847", "Delivered", "New York Distribution Center", "2026-05-05 14:30", "Package delivered to recipient", false, "CheckCircle"),
                new TrackingEvent("SH-2026-1847", "Out for Delivery", "New York Local Hub", "2026-05-05 08:15", "Package loaded onto delivery vehicle", false, "Truck"),
                new TrackingEvent("SH-2026-1847", "In Transit", "Philadelphia Sorting Facility", "2026-05-04 22:45", "Package sorted and in transit to next facility", true, "MapPin"),
                new TrackingEvent("SH-2026-1847", "Departed", "Chicago Regional Hub", "2026-05-03 16:20", "Departed from regional distribution center", true, "MapPin"),
                new TrackingEvent("SH-2026-1847", "Processing", "Chicago Regional Hub", "2026-05-03 09:10", "Package received and processing at hub", true, "Package"),
                new TrackingEvent("SH-2026-1847", "Picked Up", "Warehouse - San Francisco, CA", "2026-05-02 14:00", "Package picked up from origin warehouse", true, "CheckCircle")
            ));

            // Seed Shipment 2
            Shipment s2 = new Shipment(
                "SH-2026-1846", "TRK298711AA1123", "USB-C Hubs (100 units)", "Los Angeles, CA",
                "On Time", "1 day", 85, 100, "15.0 kg", "50 x 40 x 30 cm",
                "FastTrack Logistics", "Standard Delivery", "San Francisco, CA 94102", "2026-05-04 12:00",
                "TechParts Warehouse", "+1 (415) 555-0123", "shipping@techparts.com",
                "Angeles Tech Supply", "+1 (310) 555-0982", "receiving@lattech.com",
                "892 Sunset Blvd, Los Angeles, CA 90028", "May"
            );
            shipmentRepository.save(s2);

            trackingEventRepository.saveAll(List.of(
                new TrackingEvent("SH-2026-1846", "In Transit", "Los Angeles Hub", "2026-05-03 18:30", "Sorted and outbound to local carrier", true, "MapPin"),
                new TrackingEvent("SH-2026-1846", "Processing", "San Francisco Regional Hub", "2026-05-02 21:00", "Processed at hub", true, "Package"),
                new TrackingEvent("SH-2026-1846", "Picked Up", "Warehouse - San Francisco, CA", "2026-05-02 10:00", "Shipment collected from vendor", true, "CheckCircle")
            ));

            // Seed Shipment 3
            Shipment s3 = new Shipment(
                "SH-2026-1845", "TRK992817BB2234", "Gaming Mice (75 units)", "Chicago, IL",
                "Delayed", "4 days", 40, 75, "22.3 kg", "80 x 60 x 50 cm",
                "Global Cargo", "Express Delivery", "San Francisco, CA 94102", "2026-05-08 15:00",
                "TechParts Warehouse", "+1 (415) 555-0123", "shipping@techparts.com",
                "Windy City Electronics", "+1 (312) 555-0412", "shipping@windycityelec.com",
                "455 N Michigan Ave, Chicago, IL 60611", "May"
            );
            shipmentRepository.save(s3);

            trackingEventRepository.saveAll(List.of(
                new TrackingEvent("SH-2026-1845", "Delayed", "Denver Regional Facility", "2026-05-04 13:40", "Delayed due to extreme winter weather conditions", true, "AlertTriangle"),
                new TrackingEvent("SH-2026-1845", "Processing", "Denver Regional Facility", "2026-05-04 06:15", "Arrived at regional facility", true, "Package"),
                new TrackingEvent("SH-2026-1845", "In Transit", "Outbound from San Francisco", "2026-05-03 04:00", "In transit across state lines", true, "Truck")
            ));

            // Seed Shipment 4
            Shipment s4 = new Shipment(
                "SH-2026-1844", "TRK482910CC3345", "Monitor Stands (30 units)", "Houston, TX",
                "Delivered", "Today", 100, 30, "65.0 kg", "150 x 100 x 80 cm",
                "FastTrack Logistics", "Priority Freight", "Dallas Warehouse Facility", "2026-05-01 10:00",
                "TechParts Warehouse", "+1 (415) 555-0123", "shipping@techparts.com",
                "Lone Star Retailers", "+1 (713) 555-0726", "receiving@lonestar.com",
                "1200 Travis St, Houston, TX 77002", "May"
            );
            shipmentRepository.save(s4);

            trackingEventRepository.saveAll(List.of(
                new TrackingEvent("SH-2026-1844", "Delivered", "Lone Star Retailers, Houston", "2026-05-01 10:00", "Delivered and signed by J. Doe", true, "CheckCircle"),
                new TrackingEvent("SH-2026-1844", "Out for Delivery", "Houston Local Hub", "2026-05-01 07:15", "Package loaded on local delivery truck", true, "Truck"),
                new TrackingEvent("SH-2026-1844", "Processing", "Houston Local Hub", "2026-04-30 22:00", "Arrived at distribution facility", true, "Package")
            ));

            // Seed Shipment 5
            Shipment s5 = new Shipment(
                "SH-2026-1843", "TRK884910DD4456", "Laptop Cooling Pads (60 units)", "Phoenix, AZ",
                "In Transit", "3 days", 55, 60, "18.0 kg", "60 x 50 x 40 cm",
                "AirLink Shipping", "Standard Delivery", "San Francisco, CA 94102", "2026-05-06 14:00",
                "TechParts Warehouse", "+1 (415) 555-0123", "shipping@techparts.com",
                "Desert Tech Solutions", "+1 (602) 555-0831", "receiving@deserttech.com",
                "200 E Van Buren St, Phoenix, AZ 85004", "May"
            );
            shipmentRepository.save(s5);

            trackingEventRepository.saveAll(List.of(
                new TrackingEvent("SH-2026-1843", "In Transit", "Los Angeles Distribution Center", "2026-05-04 11:30", "Departed facility and in transit to Phoenix", true, "MapPin"),
                new TrackingEvent("SH-2026-1843", "Processing", "San Francisco Hub", "2026-05-03 15:45", "Package sorted and prepared", true, "Package")
            ));

            // Add historical shipments for the bar charts (Jan-Apr)
            // Monthly shipment counts: Jan=245, Feb=312, Mar=289, Apr=401
            // We can add dummy records representing those shipments or we can just aggregate them by createdMonth in a custom query.
            // Let's seed actual historical Shipment entities with createdMonth set!
            // Wait, we can seed just enough shipments, or we can seed dummy shipments to yield those counts.
            // Let's seed dummy records to populate counts.
            seedHistoricalShipmentCounts("Jan", 245);
            seedHistoricalShipmentCounts("Feb", 312);
            seedHistoricalShipmentCounts("Mar", 289);
            seedHistoricalShipmentCounts("Apr", 401);
            // May shipments count: s1, s2, s3, s4, s5 are alreadyMay, let's add 373 more to hit the May target of 378.
            seedHistoricalShipmentCounts("May", 373);
        }
    }

    private void seedHistoricalShipmentCounts(String month, int count) {
        for (int i = 0; i < count; i++) {
            Shipment dummy = new Shipment();
            dummy.setId("HIST-" + month + "-" + i);
            dummy.setCreatedMonth(month);
            // Set some standard statuses to make KPI counts realistic
            if (i % 8 == 0) {
                dummy.setStatus("Delayed");
            } else if (i % 5 == 0) {
                dummy.setStatus("In Transit");
            } else if (i % 3 == 0) {
                dummy.setStatus("On Time");
            } else {
                dummy.setStatus("Delivered");
            }
            shipmentRepository.save(dummy);
        }
    }
}
