package com.booknest.library.controller;

import com.booknest.library.dto.EmpruntRequestDTO;
import com.booknest.library.dto.EmpruntResponseDTO;
import com.booknest.library.model.Emprunt;
import com.booknest.library.service.EmpruntService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/emprunts")
public class EmpruntController {

    @Autowired
    private EmpruntService empruntService;

    @PostMapping
    public ResponseEntity<?> emprunter(@RequestBody EmpruntRequestDTO dto) {
        try {
            Emprunt emprunt = empruntService.emprunterLivre(dto.getUserId(), dto.getLivreId());
            return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(emprunt));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/retards")
    public ResponseEntity<List<Emprunt>> getRetards() {
        return ResponseEntity.ok(empruntService.getAllRetards());
    }

    @PutMapping("/{id}/retour")
    public ResponseEntity<?> retourner(@PathVariable Long id) {
        try {
            Emprunt emprunt = empruntService.retournerLivre(id);
            return ResponseEntity.ok(toDTO(emprunt));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Emprunt>> getMesEmprunts(@PathVariable Long userId) {
        return ResponseEntity.ok(empruntService.getEmpruntsByUser(userId));
    }

    @GetMapping
    public ResponseEntity<List<Emprunt>> getAllEmprunts() {
        return ResponseEntity.ok(empruntService.getAllEmprunts());
    }

    private EmpruntResponseDTO toDTO(Emprunt emp) {
        EmpruntResponseDTO dto = new EmpruntResponseDTO();
        dto.setId(emp.getId());
        dto.setUserName(emp.getUser().getName());
        dto.setLivreTitre(emp.getLivre().getTitre());
        dto.setDateEmprunt(emp.getDateEmprunt());
        dto.setDateRetourPrevue(emp.getDateRetourPrevue());
        dto.setRetourne(emp.isRetourne());
        dto.setDateRetourReelle(emp.getDateRetourReelle());
        return dto;
    }
}