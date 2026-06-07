package com.usermanagement.backend.controller;

import com.usermanagement.backend.dto.LoginRequest;
import com.usermanagement.backend.dto.LoginResponse;
import com.usermanagement.backend.dto.RegisterRequest;
import com.usermanagement.backend.model.Role;
import com.usermanagement.backend.model.User;
import com.usermanagement.backend.security.JwtTokenProvider;
import com.usermanagement.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) throws Exception {
        User user = userService.login(loginRequest.getEmail(), loginRequest.getPassword());
        String token = jwtTokenProvider.generateToken(user);

        LoginResponse response = LoginResponse.builder()
                .token(token)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .contactNumber(user.getContactNumber())
                .role(user.getRole().name())
                .status(user.getStatus().name())
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@Valid @RequestBody RegisterRequest registerRequest) {
        Role assignedRole = Role.SUPPLIER;
        if (registerRequest.getRole() != null) {
            try {
                assignedRole = Role.valueOf(registerRequest.getRole().toUpperCase());
            } catch (IllegalArgumentException e) {
                // fallback to SUPPLIER
            }
        }

        User user = User.builder()
                .name(registerRequest.getName())
                .email(registerRequest.getEmail())
                .password(registerRequest.getPassword())
                .contactNumber(registerRequest.getContactNumber())
                .role(assignedRole)
                .build();

        User registered = userService.register(user);
        return ResponseEntity.ok(registered);
    }
}
