package com.example.backend.repository;

import com.example.backend.entity.Post;
import com.example.backend.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class PostRepositoryTests {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void findByUserId() {
        User user = new User(null, "Bob Test", "bob@test.com", "ACTIVE");
        user = userRepository.save(user);

        Post post = new Post();
        post.setTitle("Hello World");
        post.setContent("Content here");
        post.setUser(user);
        postRepository.save(post);

        List<Post> posts = postRepository.findByUser_Id(user.getId());
        assertEquals(1, posts.size());
        assertEquals("Hello World", posts.get(0).getTitle());
    }
}
