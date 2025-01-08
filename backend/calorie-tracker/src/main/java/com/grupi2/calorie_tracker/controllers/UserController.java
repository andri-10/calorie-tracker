package com.grupi2.calorie_tracker.controllers;

import com.grupi2.calorie_tracker.entities.User;
import com.grupi2.calorie_tracker.security.JwtUtils;
import com.grupi2.calorie_tracker.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            // Set role to USER if not provided
            if (user.getRole() == null) {
                user.setRole(User.Role.USER);
            }

            // Register the user
            User registeredUser = userService.registerUser(user);

            // Create response with token
            String jwt = jwtUtils.generateToken(registeredUser.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("user", registeredUser);

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginUser) {
        try {
            // Authenticate user
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginUser.getEmail(), loginUser.getPassword())
            );

            // Generate token
            String jwt = jwtUtils.generateToken(loginUser.getEmail());
            User user = userService.findByEmail(loginUser.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("user", user);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }
}