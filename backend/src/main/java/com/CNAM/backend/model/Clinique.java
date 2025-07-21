package com.CNAM.backend.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Clinique {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String email;
    private String pays;

    private String type;




    @OneToMany(targetEntity = Demande.class,  cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "id_clinique",referencedColumnName = "id")
    private List<Demande> demandes;



    public Clinique() {
    }

    public Clinique(Long id, String nom, String email, String pays, String type, List<Demande> demandes) {
        this.id = id;
        this.nom = nom;
        this.email = email;
        this.pays = pays;
        this.type = type;
        this.demandes = demandes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPays() {
        return pays;
    }

    public void setPays(String pays) {
        this.pays = pays;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<Demande> getDemandes() {
        return demandes;
    }

    public void setDemandes(List<Demande> demandes) {
        this.demandes = demandes;
    }
}
