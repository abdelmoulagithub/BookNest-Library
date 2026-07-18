package com.booknest.library.repository;

import com.booknest.library.model.Emprunt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface EmpruntRepository extends JpaRepository<Emprunt, Long> {
    List<Emprunt> findByUserId(Long userId);
    List<Emprunt> findByUserIdAndRetourneFalse(Long userId);
    List<Emprunt> findByRetourneFalse();
    List<Emprunt> findByDateRetourPrevueBeforeAndRetourneFalse(LocalDate date);
    boolean existsByUserIdAndLivreIdAndRetourneFalse(Long userId, Long livreId);
    long countByUserId(Long userId);
    long countByUserIdAndRetourneFalse(Long userId);
}