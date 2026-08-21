package com.example.backend.repository;

import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    java.util.List<User> findByStatus(String status);
    java.util.List<User> findByEmailContainingIgnoreCase(String fragment);
    java.util.List<User> findByRolesName(String roleName);
    java.util.Optional<User> findByEmail(String email);
}
