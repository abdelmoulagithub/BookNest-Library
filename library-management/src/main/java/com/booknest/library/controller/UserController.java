package com.booknest.library.controller;

import com.booknest.library.dto.UserResponseDTO;
import com.booknest.library.model.User;
import com.booknest.library.repository.UserRepository;
import com.booknest.library.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map; // <-- ZID HADI BACH Y7AL ERROR MAP
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserResponseDTO> dtos = users.stream()
                .map(user -> {
                    UserResponseDTO dto = new UserResponseDTO();
                    dto.setId(user.getId());
                    dto.setName(user.getName());
                    dto.setEmail(user.getEmail());
                    dto.setRole(user.getRole());
                    return dto;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User ma kaynch"));
        UserResponseDTO dto = userService.convertToResponseDTO(user);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.status(404).body("User ma kaynch");
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok("User tms7 a sata");
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countUsers() {
        long count = userRepository.count();
        return ResponseEntity.ok(count);
    }

    // === JDID - BACH T9DER TBDL ROLE BLA MA TZID COLUMN ===
    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User ma kaynch"));
        String newRole = body.get("role");
        user.setRole(newRole);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Role tbdel l " + newRole));
    }
}