package com.booknest.library.controller;

import com.booknest.library.dto.LivreDTO;
import com.booknest.library.model.Livre;
import com.booknest.library.service.LivreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/livres")
public class LivreController {

    @Autowired
    private LivreService livreService;

    @GetMapping
    public ResponseEntity<List<Livre>> getAllLivres() {
        return ResponseEntity.ok(livreService.getAllLivres());
    }

    @GetMapping("/paginated")
    public ResponseEntity<org.springframework.data.domain.Page<Livre>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(livreService.getAllLivresPaginated(page, size, search));
    }

    @GetMapping("/disponibles")
    public ResponseEntity<List<Livre>> getDisponibles() {
        return ResponseEntity.ok(livreService.getLivresDisponibles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Livre> getLivreById(@PathVariable Long id) {
        return livreService.getLivreById(id)
                .map(livre -> ResponseEntity.ok(livre))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> addLivre(@RequestBody LivreDTO dto) {
        try {
            Livre saved = livreService.addLivre(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateLivre(@PathVariable Long id, @RequestBody LivreDTO dto) {
        try {
            return ResponseEntity.ok(livreService.updateLivre(id, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLivre(@PathVariable Long id) {
        livreService.deleteLivre(id);
        return ResponseEntity.ok(Map.of("message", "Supprimé"));
    }
}