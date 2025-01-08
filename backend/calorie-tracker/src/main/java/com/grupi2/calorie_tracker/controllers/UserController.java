package com.grupi2.calorie_tracker.controllers;

import com.grupi2.calorie_tracker.dto.LoginRequest;
import com.grupi2.calorie_tracker.entities.User;
import com.grupi2.calorie_tracker.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Registration
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User registeredUser = userService.registerUser(user);
            return ResponseEntity.ok(registeredUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<User> loginUser(@RequestBody LoginRequest loginRequest) {
        // Login logic
        return userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword())
                .map(user -> ResponseEntity.ok(user))
                .orElse(ResponseEntity.status(401).body(new User())); // Empty User in case of invalid login
    }
}
