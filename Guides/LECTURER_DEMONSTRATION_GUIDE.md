# Lecturer Demonstration Guide - SCM System

This document is your step-by-step guide for presenting the SCM System's backend, frontend, and Postman API integration to your lecturer.

---

## Part 1: Starting the Services (Order of Startup)

### 1. Database Setup
* **Action**: Open **XAMPP Control Panel** and click **Start** next to **MySQL**.
* **What to tell the lecturer**:
  > *"First, we start our MySQL database server. All backend modules connect to their own designated schemas on this database server to persist data independently."*

### 2. Start the Backend Services
Open four separate command terminals or run the respective batch scripts in the `RunningCommands` folder:
1. **User Management Backend** (`start_user_backend.bat`): Runs on port **`8085`**
2. **Inventory Backend** (`start_inventory_backend.bat`): Runs on port **`8081`**
3. **Logistics Backend** (`start_logistics_backend.bat`): Runs on port **`8080`**
4. **Order & Billing Backend** (`start_order_backend.bat`): Runs on port **`8082`**

* **What to tell the lecturer**:
  > *"Each module's backend is a standalone Spring Boot application running on its own dedicated port. They compile on startup and run an embedded Tomcat web server. They do not depend on external web servers like IIS or standalone Apache Tomcat."*

### 3. Start the Frontend Services
Open four separate terminals and run the frontend batch scripts in `RunningCommands`:
1. **User Frontend** (`start_user_frontend.bat`): Port **`5175`**
2. **Inventory Frontend** (`start_inventory_frontend.bat`): Port **`3000`**
3. **Logistics Frontend** (`start_logistics_frontend.bat`): Port **`5173`**
4. **Order Frontend** (`start_order_frontend.bat`): Port **`5173`** *(runs on a dynamically selected free port if occupied)*

---

## Part 2: Proving the Backend is Active (Live Verification)

If the lecturer asks to see proof that the backends are running:

### 1. Show the Startup Logs
Point to any of the running black console screens and highlight the following log lines:
* `Tomcat initialized with port <PORT_NUMBER>`
* `Started <Application> in <X> seconds`

### 2. Direct Browser Request
Open your web browser and open:
* `http://localhost:8080/api/logistics/kpis` (Logistics KPIs)
* `http://localhost:8082/api/products` (Order & Billing Product Catalog)
Show them the formatted raw JSON response that comes directly from the database.

---

## Part 3: Step-by-Step Postman Demonstration

To demonstrate API integration, open **Postman** and run this exact workflow:

### Step 1: User Login
* **Method**: `POST`
* **URL**: `http://localhost:8085/api/auth/login`
* **Body (raw JSON)**:
  ```json
  {
    "email": "supplier@test.com",
    "password": "Password@123"
  }
  ```
* **Expected Output**: Returns user profile details and a long Jwt token (`"token": "eyJhbG..."`).
* **What to explain**:
  > *"Our User Management module handles authentication. It returns a signed JSON Web Token (JWT) that secures other protected endpoints in the system."*

### Step 2: Create a Product
* **Method**: `POST`
* **URL**: `http://localhost:8082/api/products`
* **Body (raw JSON)**:
  ```json
  {
    "name": "Integrated Laptop Keyboard",
    "sku": "KB-INTEG-99",
    "category": "Electronics",
    "price": 45.0,
    "stock": 200,
    "description": "OEM Laptop keyboard replacement"
  }
  ```
* **Expected Output**: Returns the created product with a new database ID.

### Step 3: Create an Order (Demonstrating Multi-Module Integration)
* **Method**: `POST`
* **URL**: `http://localhost:8082/api/orders`
* **Body (raw JSON)**:
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
        "quantity": 10
      }
    ]
  }
  ```
* **What to explain**:
  > *"When we post an order to the Order module, it automatically does three integration steps behind the scenes via REST APIs: First, it calls the User Management service to verify the Customer ID. Second, it calls the Inventory service to check and deduct the stock. Third, it calls the Logistics service to automatically register a new shipment."*
* **Verification**: Open Postman `GET http://localhost:8080/api/logistics/shipments` or check the logs to show a shipment was created automatically!
