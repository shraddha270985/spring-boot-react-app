package com.example.backend.controller;

import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/users/{userId}/roles")
public class UserRoleController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public UserRoleController(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @GetMapping
    public ResponseEntity<Set<Role>> getUserRoles(@PathVariable Long userId) {
        return userRepository.findById(userId)
                .map(user -> ResponseEntity.ok(user.getRoles()))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{roleId}")
    public ResponseEntity<User> addRoleToUser(@PathVariable Long userId, @PathVariable Long roleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        
        user.addRole(role);
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{roleId}")
    public ResponseEntity<User> removeRoleFromUser(@PathVariable Long userId, @PathVariable Long roleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        
        user.removeRole(role);
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }
}
