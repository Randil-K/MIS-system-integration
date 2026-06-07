package com.usermanagement.backend.service;

import com.usermanagement.backend.model.Role;
import com.usermanagement.backend.model.Status;
import com.usermanagement.backend.model.User;
import com.usermanagement.backend.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ActivityLogService activityLogService;

    @PostConstruct
    public void seedData() {
        if (userRepository.count() == 0) {
            System.out.println("Seeding default system users...");

            userRepository.save(User.builder()
                    .name("System Administrator")
                    .email("admin@system.com")
                    .password(passwordEncoder.encode("admin123"))
                    .contactNumber("+94 77 123 4567")
                    .role(Role.ADMIN)
                    .status(Status.ACTIVE)
                    .build());

            userRepository.save(User.builder()
                    .name("Operations Manager")
                    .email("manager@system.com")
                    .password(passwordEncoder.encode("manager123"))
                    .contactNumber("+94 77 987 6543")
                    .role(Role.MANAGER)
                    .status(Status.ACTIVE)
                    .build());

            userRepository.save(User.builder()
                    .name("Logistics Supplier")
                    .email("supplier@system.com")
                    .password(passwordEncoder.encode("supplier123"))
                    .contactNumber("+94 71 555 4321")
                    .role(Role.SUPPLIER)
                    .status(Status.ACTIVE)
                    .build());

            userRepository.save(User.builder()
                    .name("Warehouse Supervisor")
                    .email("warehouse@system.com")
                    .password(passwordEncoder.encode("warehouse123"))
                    .contactNumber("+94 72 888 1111")
                    .role(Role.WAREHOUSE_STAFF)
                    .status(Status.ACTIVE)
                    .build());

            System.out.println("Seeded 4 default system users successfully.");
        }
    }

    public User login(String email, String password) throws Exception {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email credentials!"));

        if (user.getStatus() == Status.INACTIVE) {
            throw new IllegalStateException("Your account is deactivated. Please contact the administrator.");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid password credentials!");
        }

        activityLogService.logActivity(user, "Logged in to the system successfully");
        return user;
    }

    public User register(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email address already in use!");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setStatus(Status.ACTIVE);
        if (user.getRole() == null) {
            user.setRole(Role.SUPPLIER);
        }

        User savedUser = userRepository.save(user);
        activityLogService.logActivity(savedUser, "Self-registered new account profile");
        return savedUser;
    }

    public User getProfile(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User profile not found."));
    }

    public User updateProfile(Long userId, String name, String email, String contactNumber) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User profile not found."));

        Optional<User> existing = userRepository.findByEmail(email);
        if (existing.isPresent() && !existing.get().getId().equals(userId)) {
            throw new IllegalArgumentException("Email address already in use by another user.");
        }

        user.setName(name);
        user.setEmail(email);
        user.setContactNumber(contactNumber);

        User updatedUser = userRepository.save(user);
        activityLogService.logActivity(updatedUser, "Updated own account profile details");
        return updatedUser;
    }

    public void changePassword(Long userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User profile not found."));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new IllegalArgumentException("Your current password choice was incorrect!");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        activityLogService.logActivity(user, "Successfully updated own account security password");
    }

    // ==========================================
    // ADMIN ACTIONS
    // ==========================================

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User account not found."));
    }

    public User adminCreateUser(User adminUser, User newUser) {
        if (userRepository.existsByEmail(newUser.getEmail())) {
            throw new IllegalArgumentException("Email address already in use!");
        }

        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        newUser.setStatus(Status.ACTIVE);

        User savedUser = userRepository.save(newUser);
        activityLogService.logActivity(adminUser, "Admin created user account for: " + newUser.getEmail());
        return savedUser;
    }

    public User adminUpdateUser(User adminUser, Long targetId, User updatedData) {
        User targetUser = userRepository.findById(targetId)
                .orElseThrow(() -> new IllegalArgumentException("User account not found."));

        Optional<User> existing = userRepository.findByEmail(updatedData.getEmail());
        if (existing.isPresent() && !existing.get().getId().equals(targetId)) {
            throw new IllegalArgumentException("Email address already in use by another user!");
        }

        targetUser.setName(updatedData.getName());
        targetUser.setEmail(updatedData.getEmail());
        targetUser.setContactNumber(updatedData.getContactNumber());
        targetUser.setRole(updatedData.getRole());
        targetUser.setStatus(updatedData.getStatus());

        User savedUser = userRepository.save(targetUser);
        activityLogService.logActivity(adminUser, "Admin updated user details for: " + savedUser.getEmail());
        return savedUser;
    }

    public User adminToggleStatus(User adminUser, Long targetId, Status status) {
        User targetUser = userRepository.findById(targetId)
                .orElseThrow(() -> new IllegalArgumentException("User account not found."));

        targetUser.setStatus(status);
        User savedUser = userRepository.save(targetUser);

        activityLogService.logActivity(adminUser, "Admin modified account status of " + savedUser.getEmail() + " to " + status);
        return savedUser;
    }

    public void adminDeleteUser(User adminUser, Long targetId) {
        if (adminUser.getId().equals(targetId)) {
            throw new IllegalArgumentException("Self-deletion is forbidden! You cannot remove your own administrator account.");
        }

        User targetUser = userRepository.findById(targetId)
                .orElseThrow(() -> new IllegalArgumentException("User account not found."));

        userRepository.delete(targetUser);
        activityLogService.logActivity(adminUser, "Admin permanently removed account of: " + targetUser.getEmail());
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
    }
}
