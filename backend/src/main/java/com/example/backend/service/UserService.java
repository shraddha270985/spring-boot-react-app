package com.example.backend.service;

import com.example.backend.entity.User;
import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> getAllUsers();
    User createUser(User user);
    Optional<User> getUserById(Long id);
    Optional<User> getUserByEmail(String email);
    User updateUser(Long id, User userDetails);
    void deleteUser(Long id);
}