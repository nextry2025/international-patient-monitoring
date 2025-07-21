package com.CNAM.backend.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Prestation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String libelle;
    private Long userId;

    @OneToMany(targetEntity = Rapport.class, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "id_prestation",referencedColumnName = "id")
    private List<Rapport> rapports;

    @OneToMany(mappedBy = "prestation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Recevoir> recevoirs;

    public Prestation() {
    }

    public Prestation(String libelle) {
        this.libelle = libelle;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLibelle() {
        return libelle;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public List<Rapport> getRapports() {
        return rapports;
    }

    public void setRapports(List<Rapport> rapports) {
        this.rapports = rapports;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
