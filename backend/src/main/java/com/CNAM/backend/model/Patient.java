package com.CNAM.backend.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int NNI;
    private String nom;
    private String prenom;
    private int tel; // Changed from "Tel" to follow Java naming conventions
    private String cni;
    private String passport;
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    private List<Soigne> soignes;

    @Enumerated(EnumType.STRING)
    private Statut statut;

    // Constructors, getters, and setters

    public Patient() {
    }

    public Patient(int NNI, String nom, String prenom, int tel, String cni, String passport,Statut statut) {
        this.NNI = NNI;
        this.nom = nom;
        this.prenom = prenom;
        this.tel = tel;
        this.cni = cni;
        this.passport = passport;
        this.statut=statut;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getNNI() {
        return NNI;
    }

    public void setNNI(int NNI) {
        this.NNI = NNI;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public int getTel() {
        return tel;
    }

    public void setTel(int tel) {
        this.tel = tel;
    }

    public String getCni() {
        return cni;
    }

    public void setCni(String cni) {
        this.cni = cni;
    }

    public String getPassport() {
        return passport;
    }

    public void setPassport(String passport) {
        this.passport = passport;
    }

    public Statut getStatut() {
        return statut;
    }

    public void setStatut(Statut statut) {
        this.statut = statut;
    }
}
