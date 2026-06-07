# Supply Chain Management E2E Integration Test Script
$ErrorActionPreference = "Stop"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "SCM SYSTEM INTEGRATION E2E TEST SUITE" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Ports
$userPort = 8085
$invPort = 8081
$orderPort = 8082
$logPort = 8080

$userId = $null
$productId = $null
$orderId = $null
$shipmentId = $null

# Verify backend services are online before running tests
Write-Host "Checking service status..." -ForegroundColor Cyan
$ports = @{
    "User Management Service" = $userPort
    "Inventory Service"       = $invPort
    "Order & Billing Service" = $orderPort
    "Logistics Service"       = $logPort
}

foreach ($service in $ports.Keys) {
    $port = $ports[$service]
    $check = Test-NetConnection -ComputerName localhost -Port $port -WarningAction SilentlyContinue
    if ($check.TcpTestSucceeded -ne $true) {
        Write-Error "[FAIL] $service is NOT running on port $port! Please run .\run_all.ps1 first to start the integrated system."
        exit
    }
}
Write-Host "All services are online. Proceeding with integration tests...`n" -ForegroundColor Green

function Assert-Status {
    param ($response, $expected, $message)
    if ($response.status -eq $expected) {
        Write-Host "[PASS] $message" -ForegroundColor Green
    } else {
        Write-Error "[FAIL] $message (Expected: $expected, Got: $($response.status))"
    }
}

# -------------------------------------------------------------------------
# Test 1: User Registration Field Input Validations
# -------------------------------------------------------------------------
Write-Host "`n1. Testing User Registration Input Validations..." -ForegroundColor Yellow
try {
    # Bad request with invalid email and contact number
    $badUser = @{
        name = ""
        email = "notanemail"
        password = "123"
        contactNumber = "invalidphone"
        role = "SUPPLIER"
    } | ConvertTo-Json -Depth 5
    
    Invoke-RestMethod -Uri "http://localhost:$userPort/api/auth/register" -Method Post -Body $badUser -ContentType "application/json"
    Write-Error "[FAIL] Expected registration validation error but call succeeded"
} catch {
    if ($null -eq $_.Exception.Response) {
        Write-Error "[FAIL] Network connection error checking user validations. Make sure User Management service is running."
        exit
    }
    $errStream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($errStream)
    $errBody = $reader.ReadToEnd() | ConvertFrom-Json
    if ($errBody.status -eq 400) {
        Write-Host "[PASS] User input validations rejected bad request: 400 Bad Request" -ForegroundColor Green
        Write-Host "Error Response: $($errBody | ConvertTo-Json -Depth 5)" -ForegroundColor DarkGray
    } else {
        Write-Error "[FAIL] User input validation error returned code $($errBody.status)"
    }
}

# -------------------------------------------------------------------------
# Test 2: Successful User Creation
# -------------------------------------------------------------------------
Write-Host "`n2. Registering a valid Customer account..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$goodUser = @{
    name = "Integrated E2E Customer"
    email = "customer_e2e_${timestamp}@example.com"
    password = "securePassword123"
    contactNumber = "+12025550199"
    role = "CUSTOMER"
} | ConvertTo-Json -Depth 5

$regUser = Invoke-RestMethod -Uri "http://localhost:$userPort/api/auth/register" -Method Post -Body $goodUser -ContentType "application/json"
$userId = $regUser.id
Write-Host "[PASS] Customer registered successfully. User ID: $userId" -ForegroundColor Green

# -------------------------------------------------------------------------
# Test 3: Product Input Validations
# -------------------------------------------------------------------------
Write-Host "`n3. Testing Product Creation Input Validations..." -ForegroundColor Yellow
try {
    # Bad product with blank name and negative price
    $badProduct = @{
        name = ""
        sku = ""
        category = "Electronics"
        unitPrice = -12.50
    } | ConvertTo-Json -Depth 5
    
    Invoke-RestMethod -Uri "http://localhost:$invPort/api/products" -Method Post -Body $badProduct -ContentType "application/json"
    Write-Error "[FAIL] Expected product validation error but call succeeded"
} catch {
    if ($null -eq $_.Exception.Response) {
        Write-Error "[FAIL] Network connection error checking product validations. Make sure Inventory service is running."
        exit
    }
    $errStream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($errStream)
    $errBody = $reader.ReadToEnd() | ConvertFrom-Json
    if ($errBody.status -eq 400) {
        Write-Host "[PASS] Product input validations rejected bad request: 400 Bad Request" -ForegroundColor Green
        Write-Host "Error Response: $($errBody | ConvertTo-Json -Depth 5)" -ForegroundColor DarkGray
    } else {
        Write-Error "[FAIL] Product input validation error returned code $($errBody.status)"
    }
}

# -------------------------------------------------------------------------
# Test 4: Creating Product & Setting Up Inventory
# -------------------------------------------------------------------------
Write-Host "`n4. Creating Product and Adding Inventory Stock..." -ForegroundColor Yellow
# Create Product locally in Order module first
$orderProductReq = @{
    name = "Integrated SCM Laptop"
    category = "Electronics"
    price = 1299.99
    stock = 0
    description = "NextGen enterprise laptop"
} | ConvertTo-Json -Depth 5

$orderProduct = Invoke-RestMethod -Uri "http://localhost:$orderPort/api/products" -Method Post -Body $orderProductReq -ContentType "application/json"
$productId = $orderProduct.id
Write-Host "[PASS] Product created in Order & Billing Module. ID: $productId" -ForegroundColor Green

# Create Product in Inventory module
$invProductReq = @{
    name = "Integrated SCM Laptop"
    sku = "LAPTOP-INT-SCM-${timestamp}"
    category = "Electronics"
    unitPrice = 1299.99
} | ConvertTo-Json -Depth 5

$invProduct = Invoke-RestMethod -Uri "http://localhost:$invPort/api/products" -Method Post -Body $invProductReq -ContentType "application/json"
Write-Host "[PASS] Product created in Inventory Module." -ForegroundColor Green

# Add 100 units of stock to Inventory Module
$addStockReq = @{
    productId = $productId
    quantity = 100
    referenceDoc = "E2E Stock Inbound"
} | ConvertTo-Json -Depth 5

$addStockRes = Invoke-RestMethod -Uri "http://localhost:$invPort/api/inventory/add" -Method Post -Body $addStockReq -ContentType "application/json"
Write-Host "[PASS] Stock added successfully to Inventory Module. QuantityOnHand: $($addStockRes.newQuantity)" -ForegroundColor Green

# -------------------------------------------------------------------------
# Test 5: Validation - Order Placement with Invalid Customer (Expect 404)
# -------------------------------------------------------------------------
Write-Host "`n5. Placing order with invalid customer (Expect 404)..." -ForegroundColor Yellow
try {
    $badOrder = @{
        customer = @{ id = 9999; address = "123 Main St" }
        items = @(
            @{ product = @{ id = $productId }; quantity = 5 }
        )
    } | ConvertTo-Json -Depth 5
    
    Invoke-RestMethod -Uri "http://localhost:$orderPort/api/orders" -Method Post -Body $badOrder -ContentType "application/json"
    Write-Error "[FAIL] Expected UserNotFoundException but order succeeded"
} catch {
    if ($null -eq $_.Exception.Response) {
        Write-Error "[FAIL] Network connection error checking order customer. Make sure Order & Billing service is running."
        exit
    }
    $errStream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($errStream)
    $errBody = $reader.ReadToEnd() | ConvertFrom-Json
    if ($errBody.status -eq 404) {
        Write-Host "[PASS] Order validation correctly rejected invalid customer: 404 Not Found" -ForegroundColor Green
        Write-Host "Error message: $($errBody.message)" -ForegroundColor DarkGray
    } else {
        Write-Error "[FAIL] Expected status 404 but got $($errBody.status)"
    }
}

# -------------------------------------------------------------------------
# Test 6: Validation - Order Placement with Insufficient Stock (Expect 409)
# -------------------------------------------------------------------------
Write-Host "`n6. Placing order with quantity exceeding available stock (Expect 409)..." -ForegroundColor Yellow
try {
    $overOrder = @{
        customer = @{ id = $userId; address = "789 Enterprise Way" }
        items = @(
            @{ product = @{ id = $productId }; quantity = 99999 }
        )
    } | ConvertTo-Json -Depth 5
    
    Invoke-RestMethod -Uri "http://localhost:$orderPort/api/orders" -Method Post -Body $overOrder -ContentType "application/json"
    Write-Error "[FAIL] Expected InsufficientStockException but order succeeded"
} catch {
    if ($null -eq $_.Exception.Response) {
        Write-Error "[FAIL] Network connection error checking order stock. Make sure Order & Billing service is running."
        exit
    }
    $errStream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($errStream)
    $errBody = $reader.ReadToEnd() | ConvertFrom-Json
    if ($errBody.status -eq 409) {
        Write-Host "[PASS] Order validation correctly rejected insufficient stock: 409 Conflict" -ForegroundColor Green
        Write-Host "Error message: $($errBody.message)" -ForegroundColor DarkGray
    } else {
        Write-Error "[FAIL] Expected status 409 but got $($errBody.status)"
    }
}

# -------------------------------------------------------------------------
# Test 7: Successful SCM Integrated Order Placement
# -------------------------------------------------------------------------
# Query stock before order placement
$invBefore = Invoke-RestMethod -Uri "http://localhost:$invPort/api/inventory" -Method Get
$laptopInvBefore = $invBefore | Where-Object { $_.productId -eq $productId }
$stockBefore = $laptopInvBefore.quantityOnHand

Write-Host "`n7. Placing successful integrated Order (5 units)..." -ForegroundColor Yellow
$goodOrder = @{
    customer = @{ id = $userId; address = "789 Enterprise Way" }
    items = @(
        @{ product = @{ id = $productId }; quantity = 5 }
    )
} | ConvertTo-Json -Depth 5

$placedOrder = Invoke-RestMethod -Uri "http://localhost:$orderPort/api/orders" -Method Post -Body $goodOrder -ContentType "application/json"
$orderId = $placedOrder.id
Write-Host "[PASS] Order placed successfully! Order ID: $orderId, Total: $($placedOrder.totalAmount), Status: $($placedOrder.status)" -ForegroundColor Green

# -------------------------------------------------------------------------
# Test 8: Downstream Effect - Automated Inventory Reduction Verification
# -------------------------------------------------------------------------
Write-Host "`n8. Verifying automated stock reduction in Inventory Module..." -ForegroundColor Yellow
$inventoryList = Invoke-RestMethod -Uri "http://localhost:$invPort/api/inventory" -Method Get
$laptopInv = $inventoryList | Where-Object { $_.productId -eq $productId }
$expectedStock = $stockBefore - 5
if ($laptopInv.quantityOnHand -eq $expectedStock) {
    Write-Host "[PASS] Inventory reduced automatically. QuantityOnHand: $($laptopInv.quantityOnHand) ($stockBefore - 5 = $expectedStock)" -ForegroundColor Green
} else {
    Write-Error "[FAIL] Expected quantity on hand to be $expectedStock but was $($laptopInv.quantityOnHand)"
}

# -------------------------------------------------------------------------
# Test 9: Downstream Effect - Automated Shipment & Tracking Creation Verification
# -------------------------------------------------------------------------
Write-Host "`n9. Verifying automated shipment creation in Logistics Module..." -ForegroundColor Yellow
$shipments = Invoke-RestMethod -Uri "http://localhost:$logPort/api/shipments/order/$orderId" -Method Get
if ($shipments.Count -gt 0) {
    $shipment = $shipments[0]
    $shipmentId = $shipment.shipmentId
    $trkNum = $shipment.trackingNumber
    Write-Host "[PASS] Shipment created automatically." -ForegroundColor Green
    Write-Host "Shipment ID: $shipmentId, Status: $($shipment.shipmentStatus)" -ForegroundColor DarkGray
    if ($trkNum -like "TRK*") {
        Write-Host "[PASS] Tracking number generated sequentially: $trkNum" -ForegroundColor Green
    } else {
        Write-Error "[FAIL] Unexpected tracking number format: $trkNum"
    }
} else {
    Write-Error "[FAIL] No shipment was created automatically for order $orderId"
}

# -------------------------------------------------------------------------
# Test 10: Status Synchronization Verification (Logistics -> Order Status)
# -------------------------------------------------------------------------
Write-Host "`n10. Testing delivery update and automated order status synchronization..." -ForegroundColor Yellow
# Update shipment to DELIVERED
$statusUpdate = @{
    status = "DELIVERED"
} | ConvertTo-Json -Depth 5

$updatedShipment = Invoke-RestMethod -Uri "http://localhost:$logPort/api/shipments/$shipmentId/status" -Method Put -Body $statusUpdate -ContentType "application/json"
Write-Host "[PASS] Shipment status updated to DELIVERED in Logistics Module." -ForegroundColor Green

# Retrieve order status from Order module and verify it's COMPLETED
$checkOrder = Invoke-RestMethod -Uri "http://localhost:$orderPort/api/orders/$orderId" -Method Get
if ($checkOrder.status -eq "COMPLETED") {
    Write-Host "[PASS] Order status updated automatically to COMPLETED!" -ForegroundColor Green
} else {
    Write-Error "[FAIL] Expected order status to be COMPLETED but was $($checkOrder.status)"
}

Write-Host "`n==================================================" -ForegroundColor Cyan
Write-Host "ALL INTEGRATION TESTS COMPLETED SUCCESSFULLY!" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
