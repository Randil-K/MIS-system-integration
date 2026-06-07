package com.logistics.backend.controller;

import com.logistics.backend.entity.User;
import com.logistics.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Authentication Controller
 * Owner: Randil
 *
 * Handles user login and registration endpoints.
 *
 * TODO:
 * - Add proper password hashing (BCrypt)
 * - Add JWT token generation
 * - Add input validation
 * - Add rate limiting
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * POST /api/auth/register
     * Register a new user account
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String email = request.get("email");
        String password = request.get("password");

        // TODO: Validate input (name, email format, password strength)

        // Check if email already exists
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Email already registered"));
        }

        // TODO: Hash the password before saving (use BCrypt)
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(password); // TODO: Hash this!
        user.setRole("USER");

        User saved = userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Registration successful");
        response.put("userId", saved.getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * POST /api/auth/login
     * Authenticate a user and return user info
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid email or password"));
        }

        User user = userOpt.get();

        // TODO: Compare hashed passwords (use BCrypt)
        if (!user.getPassword().equals(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid email or password"));
        }

        // TODO: Generate JWT token
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful");
        response.put("user", Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole()
        ));
        // response.put("token", jwtToken); // TODO: Add JWT

        return ResponseEntity.ok(response);
    }
}
