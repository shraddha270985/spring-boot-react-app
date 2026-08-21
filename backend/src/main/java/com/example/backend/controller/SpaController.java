package com.example.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    @GetMapping({"/", "/loginSuccess", "/posts", "/manage-users", "/create-post"})
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}
