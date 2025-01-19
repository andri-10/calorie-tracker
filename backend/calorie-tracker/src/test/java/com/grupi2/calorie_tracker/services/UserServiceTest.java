package com.grupi2.calorie_tracker.services;

import com.grupi2.calorie_tracker.entities.User;
import com.grupi2.calorie_tracker.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setEmail("test@example.com");
        user.setPassword("password123");
    }

    @Test
    public void registerUser_EmailAlreadyInUse_ThrowsException() {
        // Given
        when(userRepository.findByEmail(user.getEmail())).thenReturn(user);

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> userService.registerUser(user));
    }

    @Test
    public void registerUser_Success() {
        // Given
        when(userRepository.findByEmail(user.getEmail())).thenReturn(null);
        when(userRepository.save(user)).thenReturn(user);
        when(passwordEncoder.encode(user.getPassword())).thenReturn("encodedPassword");

        // When
        User result = userService.registerUser(user);

        // Then
        assertNotNull(result);
        assertEquals("encodedPassword", result.getPassword());
        verify(userRepository).save(user);
    }

    @Test
    public void findByEmail_UserNotFound_ReturnsNull() {
        // Given
        when(userRepository.findByEmail(user.getEmail())).thenReturn(null);

        // When
        User result = userService.findByEmail(user.getEmail());

        // Then
        assertNull(result);
    }

    @Test
    public void findByEmail_UserFound_ReturnsUser() {
        // Given
        when(userRepository.findByEmail(user.getEmail())).thenReturn(user);

        // When
        User result = userService.findByEmail(user.getEmail());

        // Then
        assertNotNull(result);
        assertEquals(user.getEmail(), result.getEmail());
    }

    @Test
    public void getUserById_UserFound_ReturnsUser() {
        // Given
        when(userRepository.findById(1L)).thenReturn(java.util.Optional.of(user));

        // When
        User result = userService.getUserById(1L);

        // Then
        assertNotNull(result);
        assertEquals(user.getEmail(), result.getEmail());
    }

    @Test
    public void getUserById_UserNotFound_ThrowsException() {
        // Given
        when(userRepository.findById(1L)).thenReturn(java.util.Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> userService.getUserById(1L));
    }

    @Test
    public void updatePassword_UserNotFound_ThrowsException() {
        // Given
        when(userRepository.findByEmail(user.getEmail())).thenReturn(null);

        // When & Then
        assertThrows(UsernameNotFoundException.class, () -> userService.updatePassword(user.getEmail(), "newPassword"));
    }

    @Test
    public void updatePassword_Success() {
        // Given
        when(userRepository.findByEmail(user.getEmail())).thenReturn(user);
        when(passwordEncoder.encode("newPassword")).thenReturn("encodedNewPassword");

        // When
        userService.updatePassword(user.getEmail(), "newPassword");

        // Then
        assertEquals("encodedNewPassword", user.getPassword());
        verify(userRepository).save(user);
    }

    @Test
    public void updateUser_Success() {
        // Given
        when(userRepository.save(user)).thenReturn(user);

        // When
        User updatedUser = userService.updateUser(user);

        // Then
        assertNotNull(updatedUser);
        verify(userRepository).save(user);
    }
}
