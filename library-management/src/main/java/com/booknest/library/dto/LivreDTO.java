package com.booknest.library.dto;

public class LivreDTO {
    private String titre;
    private String auteur;
    private String isbn;
    private int nombreExemplaires;
    private String genre; // Simple String machi table

    public LivreDTO() {}

    // Getters
    public String getTitre() { return titre; }
    public String getAuteur() { return auteur; }
    public String getIsbn() { return isbn; }
    public int getNombreExemplaires() { return nombreExemplaires; }
    public String getGenre() { return genre; }

    // Setters
    public void setTitre(String titre) { this.titre = titre; }
    public void setAuteur(String auteur) { this.auteur = auteur; }
    public void setIsbn(String isbn) { this.isbn = isbn; }
    public void setNombreExemplaires(int nombreExemplaires) { this.nombreExemplaires = nombreExemplaires; }
    public void setGenre(String genre) { this.genre = genre; }
}