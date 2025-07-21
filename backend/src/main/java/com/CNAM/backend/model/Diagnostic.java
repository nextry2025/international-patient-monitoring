package com.CNAM.backend.model;

import jakarta.persistence.*;

@Entity
public class Diagnostic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(targetEntity = Patient.class, cascade = CascadeType.ALL)
    @JoinColumn(name = "id_patient", referencedColumnName = "id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "id_pathologie", referencedColumnName = "id")
    private Pathologie pathologie;

    // Constructors, getters, and setters

    public Diagnostic() {
    }

    public Diagnostic(Patient patient, Pathologie pathologie) {
        this.patient = patient;
        this.pathologie = pathologie;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Pathologie getPathologie() {
        return pathologie;
    }

    public void setPathologie(Pathologie pathologie) {
        this.pathologie = pathologie;
    }
}
