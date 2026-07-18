package com.booknest.library.dto;

public class EmpruntRequestDTO {
    private Long userId;
    private Long livreId;
    // Getter + Setter dyal bjoj
    public Long getUserId(){return userId;} public void setUserId(Long u){this.userId=u;}
    public Long getLivreId(){return livreId;} public void setLivreId(Long l){this.livreId=l;}
}