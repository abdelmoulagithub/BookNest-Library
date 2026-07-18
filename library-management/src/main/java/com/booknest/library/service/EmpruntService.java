package com.booknest.library.service;

import com.booknest.library.model.Emprunt;
import com.booknest.library.model.Livre;
import com.booknest.library.model.User;
import com.booknest.library.repository.EmpruntRepository;
import com.booknest.library.repository.LivreRepository;
import com.booknest.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class EmpruntService {

    @Autowired
    private EmpruntRepository empruntRepository;
    @Autowired
    private LivreRepository livreRepository;
    @Autowired
    private UserRepository userRepository;

    public Emprunt emprunterLivre(Long userId, Long livreId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User non trouvé"));
        Livre livre = livreRepository.findById(livreId)
                .orElseThrow(() -> new RuntimeException("Livre non trouvé"));

        if (livre.getNombreExemplaires() <= 0) {
            throw new RuntimeException("Stock épuisé");
        }

        Emprunt emprunt = new Emprunt();
        emprunt.setUser(user);
        emprunt.setLivre(livre);
        emprunt.setDateEmprunt(LocalDate.now());
        emprunt.setDateRetourPrevue(LocalDate.now().plusDays(14));
        emprunt.setRetourne(false);
        emprunt.setStatut("EN_COURS");
        emprunt.setPenalite(0.0);
        emprunt.setJoursRetard(0L);

        livre.setNombreExemplaires(livre.getNombreExemplaires() - 1);
        livreRepository.save(livre);

        return empruntRepository.save(emprunt);
    }

    public Emprunt retournerLivre(Long id) {
        Emprunt emprunt = empruntRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Emprunt non trouvé"));

        if (emprunt.isRetourne()) {
            throw new RuntimeException("Déjà retourné");
        }

        LocalDate now = LocalDate.now();
        emprunt.setRetourne(true);
        emprunt.setDateRetourReelle(now);
        emprunt.setDateRetourEffective(now);

        if (now.isAfter(emprunt.getDateRetourPrevue())) {
            long retard = ChronoUnit.DAYS.between(emprunt.getDateRetourPrevue(), now);
            emprunt.setJoursRetard(retard);
            emprunt.setPenalite(retard * 10.0);
            emprunt.setStatut("RETOURNE_EN_RETARD");
        } else {
            emprunt.setJoursRetard(0L);
            emprunt.setPenalite(0.0);
            emprunt.setStatut("RETOURNE");
        }

        Livre livre = emprunt.getLivre();
        livre.setNombreExemplaires(livre.getNombreExemplaires() + 1);
        livreRepository.save(livre);

        return empruntRepository.save(emprunt);
    }

    public List<Emprunt> getAllEmprunts() {
        return empruntRepository.findAll();
    }

    public List<Emprunt> getEmpruntsByUser(Long userId) {
        return empruntRepository.findByUserId(userId);
    }

    public List<Emprunt> getAllRetards() {
        LocalDate now = LocalDate.now();
        return empruntRepository.findAll().stream()
                .filter(e -> !e.isRetourne() && e.getDateRetourPrevue().isBefore(now))
                .peek(e -> {
                    long retard = ChronoUnit.DAYS.between(e.getDateRetourPrevue(), now);
                    e.setJoursRetard(retard);
                    e.setStatut("EN_RETARD");
                })
                .toList();
    }
}