package com.CNAM.backend.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
public class Soigne {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_clinique", referencedColumnName = "id")
    private Clinique clinique;

    @ManyToOne(targetEntity = Patient.class, cascade = CascadeType.ALL)
    @JoinColumn(name = "id_patient", referencedColumnName = "id")
    private Patient patient;

    private Date dateDebut;
    private Date dateFin;
    private String priseEnCharge;




    // Constructors, getters, and setters

    public Soigne() {
    }

    public Soigne(Clinique clinique, Patient patient, Date dateDebut, Date dateFin, String priseEnCharge) {
        this.clinique = clinique;
        this.patient = patient;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.priseEnCharge = priseEnCharge;
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

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Date getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(Date dateDebut) {
        this.dateDebut = dateDebut;
    }

    public Date getDateFin() {
        return dateFin;
    }

    public void setDateFin(Date dateFin) {
        this.dateFin = dateFin;
    }

    public String getPriseEnCharge() {
        return priseEnCharge;
    }

    public void setPriseEnCharge(String priseEnCharge) {
        this.priseEnCharge = priseEnCharge;
    }
}
