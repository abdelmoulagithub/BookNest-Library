package com.booknest.library.service;

import com.booknest.library.dto.LivreDTO;
import com.booknest.library.model.Livre;
import com.booknest.library.repository.LivreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class LivreService {

    @Autowired
    private LivreRepository livreRepository;

    // ============ CONVERSION DTO → ENTITY ============
    public Livre convertFromDTO(LivreDTO dto) {
        Livre livre = new Livre();
        livre.setTitre(dto.getTitre());
        livre.setAuteur(dto.getAuteur());
        livre.setIsbn(dto.getIsbn());
        livre.setNombreExemplaires(dto.getNombreExemplaires());
        livre.setGenre(dto.getGenre());
        livre.setDisponible(dto.getNombreExemplaires() > 0);
        return livre;
    }

    // ============ AJOUTER LIVRE ============
    public Livre addLivre(LivreDTO dto) {
        if (dto.getNombreExemplaires() <= 0) {
            throw new RuntimeException("Number of copies must be greater than 0");
        }

        if (dto.getIsbn() != null && !dto.getIsbn().isEmpty()) {
            List<Livre> all = livreRepository.findAll();
            boolean exists = all.stream()
                    .anyMatch(l -> dto.getIsbn().equals(l.getIsbn()));
            if (exists) {
                throw new RuntimeException("ISBN already exists: " + dto.getIsbn());
            }
        }

        Livre livre = convertFromDTO(dto);
        return livreRepository.save(livre);
    }

    // ============ GET ALL PAGINATED + SEARCH - PRO 20/20 ============
    public Page<Livre> getAllLivresPaginated(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        if (search != null && !search.trim().isEmpty()) {
            return livreRepository.findByTitreContainingIgnoreCaseOrAuteurContainingIgnoreCase(
                    search, search, pageable);
        } else {
            return livreRepository.findAll(pageable);
        }
    }

    // ============ GET ALL SIMPLE ============
    public List<Livre> getAllLivres() {
        return livreRepository.findAll();
    }

    // ============ GET DISPONIBLES ============
    public List<Livre> getLivresDisponibles() {
        return livreRepository.findByDisponibleTrue();
    }

    // ============ GET BY ID ============
    public Optional<Livre> getLivreById(Long id) {
        return livreRepository.findById(id);
    }

    // ============ SEARCH BY TITRE ============
    public List<Livre> searchByTitre(String titre) {
        if (titre == null || titre.trim().isEmpty()) {
            throw new RuntimeException("Search query is required");
        }
        return livreRepository.findByTitreContainingIgnoreCase(titre);
    }

    // ============ SEARCH BY AUTEUR ============
    public List<Livre> searchByAuteur(String auteur) {
        if (auteur == null || auteur.trim().isEmpty()) {
            throw new RuntimeException("Search query is required");
        }
        return livreRepository.findByAuteurContainingIgnoreCase(auteur);
    }

    // ============ DECREMENT STOCK ============
    public void decrementStock(Long livreId) {
        Livre livre = livreRepository.findById(livreId)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + livreId));

        if (livre.getNombreExemplaires() <= 0) {
            throw new RuntimeException("Out of stock, cannot borrow this book");
        }

        livre.setNombreExemplaires(livre.getNombreExemplaires() - 1);
        if (livre.getNombreExemplaires() == 0) {
            livre.setDisponible(false);
        }
        livreRepository.save(livre);
    }

    // ============ INCREMENT STOCK ============
    public void incrementStock(Long livreId) {
        Livre livre = livreRepository.findById(livreId)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + livreId));

        livre.setNombreExemplaires(livre.getNombreExemplaires() + 1);
        livre.setDisponible(true);
        livreRepository.save(livre);
    }

    // ============ DELETE ============
    public void deleteLivre(Long id) {
        if (!livreRepository.existsById(id)) {
            throw new RuntimeException("Book not found with id: " + id);
        }
        livreRepository.deleteById(id);
    }
}