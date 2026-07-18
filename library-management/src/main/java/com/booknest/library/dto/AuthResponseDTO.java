package com.booknest.library.dto;

public class AuthResponseDTO {

    private String token;
    private UserResponseDTO user;

    public AuthResponseDTO() {}

    // 👈 Hada constructor li kay9llb 3lih UserService - token + userDTO
    public AuthResponseDTO(String token, UserResponseDTO user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserResponseDTO getUser() {
        return user;
    }

    public void setUser(UserResponseDTO user) {
        this.user = user;
    }
}