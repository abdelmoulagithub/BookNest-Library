package com.booknest.library.dto;

public class RegisterRequestDTO {
    private String name;
    private String email;
    private String password;

    // Constructor vide bach Spring y9ra JSON
    public RegisterRequestDTO() {}


    public RegisterRequestDTO(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    // Getters - Bach nakhdo data li ja mn browser
    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    // Setters - Bach Spring y7t data f DTO
    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}