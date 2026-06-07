USE inventory_db;

INSERT INTO products (product_id, name, sku, category, unit_price) VALUES 
(1, 'Industrial Solar Inverter', 'SOL-INV-100', 'ELECTRONICS', 850.00),
(2, 'Copper Wire Coil 50m', 'COP-W-50', 'HARDWARE', 45.00),
(3, 'Lithium-ion Battery Pack', 'BAT-LI-200', 'ELECTRONICS', 1200.00);

INSERT INTO inventory (inventory_id, product_id, quantity_on_hand, reorder_level) VALUES 
(1, 1, 25, 5),
(2, 2, 150, 20),
(3, 3, 3, 5);

USE order_and_Billing;

INSERT INTO products (name, category, price, stock, description) VALUES 
('Industrial Solar Inverter', 'ELECTRONICS', 850.00, 25, 'High capacity solar inverter'),
('Copper Wire Coil 50m', 'HARDWARE', 45.00, 150, 'Industrial grade copper wire'),
('Lithium-ion Battery Pack', 'ELECTRONICS', 1200.00, 3, 'Rechargeable energy storage');

INSERT INTO customers (name, email, phone, address) VALUES 
('Acme Corp', 'contact@acmecorp.com', '+15550198', '123 Business Rd, Metropolis'),
('Wayne Enterprises', 'supplies@wayne.com', '+15550199', '1007 Mountain Drive, Gotham');
