package com.logistics.backend.config;

/**
 * Security Configuration
 * Owner: Randil
 *
 * TODO: Implement Spring Security configuration
 *
 * Steps to implement:
 * 1. Add spring-boot-starter-security dependency to pom.xml:
 *    <dependency>
 *        <groupId>org.springframework.boot</groupId>
 *        <artifactId>spring-boot-starter-security</artifactId>
 *    </dependency>
 *
 * 2. Uncomment and configure the SecurityConfig class below
 * 3. Add JWT library if using token-based auth:
 *    <dependency>
 *        <groupId>io.jsonwebtoken</groupId>
 *        <artifactId>jjwt-api</artifactId>
 *        <version>0.12.5</version>
 *    </dependency>
 */

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.web.SecurityFilterChain;

// @Configuration
// @EnableWebSecurity
public class SecurityConfig {

    // TODO: Uncomment and implement when ready

    // @Bean
    // public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    //     http
    //         .csrf(csrf -> csrf.disable())
    //         .cors(cors -> {})
    //         .authorizeHttpRequests(auth -> auth
    //             .requestMatchers("/api/auth/**").permitAll()     // Auth endpoints are public
    //             .requestMatchers("/h2-console/**").permitAll()   // H2 console
    //             .anyRequest().authenticated()                     // Everything else requires auth
    //         )
    //         .headers(headers -> headers.frameOptions(f -> f.disable())); // For H2 console
    //
    //     return http.build();
    // }

    // @Bean
    // public PasswordEncoder passwordEncoder() {
    //     return new BCryptPasswordEncoder();
    // }
}
