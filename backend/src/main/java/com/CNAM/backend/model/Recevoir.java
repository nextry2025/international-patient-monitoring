package com.CNAM.backend.model;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class Recevoir {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(targetEntity = Patient.class, cascade = CascadeType.ALL)
    @JoinColumn(name = "id_patient", referencedColumnName = "id")
    private Patient patient;

    @ManyToOne(targetEntity = Prestation.class, cascade = CascadeType.ALL)
    @JoinColumn(name = "id_prestation", referencedColumnName = "id")
    private Prestation prestation;

    private Date date;

    private Long fkUserId;

    // Constructors, getters, and setters

    public Recevoir() {
    }

    public Recevoir(Patient patient, Prestation prestation, Date date, Long fkUserId) {
        this.patient = patient;
        this.prestation = prestation;
        this.date = date;
        this.fkUserId = fkUserId;
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

    public Prestation getPrestation() {
        return prestation;
    }

    public void setPrestation(Prestation prestation) {
        this.prestation = prestation;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Long getFkUserId() {
        return fkUserId;
    }

    public void setFkUserId(Long fkUserId) {
        this.fkUserId = fkUserId;
    }
}
