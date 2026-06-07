-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS orderbillingdb;
USE orderbillingdb;

-- Table structure for users
CREATE TABLE IF NOT EXISTS users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  role VARCHAR(50) NOT NULL DEFAULT 'USER',
  created_at DATETIME(6) NOT NULL
);

-- Insert default admin user
INSERT INTO users (username, password, full_name, email, role, created_at) VALUES
('admin', 'admin123', 'Administrator', 'admin@omak.com', 'ADMIN', NOW());

-- Table structure for customers
CREATE TABLE IF NOT EXISTS customers (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  address VARCHAR(255),
  email VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(255)
);

-- Table structure for products
CREATE TABLE IF NOT EXISTS products (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  price DECIMAL(38,2) NOT NULL,
  stock INT NOT NULL
);

-- Table structure for orders
CREATE TABLE IF NOT EXISTS orders (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_date DATETIME(6) NOT NULL,
  status VARCHAR(255) NOT NULL,
  total_amount DECIMAL(38,2) NOT NULL,
  customer_id BIGINT NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Table structure for order_items
CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(38,2) NOT NULL,
  subtotal DECIMAL(38,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Table structure for invoices
CREATE TABLE IF NOT EXISTS invoices (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  amount DECIMAL(38,2) NOT NULL,
  due_date DATE NOT NULL,
  issue_date DATE NOT NULL,
  status VARCHAR(255),
  order_id BIGINT NOT NULL UNIQUE,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Insert some mock data
INSERT INTO customers (name, email, phone, address) VALUES 
('Kamal Perera', 'kamal@gmail.com', '0771234567', 'Colombo 07'),
('Nimal Silva', 'nimal@gmail.com', '0719876543', 'Kandy');

INSERT INTO products (name, category, price, stock, description) VALUES 
('Laptop', 'Electronics', 150000.00, 10, 'Dell Inspiron'),
('Mouse', 'Accessories', 2500.00, 50, 'Wireless Mouse');
