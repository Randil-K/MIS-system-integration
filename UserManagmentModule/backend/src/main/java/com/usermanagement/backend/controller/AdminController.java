package com.usermanagement.backend.controller;

import com.usermanagement.backend.dto.ActivityLogDto;
import com.usermanagement.backend.dto.RegisterRequest;
import com.usermanagement.backend.dto.StatusUpdateRequest;
import com.usermanagement.backend.model.ActivityLog;
import com.usermanagement.backend.model.Role;
import com.usermanagement.backend.model.Status;
import com.usermanagement.backend.model.User;
import com.usermanagement.backend.service.ActivityLogService;
import com.usermanagement.backend.service.UserService;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private ActivityLogService activityLogService;

    private User getAuthenticatedAdmin() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Claims claims) {
            Long id = ((Number) claims.get("id")).longValue();
            return userService.getProfile(id);
        }
        throw new IllegalStateException("Admin not authenticated");
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@jakarta.validation.Valid @RequestBody RegisterRequest registerRequest) {
        User admin = getAuthenticatedAdmin();

        Role assignedRole = Role.SUPPLIER;
        if (registerRequest.getRole() != null) {
            assignedRole = Role.valueOf(registerRequest.getRole().toUpperCase());
        }

        User user = User.builder()
                .name(registerRequest.getName())
                .email(registerRequest.getEmail())
                .password(registerRequest.getPassword())
                .contactNumber(registerRequest.getContactNumber())
                .role(assignedRole)
                .build();

        User created = userService.adminCreateUser(admin, user);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedData) {
        User admin = getAuthenticatedAdmin();
        User updated = userService.adminUpdateUser(admin, id, updatedData);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<User> toggleUserStatus(@PathVariable Long id, @jakarta.validation.Valid @RequestBody StatusUpdateRequest statusRequest) {
        User admin = getAuthenticatedAdmin();
        Status status = Status.valueOf(statusRequest.getStatus().toUpperCase());
        User updated = userService.adminToggleStatus(admin, id, status);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        User admin = getAuthenticatedAdmin();
        userService.adminDeleteUser(admin, id);
        return ResponseEntity.ok(Map.of("message", "User account removed successfully!"));
    }

    @GetMapping("/activities")
    public ResponseEntity<List<ActivityLogDto>> getGlobalActivities() {
        List<ActivityLog> logs = activityLogService.getGlobalActivities();
        List<ActivityLogDto> dtos = logs.stream().map(log -> {
            User u = log.getUser();
            return ActivityLogDto.builder()
                    .id(log.getId())
                    .action(log.getAction())
                    .timestamp(log.getTimestamp())
                    .userId(u != null ? u.getId() : null)
                    .userName(u != null ? u.getName() : null)
                    .userEmail(u != null ? u.getEmail() : null)
                    .userRole(u != null ? u.getRole().name() : null)
                    .build();
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }
}
