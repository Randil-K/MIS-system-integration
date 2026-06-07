package com.inventory.controller;

import com.inventory.entity.Inventory;
import com.inventory.entity.Product;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.repository.InventoryRepository;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.StockTransactionRepository;
import com.inventory.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Inventory> getAllInventory() {
        return inventoryService.getAllInventory();
    }

    @GetMapping("/low-stock")
    public List<Inventory> getLowStockAlerts() {
        return inventoryService.getLowStockAlerts();
    }

    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addStock(@RequestBody Map<String, Object> request) {
        Long productId = Long.valueOf(request.get("productId").toString());
        Integer quantity = Integer.valueOf(request.get("quantity").toString());
        String referenceDoc = request.get("referenceDoc").toString();

        Map<String, Object> response = inventoryService.addStock(productId, quantity, referenceDoc);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reduce")
    public ResponseEntity<Map<String, Object>> reduceStock(@RequestBody Map<String, Object> request) {
        Long productId = Long.valueOf(request.get("productId").toString());
        Integer quantity = Integer.valueOf(request.get("quantity").toString());
        String referenceDoc = request.get("referenceDoc").toString();

        Map<String, Object> response = inventoryService.reduceStock(productId, quantity, referenceDoc);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check/{id}")
    public ResponseEntity<Map<String, Boolean>> checkAvailability(
            @PathVariable Long id,
            @RequestParam Integer quantity) {
        boolean available = inventoryService.checkAvailability(id, quantity);
        Map<String, Boolean> response = new HashMap<>();
        response.put("available", available);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/receive")
    public ResponseEntity<Map<String, Object>> receiveFromProcurement(@RequestBody Map<String, Object> request) {
        return addStock(request);
    }

    @PostMapping("/reserve")
    public ResponseEntity<Map<String, Boolean>> reserveForOrder(@RequestBody Map<String, Object> request) {
        Long productId = Long.valueOf(request.get("productId").toString());
        Integer quantity = Integer.valueOf(request.get("quantity").toString());
        boolean available = inventoryService.checkAvailability(productId, quantity);
        Map<String, Boolean> response = new HashMap<>();
        response.put("reserved", available);
        return ResponseEntity.ok(response);
    }
}

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
class ProductController {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private StockTransactionRepository transactionRepository;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
        return ResponseEntity.ok(product);
    }

    @PostMapping
    public ResponseEntity<Product> addProduct(@Valid @RequestBody Product product) {
        Product savedProduct = productRepository.save(product);

        Inventory inventory = new Inventory();
        inventory.setProductId(savedProduct.getProductId());
        inventory.setQuantityOnHand(0);
        inventory.setReorderLevel(10);
        inventoryRepository.save(inventory);

        return ResponseEntity.ok(savedProduct);
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));

        String name = (String) request.get("name");
        String sku = (String) request.get("sku");
        String category = (String) request.get("category");
        Double unitPrice = Double.valueOf(request.get("unitPrice").toString());
        Integer reorderLevel = request.get("reorderLevel") != null ? Integer.valueOf(request.get("reorderLevel").toString()) : null;

        // SKU Uniqueness Check
        if (sku != null && !sku.equals(product.getSku())) {
            List<Product> allProducts = productRepository.findAll();
            boolean skuExists = allProducts.stream().anyMatch(p -> sku.equalsIgnoreCase(p.getSku()));
            if (skuExists) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Product with SKU '" + sku + "' already exists!");
                return ResponseEntity.badRequest().body(error);
            }
        }

        product.setName(name);
        product.setSku(sku);
        product.setCategory(category);
        product.setUnitPrice(unitPrice);
        Product updatedProduct = productRepository.save(product);

        if (reorderLevel != null) {
            Inventory inventory = inventoryRepository.findByProductId(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Inventory not found for product with ID: " + id));
            inventory.setReorderLevel(reorderLevel);
            inventoryRepository.save(inventory);
        }

        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Map<String, Object>> deleteProduct(@PathVariable Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));

        inventoryRepository.deleteByProductId(id);
        transactionRepository.deleteByProductId(id);
        productRepository.delete(product);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Product deleted successfully");
        return ResponseEntity.ok(response);
    }
}