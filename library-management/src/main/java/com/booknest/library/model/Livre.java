package com.booknest.library.model;

import jakarta.persistence.*;

@Entity
@Table(name = "livres")
public class Livre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;

    private String auteur;

    private String isbn;

    @Column(name = "nombre_exemplaires")
    private int nombreExemplaires;

    @Column
    private String genre;

    private boolean disponible = true;

    // Default Constructor
    public Livre() {
    }

    // Constructor
    public Livre(String titre, String auteur, String isbn, int nombreExemplaires,String genre) {
        this.titre = titre;
        this.auteur = auteur;
        this.isbn = isbn;
        this.nombreExemplaires = nombreExemplaires;
        this.genre=genre;
        this.disponible = nombreExemplaires > 0;

    }

    // Getters and Setters - Dir Alt+Insert → Getter and Setter → Select All
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }

    public String getAuteur() { return auteur; }
    public void setAuteur(String auteur) { this.auteur = auteur; }

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public int getNombreExemplaires() { return nombreExemplaires; }
    public void setNombreExemplaires(int nombreExemplaires) {
        this.nombreExemplaires = nombreExemplaires;
        this.disponible = nombreExemplaires > 0;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public boolean isDisponible() { return disponible; }
    public void setDisponible(boolean disponible) { this.disponible = disponible; }
}