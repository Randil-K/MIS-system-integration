package com.logistics.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentStatusUpdateDTO {

    @NotBlank(message = "Status string is required")
    private String status;
}
