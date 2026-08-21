package com.example.backend.service;

import com.example.backend.entity.Post;
import com.example.backend.entity.User;
import com.example.backend.repository.PostRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public List<Post> getPostsByUserId(Long userId) {
        return postRepository.findByUser_Id(userId);
    }

    public Optional<Post> getPostById(Long id) {
        return postRepository.findById(id);
    }

    public Post createPost(Long userId, String title, String content, String category) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Post post = new Post();
        post.setTitle(title);
        post.setContent(content);
        post.setCategory(category != null ? category : "General");
        post.setUser(user);
        post.setLikes(0);
        post.setComments(0);
        
        return postRepository.save(post);
    }

    public Optional<Post> updatePost(Long postId, String title, String content, String category) {
        Optional<Post> postOpt = postRepository.findById(postId);
        if (postOpt.isPresent()) {
            Post post = postOpt.get();
            if (title != null) post.setTitle(title);
            if (content != null) post.setContent(content);
            if (category != null) post.setCategory(category);
            postRepository.save(post);
        }
        return postOpt;
    }

    public void deletePost(Long postId) {
        postRepository.deleteById(postId);
    }

    public Post likePost(Long postId) {
        Optional<Post> postOpt = postRepository.findById(postId);
        if (postOpt.isPresent()) {
            Post post = postOpt.get();
            post.setLikes(post.getLikes() + 1);
            return postRepository.save(post);
        }
        throw new RuntimeException("Post not found");
    }

    public Post commentPost(Long postId) {
        Optional<Post> postOpt = postRepository.findById(postId);
        if (postOpt.isPresent()) {
            Post post = postOpt.get();
            post.setComments(post.getComments() + 1);
            return postRepository.save(post);
        }
        throw new RuntimeException("Post not found");
    }
}
