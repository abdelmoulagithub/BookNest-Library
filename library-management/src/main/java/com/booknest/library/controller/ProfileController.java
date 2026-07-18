package com.booknest.library.controller;

import com.booknest.library.dto.ProfileResponseDTO;
import com.booknest.library.model.User;
import com.booknest.library.repository.EmpruntRepository;
import com.booknest.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    @Autowired private UserRepository userRepository;
    @Autowired private EmpruntRepository empruntRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @GetMapping("/me")
    public ResponseEntity<ProfileResponseDTO> getMe() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User non trouvé"));
        long total = empruntRepository.countByUserId(user.getId());
        long enCours = empruntRepository.countByUserIdAndRetourneFalse(user.getId());
        ProfileResponseDTO dto = new ProfileResponseDTO(user.getId(), user.getName(), user.getEmail(), user.getRole(), total, enCours, 0);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String,String> body) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();
        user.setName(body.get("name"));
        userRepository.save(user);
        return ResponseEntity.ok("Profile mis à jour");
    }

    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String,String> body) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();
        if (!passwordEncoder.matches(body.get("oldPassword"), user.getPassword())) {
            return ResponseEntity.badRequest().body("Ancien mot de passe incorrect");
        }
        user.setPassword(passwordEncoder.encode(body.get("newPassword")));
        userRepository.save(user);
        return ResponseEntity.ok("Mot de passe changé");
    }
}