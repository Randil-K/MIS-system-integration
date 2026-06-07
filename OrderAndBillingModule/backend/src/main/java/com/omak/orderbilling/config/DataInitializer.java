package com.omak.orderbilling.config;

import com.omak.orderbilling.entity.User;
import com.omak.orderbilling.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) {
        // Create default admin user if no users exist
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword("admin123");
            admin.setFullName("Administrator");
            admin.setEmail("admin@omak.com");
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println(">>> Default admin user created: admin / admin123");
        }
    }
}
