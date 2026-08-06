package com.booknest.library.repository;

import com.booknest.library.model.Livre;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LivreRepository extends JpaRepository<Livre, Long> {
    boolean existsByIsbn(String isbn);
    List<Livre> findByDisponibleTrue();
    List<Livre> findByTitreContainingIgnoreCase(String titre);
    List<Livre> findByAuteurContainingIgnoreCase(String auteur);
    Page<Livre> findByTitreContainingIgnoreCaseOrAuteurContainingIgnoreCase(String titre, String auteur, Pageable pageable);
}