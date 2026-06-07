package com.omak.orderbilling.controller;

import com.omak.orderbilling.entity.Invoice;
import com.omak.orderbilling.entity.Order;
import com.omak.orderbilling.exception.ResourceNotFoundException;
import com.omak.orderbilling.exception.ValidationException;
import com.omak.orderbilling.repository.InvoiceRepository;
import com.omak.orderbilling.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*")
public class InvoiceController {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public List<Invoice> getAllInvoices() {
        List<Invoice> invoices = invoiceRepository.findAll();
        // Force load nested customer data
        for (Invoice invoice : invoices) {
            if (invoice.getOrder() != null && invoice.getOrder().getCustomer() != null) {
                invoice.getOrder().getCustomer().getName();
            }
        }
        return invoices;
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<Invoice> getInvoiceById(@PathVariable Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with ID: " + id));
        if (invoice.getOrder() != null && invoice.getOrder().getCustomer() != null) {
            invoice.getOrder().getCustomer().getName();
        }
        return ResponseEntity.ok(invoice);
    }

    @PostMapping
    public Invoice createInvoice(@Valid @RequestBody Invoice invoice) {
        if (invoice.getOrder() == null || invoice.getOrder().getId() == null) {
            throw new ValidationException("Order details are required to generate invoice.");
        }
        Order order = orderRepository.findById(invoice.getOrder().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + invoice.getOrder().getId()));

        invoice.setOrder(order);
        if (invoice.getAmount() == null) {
            invoice.setAmount(order.getTotalAmount());
        }
        return invoiceRepository.save(invoice);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Invoice> updateInvoice(@PathVariable Long id, @Valid @RequestBody Invoice invoiceDetails) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with ID: " + id));
        
        if (invoiceDetails.getOrder() == null || invoiceDetails.getOrder().getId() == null) {
            throw new ValidationException("Order details are required.");
        }
        Order order = orderRepository.findById(invoiceDetails.getOrder().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + invoiceDetails.getOrder().getId()));

        invoice.setOrder(order);
        invoice.setIssueDate(invoiceDetails.getIssueDate());
        invoice.setDueDate(invoiceDetails.getDueDate());
        invoice.setAmount(invoiceDetails.getAmount());
        invoice.setStatus(invoiceDetails.getStatus());
        return ResponseEntity.ok(invoiceRepository.save(invoice));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Long id) {
        if (!invoiceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Invoice not found with ID: " + id);
        }
        invoiceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
