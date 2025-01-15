package com.grupi2.calorie_tracker.controllers;

import com.grupi2.calorie_tracker.dto.EmailRequest;
import com.grupi2.calorie_tracker.dto.PasswordResetRequest;
import com.grupi2.calorie_tracker.entities.User;
import com.grupi2.calorie_tracker.security.JwtUtils;
import com.grupi2.calorie_tracker.services.EmailService;
import com.grupi2.calorie_tracker.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private EmailService emailService;

    
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

    @PostMapping("/send-confirmation")
    public ResponseEntity<?> sendConfirmationCode(@RequestBody EmailRequest request) {
        try {
            emailService.sendEmail(
                    request.getEmail(),
                    request.getSubject(),
                    request.getText()
            );
            return ResponseEntity.ok().body(Map.of("message", "Confirmation code sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to send confirmation code"));
        }
    }

    @PostMapping("/update-password")
    public ResponseEntity<?> updatePassword(@RequestBody PasswordResetRequest request) {
        try {
            // Validate input
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Email is required"));
            }

            if (request.getNewPassword() == null || request.getNewPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "New password is required"));
            }

            // Validate password strength with regex
            String passwordPattern = "^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?\":{}|<>])[A-Za-z\\d!@#$%^&*(),.?\":{}|<>]{8,}$";
            if (!request.getNewPassword().matches(passwordPattern)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Your password should have at least 8 letters, 1 capital letter, and 1 special character"));
            }

            // Update the password
            userService.updatePassword(request.getEmail(), request.getNewPassword());

            return ResponseEntity.ok()
                    .body(Map.of("message", "Password updated successfully"));

        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found"));

        } catch (Exception e) {
            logger.error("Error updating password for user: " + request.getEmail(), e);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "An error occurred while updating the password"));
        }
    }

}


