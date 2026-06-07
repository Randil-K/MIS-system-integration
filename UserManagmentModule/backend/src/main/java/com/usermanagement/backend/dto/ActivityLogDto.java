package com.usermanagement.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityLogDto {
    private Long id;
    private String action;
    private LocalDateTime timestamp;
    private Long userId;
    private String userName;
    private String userEmail;
    private String userRole;
}
