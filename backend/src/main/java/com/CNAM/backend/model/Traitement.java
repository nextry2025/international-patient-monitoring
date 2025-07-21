package com.CNAM.backend.model;

import jakarta.persistence.*;

@Entity
public class Traitement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_clinique", referencedColumnName = "id")
    private Clinique clinique;

    @ManyToOne
    @JoinColumn(name = "id_pathologie", referencedColumnName = "id")
    private Pathologie pathologie;

    // Constructors, getters, and setters

    public Traitement() {
    }

    public Traitement(Clinique clinique, Pathologie pathologie) {
        this.clinique = clinique;
        this.pathologie = pathologie;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Clinique getClinique() {
        return clinique;
    }

    public void setClinique(Clinique clinique) {
        this.clinique = clinique;
    }

    public Pathologie getPathologie() {
        return pathologie;
    }

    public void setPathologie(Pathologie pathologie) {
        this.pathologie = pathologie;
    }
}
