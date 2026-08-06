package com.booknest.library.controller;

import com.booknest.library.dto.EmpruntResponseDTO;
import com.booknest.library.model.Emprunt;
import com.booknest.library.service.EmpruntService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/emprunts")
@CrossOrigin(origins = "http://localhost:3000")
public class EmpruntController {

    @Autowired
    private EmpruntService empruntService;

    @GetMapping
    public ResponseEntity<List<Emprunt>> getAllEmprunts() {
        return ResponseEntity.ok(empruntService.getAllEmprunts());
    }

    @PostMapping
    public ResponseEntity<?> emprunter(@RequestBody Map<String, Object> body) {
        try {
            Long livreId = null;
            Long userId = null;
            if(body.get("livre_id") != null) livreId = Long.valueOf(body.get("livre_id").toString());
            else if(body.get("livreId") != null) livreId = Long.valueOf(body.get("livreId").toString());

            if(body.get("user_id") != null) userId = Long.valueOf(body.get("user_id").toString());
            else if(body.get("userId") != null) userId = Long.valueOf(body.get("userId").toString());

            if(livreId == null || userId == null){
                return ResponseEntity.badRequest().body(Map.of("message", "livre_id et user_id obligatoires"));
            }

            Emprunt emprunt = empruntService.emprunterLivre(userId, livreId);
            return ResponseEntity.status(HttpStatus.CREATED).body(emprunt);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/retour")
    public ResponseEntity<?> retourner(@PathVariable Long id) {
        try {
            Emprunt emprunt = empruntService.retournerLivre(id);
            return ResponseEntity.ok(emprunt);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/retards")
    public ResponseEntity<List<Emprunt>> getRetards() {
        return ResponseEntity.ok(empruntService.getAllRetards());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Emprunt>> getMesEmprunts(@PathVariable Long userId) {
        return ResponseEntity.ok(empruntService.getEmpruntsByUser(userId));
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