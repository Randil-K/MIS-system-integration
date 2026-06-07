package com.omak.orderbilling.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "invoices")
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Order is required")
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @NotNull(message = "Issue date is required")
    @Column(nullable = false)
    private LocalDate issueDate;

    @NotNull(message = "Due date is required")
    @Column(nullable = false)
    private LocalDate dueDate;

    @NotNull(message = "Amount is required")
    @jakarta.validation.constraints.DecimalMin(value = "0.01", message = "Amount must be positive")
    @Column(nullable = false)
    private BigDecimal amount;

    @NotBlank(message = "Status is required")
    private String status; // PAID, UNPAID, OVERDUE

    @PrePersist
    protected void onCreate() {
        if (issueDate == null) {
            issueDate = LocalDate.now();
        }
        if (dueDate == null) {
            dueDate = issueDate.plusDays(30); // Default 30 days due date
        }
    }
}
