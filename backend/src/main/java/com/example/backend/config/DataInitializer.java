package com.example.backend.config;

import com.example.backend.entity.Post;
import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.repository.PostRepository;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final RoleRepository roleRepository;

    public DataInitializer(UserRepository userRepository, PostRepository postRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Initializing sample data...");

        try {
            // Check if data already exists
            if (userRepository.count() > 0) {
                System.out.println("Data already exists. Skipping initialization.");
                return;
            }

            System.out.println("No existing data found. Initializing...");

            // Get or create roles
            System.out.println("Setting up roles...");
            Role adminRole = roleRepository.findAll().stream()
                    .filter(r -> r.getName().equals("ADMIN"))
                    .findFirst()
                    .orElseGet(() -> {
                        Role role = new Role();
                        role.setName("ADMIN");
                        return roleRepository.save(role);
                    });

            Role employeeRole = roleRepository.findAll().stream()
                    .filter(r -> r.getName().equals("EMPLOYEE"))
                    .findFirst()
                    .orElseGet(() -> {
                        Role role = new Role();
                        role.setName("EMPLOYEE");
                        return roleRepository.save(role);
                    });

            roleRepository.flush();

            // Merge roles to attach them to current session
            adminRole = roleRepository.findById(adminRole.getId()).orElseThrow();
            employeeRole = roleRepository.findById(employeeRole.getId()).orElseThrow();

            // Create admin user
            System.out.println("Creating users...");
            User adminUser = new User();
            adminUser.setName("Admin User");
            adminUser.setEmail("admin@example.com");
            adminUser.setStatus("ACTIVE");
            adminUser.setProvider("google");
            adminUser.setProviderId("admin123");
            Set<Role> adminRoles = new HashSet<>();
            adminRoles.add(adminRole);
            adminUser.setRoles(adminRoles);
            adminUser = userRepository.save(adminUser);
            userRepository.flush();

            // Create employee user
            User employeeUser = new User();
            employeeUser.setName("Employee User");
            employeeUser.setEmail("employee@example.com");
            employeeUser.setStatus("ACTIVE");
            employeeUser.setProvider("google");
            employeeUser.setProviderId("employee123");
            Set<Role> empRoles = new HashSet<>();
            empRoles.add(employeeRole);
            employeeUser.setRoles(empRoles);
            employeeUser = userRepository.save(employeeUser);
            userRepository.flush();

            // Create sample posts by admin
            System.out.println("Creating posts...");
            createPost("Getting Started with Spring Boot", 
                    "Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications that you can just run.",
                    "Backend", adminUser, 15, 8);

            createPost("Best Practices for Java Development", 
                    "Follow these best practices to write clean, maintainable, and efficient Java code.",
                    "Backend", adminUser, 23, 12);

            createPost("Microservices Architecture", 
                    "Learn about microservices architecture and how to build scalable applications.",
                    "Architecture", adminUser, 45, 18);

            createPost("Database Optimization Tips", 
                    "Optimize your database queries for better performance.",
                    "Database", adminUser, 34, 9);

            createPost("Security in Spring Applications", 
                    "Implement robust security in your Spring applications.",
                    "Security", adminUser, 56, 22);

            // Create sample posts by employee
            createPost("React Hooks Deep Dive", 
                    "Master React Hooks and understand how to use useState, useEffect, useContext.",
                    "Frontend", employeeUser, 12, 6);

            createPost("CSS Flexbox and Grid Guide", 
                    "Learn CSS Flexbox and Grid layout techniques.",
                    "Frontend", employeeUser, 18, 7);

            createPost("JavaScript Async/Await", 
                    "Understand JavaScript async/await syntax and how to work with Promises.",
                    "Frontend", employeeUser, 28, 11);

            createPost("Web Performance Optimization", 
                    "Improve your web application performance with optimization techniques.",
                    "Performance", employeeUser, 22, 10);

            createPost("Testing Your JavaScript Code", 
                    "Learn testing best practices for JavaScript applications.",
                    "Testing", employeeUser, 19, 8);

            postRepository.flush();
            System.out.println("Sample data initialization completed successfully!");
        } catch (Exception e) {
            System.err.println("Error during data initialization: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    private void createPost(String title, String content, String category, User user, int likes, int comments) {
        Post post = new Post();
        post.setTitle(title);
        post.setContent(content);
        post.setCategory(category);
        post.setUser(user);
        post.setLikes(likes);
        post.setComments(comments);
        postRepository.save(post);
    }
}
