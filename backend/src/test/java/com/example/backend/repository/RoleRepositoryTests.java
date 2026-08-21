package com.example.backend.repository;

import com.example.backend.entity.Role;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class RoleRepositoryTests {

    @Autowired
    private RoleRepository roleRepository;

    @Test
    void saveAndFindByName() {
        Role role = new Role();
        role.setName("ADMIN");
        roleRepository.save(role);

        assertTrue(roleRepository.existsByName("ADMIN"));
        Optional<Role> found = roleRepository.findByName("ADMIN");
        assertTrue(found.isPresent());
        assertEquals("ADMIN", found.get().getName());
    }
}
