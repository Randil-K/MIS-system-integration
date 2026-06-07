package com.omak.orderbilling.controller;

import com.omak.orderbilling.entity.Product;
import com.omak.orderbilling.exception.ResourceNotFoundException;
import com.omak.orderbilling.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${integration.inventory-service.url:http://localhost:8081}")
    private String inventoryServiceUrl;

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
        return ResponseEntity.ok(product);
    }

    @PostMapping
    public Product createProduct(@Valid @RequestBody Product product) {
        Product savedProduct = productRepository.save(product);

        // Synchronize product creation to Inventory Module
        try {
            Map<String, Object> invProductReq = new HashMap<>();
            invProductReq.put("name", savedProduct.getName());
            String cleanName = savedProduct.getName().replaceAll("[^a-zA-Z0-9]", "").toUpperCase();
            if (cleanName.length() > 10) {
                cleanName = cleanName.substring(0, 10);
            }
            String sku = "SKU-" + cleanName + "-" + savedProduct.getId();
            invProductReq.put("sku", sku);
            invProductReq.put("category", savedProduct.getCategory());
            invProductReq.put("unitPrice", savedProduct.getPrice());

            String regUrl = inventoryServiceUrl + "/api/products";
            restTemplate.postForEntity(regUrl, invProductReq, Map.class);
            
            // Sync initial stock to Inventory Module if stock is > 0
            if (savedProduct.getStock() != null && savedProduct.getStock() > 0) {
                Map<String, Object> addStockReq = new HashMap<>();
                addStockReq.put("productId", savedProduct.getId());
                addStockReq.put("quantity", savedProduct.getStock());
                addStockReq.put("referenceDoc", "Initial stock sync for Product #" + savedProduct.getId());
                
                String stockUrl = inventoryServiceUrl + "/api/inventory/add";
                restTemplate.postForEntity(stockUrl, addStockReq, Map.class);
            }
        } catch (Exception ex) {
            System.err.println("Warning: Failed to sync product to Inventory Module: " + ex.getMessage());
        }

        return savedProduct;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @Valid @RequestBody Product productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
        product.setName(productDetails.getName());
        product.setCategory(productDetails.getCategory());
        product.setPrice(productDetails.getPrice());
        product.setStock(productDetails.getStock());
        product.setDescription(productDetails.getDescription());
        Product savedProduct = productRepository.save(product);

        // Synchronize product update to Inventory Module
        try {
            Map<String, Object> invProductReq = new HashMap<>();
            invProductReq.put("name", savedProduct.getName());
            String cleanName = savedProduct.getName().replaceAll("[^a-zA-Z0-9]", "").toUpperCase();
            if (cleanName.length() > 10) {
                cleanName = cleanName.substring(0, 10);
            }
            String sku = "SKU-" + cleanName + "-" + savedProduct.getId();
            invProductReq.put("sku", sku);
            invProductReq.put("category", savedProduct.getCategory());
            invProductReq.put("unitPrice", savedProduct.getPrice());

            String updateUrl = inventoryServiceUrl + "/api/products/" + savedProduct.getId();
            restTemplate.put(updateUrl, invProductReq);
        } catch (Exception ex) {
            System.err.println("Warning: Failed to sync product update to Inventory Module: " + ex.getMessage());
        }

        return ResponseEntity.ok(savedProduct);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with ID: " + id);
        }
        productRepository.deleteById(id);

        // Synchronize deletion to Inventory Module
        try {
            String deleteUrl = inventoryServiceUrl + "/api/products/" + id;
            restTemplate.delete(deleteUrl);
        } catch (Exception ex) {
            System.err.println("Warning: Failed to sync product deletion to Inventory Module: " + ex.getMessage());
        }

        return ResponseEntity.noContent().build();
    }
}
