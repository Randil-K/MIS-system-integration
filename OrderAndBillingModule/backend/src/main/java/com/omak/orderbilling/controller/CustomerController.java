package com.omak.orderbilling.controller;

import com.omak.orderbilling.entity.Customer;
import com.omak.orderbilling.exception.ResourceNotFoundException;
import com.omak.orderbilling.exception.ValidationException;
import com.omak.orderbilling.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${integration.user-service.url:http://localhost:8085}")
    private String userServiceUrl;

    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + id));
        return ResponseEntity.ok(customer);
    }

    @PostMapping
    public Customer createCustomer(@Valid @RequestBody Customer customer) {
        // Automatically synchronize/register user in User Management system
        Map<String, Object> regReq = new HashMap<>();
        regReq.put("name", customer.getName());
        regReq.put("email", customer.getEmail());
        regReq.put("contactNumber", customer.getPhone() != null ? customer.getPhone() : "");
        regReq.put("password", "Password123!");
        regReq.put("role", "SUPPLIER");

        Long userId = null;
        try {
            String regUrl = userServiceUrl + "/api/auth/register";
            ResponseEntity<Map> response = restTemplate.postForEntity(regUrl, regReq, Map.class);
            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("id")) {
                userId = ((Number) body.get("id")).longValue();
            }
        } catch (HttpClientErrorException.BadRequest ex) {
            // Email might already be registered. Try to retrieve user details from User Management by email
            try {
                String lookupUrl = userServiceUrl + "/api/public/users/by-email?email=" + customer.getEmail();
                ResponseEntity<Map> response = restTemplate.getForEntity(lookupUrl, Map.class);
                Map<String, Object> body = response.getBody();
                if (body != null && body.containsKey("id")) {
                    userId = ((Number) body.get("id")).longValue();
                }
            } catch (Exception lookupEx) {
                throw new ValidationException("Failed to register customer: Email is already in use, and failed to retrieve existing User ID - " + lookupEx.getMessage());
            }
        } catch (Exception ex) {
            // Fallback: If User Management is offline or fails, throw exception so we don't save out-of-sync customer
            throw new ValidationException("Failed to synchronize customer details with User Management service: " + ex.getMessage());
        }

        if (userId == null) {
            throw new ValidationException("Could not retrieve a valid User ID from the User Management service.");
        }

        customer.setId(userId);
        return customerRepository.save(customer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @Valid @RequestBody Customer customerDetails) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + id));
        customer.setName(customerDetails.getName());
        customer.setEmail(customerDetails.getEmail());
        customer.setPhone(customerDetails.getPhone());
        customer.setAddress(customerDetails.getAddress());
        return ResponseEntity.ok(customerRepository.save(customer));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        if (!customerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Customer not found with ID: " + id);
        }
        customerRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
