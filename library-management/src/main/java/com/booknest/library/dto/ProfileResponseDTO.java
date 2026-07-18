package com.booknest.library.dto;

public class ProfileResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String role;
    private long totalEmprunts;
    private long enCours;
    private long retards;

    public ProfileResponseDTO() {}

    public ProfileResponseDTO(Long id, String name, String email, String role, long totalEmprunts, long enCours, long retards) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.totalEmprunts = totalEmprunts;
        this.enCours = enCours;
        this.retards = retards;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public long getTotalEmprunts() { return totalEmprunts; }
    public void setTotalEmprunts(long totalEmprunts) { this.totalEmprunts = totalEmprunts; }
    public long getEnCours() { return enCours; }
    public void setEnCours(long enCours) { this.enCours = enCours; }
    public long getRetards() { return retards; }
    public void setRetards(long retards) { this.retards = retards; }
}