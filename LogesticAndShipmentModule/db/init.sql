-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS logistics_db;
USE logistics_db;

-- Table structure for warehouses
CREATE TABLE IF NOT EXISTS warehouses (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    location VARCHAR(255),
    capacity INT,
    current INT,
    status VARCHAR(255),
    active_shipments INT,
    latitude DOUBLE,
    longitude DOUBLE
);

-- Table structure for fleet_vehicles
CREATE TABLE IF NOT EXISTS fleet_vehicles (
    id VARCHAR(255) PRIMARY KEY,
    driver VARCHAR(255),
    route VARCHAR(255),
    status VARCHAR(255),
    load_percent INT,
    eta VARCHAR(255),
    location VARCHAR(255)
);

-- Table structure for fleet_utilization
CREATE TABLE IF NOT EXISTS fleet_utilization (
    day_name VARCHAR(255) PRIMARY KEY,
    utilization DOUBLE
);

-- Table structure for shipments
CREATE TABLE IF NOT EXISTS shipments (
    shipment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id VARCHAR(255),
    order_id BIGINT,
    customer_id BIGINT,
    delivery_address VARCHAR(255),
    tracking_number VARCHAR(255),
    courier_name VARCHAR(255),
    shipment_date DATETIME(6),
    expected_delivery_date DATETIME(6),
    shipment_status VARCHAR(255),
    product VARCHAR(255),
    destination VARCHAR(255),
    status VARCHAR(255),
    eta VARCHAR(255),
    progress INT,
    quantity INT,
    weight VARCHAR(255),
    dimensions VARCHAR(255),
    carrier VARCHAR(255),
    service VARCHAR(255),
    origin VARCHAR(255),
    estimated_delivery VARCHAR(255),
    sender_name VARCHAR(255),
    sender_phone VARCHAR(255),
    sender_email VARCHAR(255),
    recipient_name VARCHAR(255),
    recipient_phone VARCHAR(255),
    recipient_email VARCHAR(255),
    recipient_address VARCHAR(255),
    created_month VARCHAR(255)
);

-- Table structure for tracking_events
CREATE TABLE IF NOT EXISTS tracking_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    shipment_id VARCHAR(255),
    status VARCHAR(255),
    location VARCHAR(255),
    timestamp VARCHAR(255),
    description VARCHAR(255),
    completed BIT(1),
    icon_name VARCHAR(255)
);
