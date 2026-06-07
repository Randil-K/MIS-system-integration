# SCM System Integration Guide

This guide details how the four core SCM modules (User Management, Order & Billing, Inventory, and Logistics & Shipment) integrate and communicate to form a unified supply chain system.

---

## 1. System Architecture Diagram

```text
                                +------------------------------+
                                |  User Management (:8085)     |
                                |       (user_db Schema)       |
                                +--------------^---------------+
                                               |
                                               | 1. Verify Customer
                                               |
+--------------------------+  2. Check Stock   +-------+-------+
|   Inventory Module       <------------------+               |
|      Port: 8081          +------------------>+  Order &      |
|   (inventory_db Schema)  |  3. Deduct Stock  |  Billing      |
+--------------------------+                   |  Port: 8082   |
                                               |  (order_db)   |
                                               +-------+-------+
                                                       |
                                                       | 4. Dispatch Shipment
                                                       v
                                        +--------------+---------------+
                                        |  Logistics & Shipment (:8080)|
                                        |      (logistics_db Schema)   |
                                        +--------------+---------------+
                                                       |
                                                       | 5. Sync Order Status
                                                       v (DELIVERED/CANCELLED)
```

---

## 2. Port & Database Allocations

| Module | Backend Port | Frontend Port | Database Schema |
| :--- | :--- | :--- | :--- |
| **Logistics & Shipment** | `8080` | `5173` | `logistics_db` |
| **Inventory Module** | `8081` | `3000` | `inventory_db` |
| **Order & Billing** | `8082` | `5173` (dynamic) | `order_and_Billing` |
| **User Management** | `8085` | `5175` | `user_db` |

---

## 3. Real-Time Integration Flow (Order Lifecycle)

When a customer places an order, the system processes it across all modules using Java's `RestTemplate` to perform HTTP request bindings.

### Trace of RestTemplate Integrations in the Codebase

#### Step 1: Customer Verification (Order $\rightarrow$ User Management)
Before creating the order, the Order service validates the customer's account status.
* **File**: `OrderServiceImpl.java`
* **Trigger Code**:
  ```java
  String url = userServiceUrl + "/api/public/users/" + order.getCustomerId();
  ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
  ```

#### Step 2: Stock Check (Order $\rightarrow$ Inventory)
The Order service validates that the product has sufficient quantity in the warehouse.
* **File**: `OrderServiceImpl.java`
* **Trigger Code**:
  ```java
  String checkUrl = inventoryServiceUrl + "/api/inventory/check/" + detail.getProductId() + "?quantity=" + detail.getQuantity();
  ResponseEntity<Map> checkResponse = restTemplate.getForEntity(checkUrl, Map.class);
  ```

#### Step 3: Stock Deduction (Order $\rightarrow$ Inventory)
Once stock is verified, the Order service instructs the Inventory service to deduct the purchased quantity.
* **File**: `OrderServiceImpl.java`
* **Trigger Code**:
  ```java
  String reduceUrl = inventoryServiceUrl + "/api/inventory/reduce";
  restTemplate.postForEntity(reduceUrl, reduceRequest, Map.class);
  ```

#### Step 4: Dispatch Shipment (Order $\rightarrow$ Logistics)
After the transaction is registered, the Order service calls the Logistics module to create a shipment dispatch tracking number.
* **File**: `OrderServiceImpl.java`
* **Trigger Code**:
  ```java
  String shipmentUrl = logisticsServiceUrl + "/api/logistics/shipments";
  restTemplate.postForEntity(shipmentUrl, shipmentRequest, Map.class);
  ```

#### Step 5: Order Status Synchronization (Logistics $\rightarrow$ Order)
When a driver delivers or cancels a shipment in the Logistics module, the Logistics module calls the Order module back to update the order's state to `COMPLETED` or `CANCELLED`.
* **File**: `ShipmentServiceImpl.java`
* **Trigger Code**:
  ```java
  String syncUrl = orderServiceUrl + "/api/orders/" + saved.getOrderId() + "/status?status=" + orderStatus;
  restTemplate.put(syncUrl, null);
  ```
