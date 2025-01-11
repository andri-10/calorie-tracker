package com.grupi2.calorie_tracker.controllers;

import com.grupi2.calorie_tracker.entities.User;
import com.grupi2.calorie_tracker.security.JwtUtils;
import com.grupi2.calorie_tracker.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;  // Autowire AuthenticationManager

    // Endpoint to register a new user
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            // Ensure role is set to USER if not provided
            if (user.getRole() == null) {
                user.setRole(User.Role.USER);
            }

            // Encode the user's password before saving
            user.setPassword(passwordEncoder.encode(user.getPassword()));

            // Register the user in the system
            User registeredUser = userService.registerUser(user);

            // Generate JWT for the newly registered user
            String jwt = jwtUtils.generateToken(registeredUser.getEmail());

            // Prepare response body
            Map<String, Object> response = new HashMap<>();
            response.put("user", registeredUser);
            response.put("token", jwt);  // Include the token in the response body

            return ResponseEntity.ok(response);  // Return the token in the body
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    // Endpoint to login an existing user
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginUser) {
        try {
            // Authenticate the user
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginUser.getEmail(), loginUser.getPassword())
            );

            // Generate JWT for the authenticated user
            String jwt = jwtUtils.generateToken(loginUser.getEmail());
            User user = userService.findByEmail(loginUser.getEmail());

            // Prepare response body with token and user data
            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("user", user); // include user info if necessary
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Authentication failed for user: " + loginUser.getEmail());
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    // Add logout endpoint
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        return ResponseEntity.ok().body("Logged out successfully");
    }
}
