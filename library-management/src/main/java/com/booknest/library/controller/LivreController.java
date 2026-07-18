package com.booknest.library.controller;

import com.booknest.library.dto.LivreDTO;
import com.booknest.library.model.Livre;
import com.booknest.library.service.LivreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/livres")
// 7AYAD @CrossOrigin men hna - rah SecurityConfig ghadi ydirha
public class LivreController {

    @Autowired
    private LivreService livreService;

    // FIX: Had endpoint khassou yb9a simple List bach maydirch WARN o Network Error
    @GetMapping
    public ResponseEntity<List<Livre>> getAllLivres() {
        List<Livre> livres = livreService.getAllLivres();
        return ResponseEntity.ok(livres);
    }

    // Pagination ila bghitiha f Admin
    @GetMapping("/paginated")
    public ResponseEntity<?> getAllPaginated(
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
    public ResponseEntity<?> getLivreById(@PathVariable Long id) {
        return livreService.getLivreById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> addLivre(@RequestBody LivreDTO dto) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(livreService.addLivre(dto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLivre(@PathVariable Long id) {
        livreService.deleteLivre(id);
        return ResponseEntity.ok("Supprimé");
    }
}