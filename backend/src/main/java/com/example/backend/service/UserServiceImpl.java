package com.example.backend.service;

import com.example.backend.entity.User;
import com.example.backend.exception.ApiValidationException;
import com.example.backend.exception.UserNotFoundException;
import com.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class UserServiceImpl implements UserService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User createUser(User user) {
        Map<String, String> errors = validateUserEmail(user.getEmail());
        if (errors.isEmpty() && userRepository.existsByEmail(user.getEmail())) {
            errors.put("email", "Email already exists");
        }
        if (!errors.isEmpty()) {
            throw new ApiValidationException(errors);
        }
        return userRepository.save(user);
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public User updateUser(Long id, User userDetails) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Map<String, String> errors = validateUserEmail(userDetails.getEmail());
            if (!user.getEmail().equals(userDetails.getEmail()) && errors.isEmpty() && userRepository.existsByEmail(userDetails.getEmail())) {
                errors.put("email", "Email already exists");
            }
            if (!errors.isEmpty()) {
                throw new ApiValidationException(errors);
            }
            user.setName(userDetails.getName());
            user.setEmail(userDetails.getEmail());
            user.setStatus(userDetails.getStatus());
            return userRepository.save(user);
        } else {
            throw new UserNotFoundException("User not found with id: " + id);
        }
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    private Map<String, String> validateUserEmail(String email) {
        Map<String, String> errors = new HashMap<>();
        if (email == null || email.isBlank()) {
            errors.put("email", "Email is required");
        } else if (!EMAIL_PATTERN.matcher(email).matches()) {
            errors.put("email", "Email should be valid");
        }
        return errors;
    }
}