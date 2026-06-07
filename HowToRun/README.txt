================================================================
   SCM SYSTEM - HOW TO RUN GUIDE
   Logistics & Shipment Management Module
================================================================

This folder contains step-by-step guides for running the
Logistics and Shipment Management module.

FILES IN THIS FOLDER:
--------------------------------------------------------------
  1_WITH_DOCKER.txt       --> Run using Docker (EASIEST WAY)
  2_WITHOUT_DOCKER.txt    --> Run locally without Docker
  3_PORTS_AND_URLS.txt    --> All ports, URLs, and API endpoints
  4_TROUBLESHOOTING.txt   --> Common errors and how to fix them

================================================================
QUICK START (Docker):
================================================================

  1. Make sure Docker Desktop is running (green whale in taskbar)
  2. Open PowerShell
  3. Type this command:

     cd "C:\Users\randi\OneDrive\Desktop\MIS system int\LogesticAndShipmentModule"

  4. Run:

     docker-compose up -d

  5. Open your browser and go to:

     http://localhost:5173

  That's it!

================================================================
QUICK START (Local - No Docker):
================================================================

  1. Start XAMPP -> Start MySQL only
  2. Open PowerShell -> go to backend folder -> run Maven
  3. Open another PowerShell -> go to frontend -> run npm
  4. Open browser: http://localhost:5173

  See 2_WITHOUT_DOCKER.txt for full details.

================================================================
