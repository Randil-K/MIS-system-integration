# SCM System - Postman API Testing Guide

This guide contains all endpoints, methods, and example JSON payloads for testing each backend module in Postman. Use this to demonstrate and test the SCM backend integration.

---

## 1. User Management Module
* **Base URL**: `http://localhost:8085`
* **Authentication**: Token-based security (JWT). Add `Authorization: Bearer <your_jwt_token>` header for protected endpoints after logging in.

### [POST] User Registration
* **Endpoint**: `/api/auth/register`
* **Request Body (JSON)**:
```json
{
  "name": "Bob Miller",
  "email": "bob@example.com",
  "password": "Password@123",
  "contactNumber": "0777654321",
  "role": "SUPPLIER"
}
```

### [POST] User Login
* **Endpoint**: `/api/auth/login`
* **Request Body (JSON)**:
```json
{
  "email": "bob@example.com",
  "password": "Password@123"
}
```
*(Copy the `token` from the response to use as the Bearer token in protected endpoints).*

### [GET] Get Public User Details (Public)
* **Endpoint**: `/api/public/users/by-email?email=bob@example.com`

---

## 2. Order & Billing Module
* **Base URL**: `http://localhost:8082`

### [GET] Get All Products
* **Endpoint**: `/api/products`

### [POST] Create a Product
* **Endpoint**: `/api/products`
* **Request Body (JSON)**:
```json
{
  "name": "Mechanic Keyboard",
  "sku": "KB-MECH-02",
  "category": "Peripherals",
  "price": 89.99,
  "stock": 150,
  "description": "RGB mechanical keyboard"
}
```

### [GET] Get All Customers
* **Endpoint**: `/api/customers`

### [POST] Create a Customer
* **Endpoint**: `/api/customers`
* **Request Body (JSON)**:
```json
{
  "name": "Alice Smith",
  "email": "alice@example.com",
  "contactNumber": "0771234567"
}
```

### [POST] Create an Order
* **Endpoint**: `/api/orders`
* **Request Body (JSON)**:
```json
{
  "customer": {
    "id": 1
  },
  "items": [
    {
      "product": {
        "id": 1
      },
      "quantity": 2
    }
  ]
}
```

### [POST] Generate an Invoice
* **Endpoint**: `/api/invoices`
* **Request Body (JSON)**:
```json
{
  "orderId": 1
}
```

---

## 3. Inventory Module
* **Base URL**: `http://localhost:8081`

### [GET] Get All Inventory
* **Endpoint**: `/api/inventory`

### [GET] Get Low Stock Alerts
* **Endpoint**: `/api/inventory/low-stock`

### [POST] Add Stock (Receive)
* **Endpoint**: `/api/inventory/add`
* **Request Body (JSON)**:
```json
{
  "productId": 1,
  "quantity": 50,
  "referenceDoc": "PO-99882"
}
```

### [POST] Reduce Stock
* **Endpoint**: `/api/inventory/reduce`
* **Request Body (JSON)**:
```json
{
  "productId": 1,
  "quantity": 10,
  "referenceDoc": "SO-11223"
}
```

---

## 4. Logistics & Shipment Module
* **Base URL**: `http://localhost:8080`

### [GET] Get KPIs
* **Endpoint**: `/api/logistics/kpis`

### [GET] Get All Warehouses
* **Endpoint**: `/api/logistics/warehouses`

### [POST] Create a Warehouse
* **Endpoint**: `/api/logistics/warehouses`
* **Request Body (JSON)**:
```json
{
  "id": "WH-005",
  "name": "Boston Distribution Hub",
  "location": "Boston, MA",
  "capacity": 55000,
  "current": 12000,
  "status": "Operational",
  "activeShipments": 10,
  "latitude": 42.3601,
  "longitude": -71.0589
}
```

### [GET] Get All Fleet Vehicles
* **Endpoint**: `/api/logistics/vehicles`

### [POST] Create a Fleet Vehicle
* **Endpoint**: `/api/logistics/vehicles`
* **Request Body (JSON)**:
```json
{
  "driver": "John Doe",
  "route": "Route 66",
  "status": "In Transit",
  "loadPercent": 85.0,
  "eta": "14:30",
  "location": "St. Louis, MO"
}
```
