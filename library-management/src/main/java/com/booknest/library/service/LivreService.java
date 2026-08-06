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

    public Livre convertFromDTO(LivreDTO dto) {
        Livre livre = new Livre();
        livre.setTitre(dto.getTitre());
        livre.setAuteur(dto.getAuteur());
        livre.setIsbn(dto.getIsbn());
        livre.setGenre(dto.getGenre());
        livre.setNombreExemplaires(dto.getNombreExemplaires());
        livre.setDisponible(dto.getNombreExemplaires() > 0);
        return livre;
    }

    public Livre addLivre(LivreDTO dto) {
        if (dto.getNombreExemplaires() <= 0) {
            throw new RuntimeException("Number of copies must be greater than 0");
        }
        if (dto.getIsbn() != null && !dto.getIsbn().isEmpty() && livreRepository.existsByIsbn(dto.getIsbn())) {
            throw new RuntimeException("ISBN already exists: " + dto.getIsbn());
        }
        return livreRepository.save(convertFromDTO(dto));
    }

    public Livre updateLivre(Long id, LivreDTO dto) {
        Livre existing = livreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        existing.setTitre(dto.getTitre());
        existing.setAuteur(dto.getAuteur());
        existing.setIsbn(dto.getIsbn());
        existing.setGenre(dto.getGenre());
        existing.setNombreExemplaires(dto.getNombreExemplaires());
        existing.setDisponible(dto.getNombreExemplaires() > 0);
        return livreRepository.save(existing);
    }

    public List<Livre> getAllLivres() {
        return livreRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    public Page<Livre> getAllLivresPaginated(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        if (search != null && !search.trim().isEmpty()) {
            return livreRepository.findByTitreContainingIgnoreCaseOrAuteurContainingIgnoreCase(search, search, pageable);
        }
        return livreRepository.findAll(pageable);
    }

    public List<Livre> getLivresDisponibles() {
        return livreRepository.findByDisponibleTrue();
    }

    public Optional<Livre> getLivreById(Long id) {
        return livreRepository.findById(id);
    }

    public List<Livre> searchByTitre(String titre) {
        return livreRepository.findByTitreContainingIgnoreCase(titre);
    }

    public List<Livre> searchByAuteur(String auteur) {
        return livreRepository.findByAuteurContainingIgnoreCase(auteur);
    }

    public void decrementStock(Long livreId) {
        Livre livre = livreRepository.findById(livreId).orElseThrow(() -> new RuntimeException("Book not found"));
        if (livre.getNombreExemplaires() <= 0) throw new RuntimeException("Out of stock");
        livre.setNombreExemplaires(livre.getNombreExemplaires() - 1);
        if (livre.getNombreExemplaires() == 0) livre.setDisponible(false);
        livreRepository.save(livre);
    }

    public void incrementStock(Long livreId) {
        Livre livre = livreRepository.findById(livreId).orElseThrow(() -> new RuntimeException("Book not found"));
        livre.setNombreExemplaires(livre.getNombreExemplaires() + 1);
        livre.setDisponible(true);
        livreRepository.save(livre);
    }

    public void deleteLivre(Long id) {
        if (!livreRepository.existsById(id)) throw new RuntimeException("Book not found");
        livreRepository.deleteById(id);
    }
}