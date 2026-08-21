package com.example.backend.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;

    public OAuth2AuthenticationSuccessHandler(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        Object principal = authentication.getPrincipal();
        String email = null;
        if (principal instanceof OAuth2User) {
            OAuth2User oauth2User = (OAuth2User) principal;
            email = (String) oauth2User.getAttributes().get("email");
        }

        String token = jwtUtil.generateToken(email != null ? email : "anonymous");
        String redirectUri = System.getenv().getOrDefault("FRONTEND_URL", "http://localhost:8080");
        String emailParam = email != null ? ("&email=" + java.net.URLEncoder.encode(email, java.nio.charset.StandardCharsets.UTF_8)) : "";
        response.sendRedirect(redirectUri + "/loginSuccess?token=" + token + emailParam);
    }
}
