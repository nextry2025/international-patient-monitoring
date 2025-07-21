package com.CNAM.backend.dto;
public class LoginRequest {
    private String email;
    private String pwd;

    public LoginRequest() {
    }

    public LoginRequest(String email, String pwd) {
        this.email = email;
        this.pwd = pwd;
    }

    // Getters and setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPwd() {
        return pwd;
    }

    public void setPwd(String pwd) {
        this.pwd = pwd;
    }
}
