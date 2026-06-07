# SCM Service Manual Running Commands

This folder contains easy-to-use batch (`.bat`) files to start individual SCM microservices separately.

---

## 🗄️ Step 1: Start the Database (MySQL)
Before starting any backend, the MySQL database server must be running.

### Using the Batch File:
*   Double-click [start_database.bat](file:///c:/Users/randi/OneDrive/Desktop/MIS%20system%20int/RunningCommands/start_database.bat) to start MySQL in the background (uses the default XAMPP location).

### Running Manually:
If you are using XAMPP, open the **XAMPP Control Panel** and click **Start** next to **MySQL** (port `3306`).

---

## 🖥️ Running Individual Services
You can run any service by double-clicking its respective `.bat` file in this folder, or manually running the commands below in your terminal from the project root directory.

### 1. User Management Module
*   **Backend** (:8085)
    *   *Batch File*: [start_user_backend.bat](file:///c:/Users/randi/OneDrive/Desktop/MIS%20system%20int/RunningCommands/start_user_backend.bat)
    *   *Manual Command*:
        ```powershell
        cd "UserManagmentModule\backend"
        .\mvnw.cmd spring-boot:run
        ```
*   **Frontend** (:5175)
    *   *Batch File*: [start_user_frontend.bat](file:///c:/Users/randi/OneDrive/Desktop/MIS%20system%20int/RunningCommands/start_user_frontend.bat)
    *   *Manual Command*:
        ```powershell
        cd "UserManagmentModule\frontend"
        npm run dev
        ```

### 2. Inventory Management Module
*   **Backend** (:8081)
    *   *Batch File*: [start_inventory_backend.bat](file:///c:/Users/randi/OneDrive/Desktop/MIS%20system%20int/RunningCommands/start_inventory_backend.bat)
    *   *Manual Command*:
        ```powershell
        cd "InventoryModuleNew\backend"
        mvn spring-boot:run
        ```
*   **Frontend** (:3000)
    *   *Batch File*: [start_inventory_frontend.bat](file:///c:/Users/randi/OneDrive/Desktop/MIS%20system%20int/RunningCommands/start_inventory_frontend.bat)
    *   *Manual Command*:
        ```powershell
        cd "InventoryModuleNew\frontend"
        npm start
        ```

### 3. Order & Billing Module
*   **Backend** (:8082)
    *   *Batch File*: [start_order_backend.bat](file:///c:/Users/randi/OneDrive/Desktop/MIS%20system%20int/RunningCommands/start_order_backend.bat)
    *   *Manual Command*:
        ```powershell
        cd "OrderAndBillingModule\backend"
        mvn spring-boot:run
        ```
*   **Frontend** (:5173 / :5174)
    *   *Batch File*: [start_order_frontend.bat](file:///c:/Users/randi/OneDrive/Desktop/MIS%20system%20int/RunningCommands/start_order_frontend.bat)
    *   *Manual Command*:
        ```powershell
        cd "OrderAndBillingModule\frontend"
        npm run dev
        ```

### 4. Logistics & Shipment Module
*   **Backend** (:8080)
    *   *Batch File*: [start_logistics_backend.bat](file:///c:/Users/randi/OneDrive/Desktop/MIS%20system%20int/RunningCommands/start_logistics_backend.bat)
    *   *Manual Command*:
        ```powershell
        cd "LogesticAndShipmentModule\backend"
        mvn spring-boot:run
        ```
*   **Frontend** (:5173 / :5174)
    *   *Batch File*: [start_logistics_frontend.bat](file:///c:/Users/randi/OneDrive/Desktop/MIS%20system%20int/RunningCommands/start_logistics_frontend.bat)
    *   *Manual Command*:
        ```powershell
        cd "LogesticAndShipmentModule\frontend"
        npm run dev
        ```
