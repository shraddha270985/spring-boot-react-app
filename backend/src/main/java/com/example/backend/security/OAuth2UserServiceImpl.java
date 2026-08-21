package com.example.backend.security;

import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class OAuth2UserServiceImpl extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public OAuth2UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oauth2User = super.loadUser(userRequest);
        Map<String, Object> attributes = oauth2User.getAttributes();

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String providerId = (String) attributes.get("sub");
        if (providerId == null) {
            // fallback to id
            Object id = attributes.get("id");
            providerId = id != null ? id.toString() : null;
        }
        String email = (String) attributes.get("email");
        String name = (String) attributes.getOrDefault("name", attributes.get("given_name"));

        if (email != null) {
            User user = userRepository.findByEmail(email).orElseGet(() -> {
                User u = new User();
                u.setEmail(email);
                u.setName(name != null ? name : email);
                u.setStatus("ACTIVE");
                return u;
            });
            user.setStatus("ACTIVE");
            // store provider info if columns exist
            try {
                java.lang.reflect.Field providerField = User.class.getDeclaredField("provider");
                java.lang.reflect.Field providerIdField = User.class.getDeclaredField("providerId");
                providerField.setAccessible(true);
                providerIdField.setAccessible(true);
                providerField.set(user, registrationId);
                providerIdField.set(user, providerId);
            } catch (NoSuchFieldException | IllegalAccessException ignored) {
            }
            userRepository.save(user);
        }

        return oauth2User;
    }
}
