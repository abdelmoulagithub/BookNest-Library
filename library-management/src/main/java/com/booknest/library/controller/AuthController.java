package com.booknest.library.controller;

import com.booknest.library.dto.AuthResponseDTO;
import com.booknest.library.dto.LoginRequestDTO;
import com.booknest.library.dto.RegisterRequestDTO;
import com.booknest.library.dto.UserResponseDTO;
import com.booknest.library.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
//@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserService userService;

    // ============ REGISTER ============
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDTO dto) {
        try {
            UserResponseDTO newUser = userService.registerUser(dto);
            return ResponseEntity.ok(newUser); // 200 + {id, name, email, role}
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // ============ LOGIN - DABA KAYRJ3 TOKEN ============
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO dto) {
        try {
            // Daba kayrj3 AuthResponseDTO = token + user
            AuthResponseDTO authResponse = userService.loginUser(dto.getEmail(), dto.getPassword());

            // Response:
            // {
            //   "token": "eyJhbGciOiJIUzI1NiJ9...",
            //   "user": {"id":1,"name":"Admin","email":"admin@...","role":"USER"}
            // }
            return ResponseEntity.ok(authResponse);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}