package com.usermanagement.backend.controller;

import com.usermanagement.backend.dto.PasswordChangeRequest;
import com.usermanagement.backend.dto.ProfileUpdateRequest;
import com.usermanagement.backend.model.ActivityLog;
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

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private ActivityLogService activityLogService;

    private Long getAuthenticatedUserId() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Claims claims) {
            return ((Number) claims.get("id")).longValue();
        }
        throw new IllegalStateException("User not authenticated");
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile() {
        Long userId = getAuthenticatedUserId();
        User user = userService.getProfile(userId);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@jakarta.validation.Valid @RequestBody ProfileUpdateRequest request) {
        Long userId = getAuthenticatedUserId();
        User updated = userService.updateProfile(userId, request.getName(), request.getEmail(), request.getContactNumber());
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(@jakarta.validation.Valid @RequestBody PasswordChangeRequest request) {
        Long userId = getAuthenticatedUserId();
        userService.changePassword(userId, request.getOldPassword(), request.getNewPassword());
        return ResponseEntity.ok(Map.of("message", "Password updated successfully!"));
    }

    @GetMapping("/my-activities")
    public ResponseEntity<List<ActivityLog>> getMyActivities() {
        Long userId = getAuthenticatedUserId();
        List<ActivityLog> logs = activityLogService.getUserActivities(userId);
        return ResponseEntity.ok(logs);
    }
}
