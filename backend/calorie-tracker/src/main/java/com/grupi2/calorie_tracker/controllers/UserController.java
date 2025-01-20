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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
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

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@RequestHeader("Authorization") String token) {
        try {

            String email = jwtUtils.getUserEmailFromToken(token.replace("Bearer ", ""));
            User user = userService.findByEmail(email);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "User not found"));
            }


            Map<String, Object> response = new HashMap<>();
            response.put("user", user);
            response.put("joinedDate", user.getCreatedAt());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }

    @PutMapping("/profile/update")
    public ResponseEntity<?> updateProfile(@RequestHeader("Authorization") String token,
                                           @RequestBody User updatedUser) {
        try {
            String email = jwtUtils.getUserEmailFromToken(token.replace("Bearer ", ""));
            User user = userService.findByEmail(email);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "User not found"));
            }

            user.setName(updatedUser.getName());

            if (!user.getEmail().equals(updatedUser.getEmail())) {
                if (userService.findByEmail(updatedUser.getEmail()) != null) {
                    return ResponseEntity.badRequest()
                            .body(Map.of("message", "Email already in use"));
                }
                user.setEmail(updatedUser.getEmail());
            }

            User savedUser = userService.updateUser(user);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to update profile"));
        }
    }

    @PostMapping("/password/reset")
    public ResponseEntity<?> resetPassword(@RequestHeader("Authorization") String token,
                                           @RequestBody PasswordResetRequest request) {
        try {
            String email = jwtUtils.getUserEmailFromToken(token.replace("Bearer ", ""));
            User user = userService.findByEmail(email);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "User not found"));
            }

            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Current password is incorrect"));
            }

            String passwordRegex = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).*$";
            if (!request.getNewPassword().matches(passwordRegex)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Password must contain at least one uppercase letter, one number, and one special character"));
            }

            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userService.updateUser(user);

            return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to reset password"));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Void> healthCheck() {
        return ResponseEntity.ok().build();
    }

}


