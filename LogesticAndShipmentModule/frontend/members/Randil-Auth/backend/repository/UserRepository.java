package com.logistics.backend.repository;

import com.logistics.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * User Repository
 * Owner: Randil
 *
 * Data access layer for User entity.
 *
 * TODO:
 * - Add custom queries as needed (findByRole, findByNameContaining, etc.)
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
