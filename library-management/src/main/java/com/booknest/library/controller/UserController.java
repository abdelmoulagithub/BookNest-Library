package com.booknest.library.controller;

import com.booknest.library.dto.UserResponseDTO;
import com.booknest.library.model.User;
import com.booknest.library.repository.UserRepository;
import com.booknest.library.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users") // /api/users/...
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    // GET /api/users → Jib ga3 users - Ghi ADMIN mn b3d
    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<User> users = userRepository.findAll();

        // N7awlo List<User> → List<UserResponseDTO> bla password
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

    // GET /api/users/5 → Jib user wa7d
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User ma kaynch"));

        UserResponseDTO dto = userService.convertToResponseDTO(user);
        return ResponseEntity.ok(dto);
    }

    // DELETE /api/users/5 → Msa7 user - Ghi ADMIN
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.status(404).body("User ma kaynch");
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok("User tms7 a sata");
    }

    // GET /api/users/count → Ch7al mn user kayn
    @GetMapping("/count")
    public ResponseEntity<Long> countUsers() {
        long count = userRepository.count();
        return ResponseEntity.ok(count);
    }
}