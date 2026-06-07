const { execSync } = require('child_process');
const tryExec = (cmd) => {
    try {
        console.log(execSync(cmd).toString());
    } catch (e) {
        console.error(e.message);
    }
};

// Add some fake data for orders
tryExec('docker exec shared-db mysql -u root -proot order_and_Billing -e "INSERT IGNORE INTO customers (id, name, email, phone, address) VALUES (1, \'John Doe\', \'john@example.com\', \'1234567890\', \'123 Main St, Anytown\');"');

// Orders were already inserted but let's insert one more just in case
tryExec('docker exec shared-db mysql -u root -proot order_and_Billing -e "INSERT IGNORE INTO orders (id, customer_id, order_date, status, total_amount) VALUES (1, 1, NOW(), \'COMPLETED\', 1500.00), (2, 1, NOW(), \'PENDING\', 500.00);"');

tryExec('docker exec shared-db mysql -u root -proot order_and_Billing -e "INSERT IGNORE INTO invoices (id, order_id, issue_date, due_date, amount, status) VALUES (1, 1, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 1500.00, \'PAID\'), (2, 2, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 500.00, \'UNPAID\');"');

// And logistics data
tryExec('docker exec shared-db mysql -u root -proot logistics_db -e "INSERT IGNORE INTO shipments (shipment_id, tracking_number, origin, destination, status, estimated_delivery, progress, quantity) VALUES (1, \'TRK-001\', \'New York\', \'Los Angeles\', \'IN_TRANSIT\', \'2026-06-10 10:00:00\', 50, 10);"');

