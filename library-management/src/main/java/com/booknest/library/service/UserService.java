package com.booknest.library.service;

import com.booknest.library.dto.AuthResponseDTO;
import com.booknest.library.dto.RegisterRequestDTO;
import com.booknest.library.dto.UserResponseDTO;
import com.booknest.library.model.User;
import com.booknest.library.repository.UserRepository;
import com.booknest.library.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // ============ REGISTER ============
    public UserResponseDTO registerUser(RegisterRequestDTO dto) {

        // 1. Basic validation
        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new RuntimeException("Name is required");
        }
        if (dto.getEmail() == null || dto.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }
        if (!dto.getEmail().contains("@")) {
            throw new RuntimeException("Invalid email format");
        }
        if (dto.getPassword() == null || dto.getPassword().length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters");
        }

        // 2. Check if email already exists
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists: " + dto.getEmail());
        }

        // 3. Create user with encrypted password
        User user = new User();
        user.setName(dto.getName().trim());
        user.setEmail(dto.getEmail().trim().toLowerCase());

        // BCrypt encryption: 123456 -> $2a$10$...
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole("USER");

        User saved = userRepository.save(user);

        // 4. Return DTO without password
        return convertToResponseDTO(saved);
    }

    // ============ LOGIN ============
    public AuthResponseDTO loginUser(String email, String password) {

        // 1. Find user by email
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        // 2. Verify password with BCrypt
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials: email or password incorrect");
        }

        // 3. Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        // 4. Convert to DTOs
        UserResponseDTO userDTO = convertToResponseDTO(user);

        // 5. Return token + user
        return new AuthResponseDTO(token, userDTO);
    }

    // ============ Helper - Entity to DTO ============
    public UserResponseDTO convertToResponseDTO(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
}