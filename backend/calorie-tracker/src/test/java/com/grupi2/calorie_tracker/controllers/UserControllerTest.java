package com.grupi2.calorie_tracker.controllers;

import com.grupi2.calorie_tracker.dto.EmailRequest;
import com.grupi2.calorie_tracker.dto.PasswordResetRequest;
import com.grupi2.calorie_tracker.entities.User;
import com.grupi2.calorie_tracker.security.JwtUtils;
import com.grupi2.calorie_tracker.services.EmailService;
import com.grupi2.calorie_tracker.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class UserControllerTest {

    @Mock
    private UserService userService;
    @Mock
    private JwtUtils jwtUtils;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private EmailService emailService;

    @InjectMocks
    private UserController userController;

    private User testUser;
    private String testToken;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setPassword("Test123!");
        testUser.setName("Test User");
        testUser.setRole(User.Role.USER);
        testUser.setCreatedAt(LocalDateTime.now());

        testToken = "Bearer test-token";
    }

    @Test
    void registerUser_Success() {
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userService.registerUser(any(User.class))).thenReturn(testUser);
        when(jwtUtils.generateToken(anyString())).thenReturn("test-token");

        ResponseEntity<?> response = userController.registerUser(testUser);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody() instanceof Map);

        Map<String, Object> responseBody = (Map<String, Object>) response.getBody();
        assertNotNull(responseBody.get("token"));
        assertNotNull(responseBody.get("user"));
    }

    @Test
    void registerUser_Failure() {
        when(userService.registerUser(any(User.class)))
                .thenThrow(new IllegalArgumentException("Email already exists"));

        ResponseEntity<?> response = userController.registerUser(testUser);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Email already exists", response.getBody());
    }

    @Test
    void loginUser_Success() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null);
        when(jwtUtils.generateToken(anyString())).thenReturn("test-token");
        when(userService.findByEmail(anyString())).thenReturn(testUser);

        ResponseEntity<?> response = userController.loginUser(testUser);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody() instanceof Map);
    }

    @Test
    void loginUser_Failure() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new RuntimeException("Invalid credentials"));

        ResponseEntity<?> response = userController.loginUser(testUser);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Invalid credentials", response.getBody());
    }

    @Test
    void logout_Success() {
        ResponseEntity<?> response = userController.logoutUser();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Logged out successfully", response.getBody());
    }

    @Test
    void getUserProfile_Success() {
        when(jwtUtils.getUserEmailFromToken(anyString())).thenReturn("test@example.com");
        when(userService.findByEmail(anyString())).thenReturn(testUser);

        ResponseEntity<?> response = userController.getUserProfile(testToken);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void getUserProfile_UserNotFound() {
        when(jwtUtils.getUserEmailFromToken(anyString())).thenReturn("test@example.com");
        when(userService.findByEmail(anyString())).thenReturn(null);

        ResponseEntity<?> response = userController.getUserProfile(testToken);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void updateProfile_Success() {
        User updatedUser = new User();
        updatedUser.setEmail("test@example.com");
        updatedUser.setName("Updated Name");

        when(jwtUtils.getUserEmailFromToken(anyString())).thenReturn("test@example.com");
        when(userService.findByEmail(anyString())).thenReturn(testUser);
        when(userService.updateUser(any(User.class))).thenReturn(testUser);

        ResponseEntity<?> response = userController.updateProfile(testToken, updatedUser);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(userService).updateUser(any(User.class));
    }

    @Test
    void updateProfile_EmailAlreadyInUse() {
        User updatedUser = new User();
        updatedUser.setEmail("new@example.com");

        when(jwtUtils.getUserEmailFromToken(anyString())).thenReturn("test@example.com");
        when(userService.findByEmail("test@example.com")).thenReturn(testUser);
        when(userService.findByEmail("new@example.com")).thenReturn(new User());

        ResponseEntity<?> response = userController.updateProfile(testToken, updatedUser);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void resetPassword_Success() {
        PasswordResetRequest request = new PasswordResetRequest();
        request.setCurrentPassword("oldPassword");
        request.setNewPassword("NewPassword123!");

        when(jwtUtils.getUserEmailFromToken(anyString())).thenReturn("test@example.com");
        when(userService.findByEmail(anyString())).thenReturn(testUser);
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");

        ResponseEntity<?> response = userController.resetPassword(testToken, request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(userService).updateUser(any(User.class));
    }

    @Test
    void resetPassword_InvalidCurrentPassword() {
        PasswordResetRequest request = new PasswordResetRequest();
        request.setCurrentPassword("wrongPassword");
        request.setNewPassword("NewPassword123!");

        when(jwtUtils.getUserEmailFromToken(anyString())).thenReturn("test@example.com");
        when(userService.findByEmail(anyString())).thenReturn(testUser);
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        ResponseEntity<?> response = userController.resetPassword(testToken, request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void resetPassword_InvalidNewPassword() {
        PasswordResetRequest request = new PasswordResetRequest();
        request.setCurrentPassword("oldPassword");
        request.setNewPassword("weak");

        when(jwtUtils.getUserEmailFromToken(anyString())).thenReturn("test@example.com");
        when(userService.findByEmail(anyString())).thenReturn(testUser);
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);

        ResponseEntity<?> response = userController.resetPassword(testToken, request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void healthCheck_Success() {
        ResponseEntity<Void> response = userController.healthCheck();
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
}