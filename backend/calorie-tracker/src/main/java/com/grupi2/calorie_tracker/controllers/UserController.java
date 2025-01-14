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
    private AuthenticationManager authenticationManager;  

    
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            
            if (user.getRole() == null) {
                user.setRole(User.Role.USER);
            }

            
            user.setPassword(passwordEncoder.encode(user.getPassword()));

            
            User registeredUser = userService.registerUser(user);

            
            String jwt = jwtUtils.generateToken(registeredUser.getEmail());

            
            Map<String, Object> response = new HashMap<>();
            response.put("user", registeredUser);
            response.put("token", jwt);  

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
            
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginUser.getEmail(), loginUser.getPassword())
            );

            
            String jwt = jwtUtils.generateToken(loginUser.getEmail());
            User user = userService.findByEmail(loginUser.getEmail());

            
            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("user", user); 
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Authentication failed for user: " + loginUser.getEmail());
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        return ResponseEntity.ok().body("Logged out successfully");
    }
}
