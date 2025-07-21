package com.CNAM.backend.model;

import jakarta.persistence.*;

import java.util.Date;
import java.util.List;

@Entity
public class Demandes_Admission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_patient", nullable = false)
    private Patient patient;
    @ManyToOne
    @JoinColumn(name = "id_clinique", nullable = false)
    private Clinique clinique;
    private String pathologie;
    private String rapportMedical;
    private String resumerConseils;

    private boolean valide = false;

    private Date dateDebut;
    private Date dateFin;

    public Demandes_Admission() {
    }

    public Demandes_Admission(Long id, Patient patient, Clinique clinique, String pathologie, String rapportMedical, String resumerConseils, boolean valide, Date dateDebut, Date dateFin) {
        this.id = id;
        this.patient = patient;
        this.clinique = clinique;
        this.pathologie = pathologie;
        this.rapportMedical = rapportMedical;
        this.resumerConseils = resumerConseils;
        this.valide = valide;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
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

    public Clinique getClinique() {
        return clinique;
    }

    public void setClinique(Clinique clinique) {
        this.clinique = clinique;
    }

    public String getPathologie() {
        return pathologie;
    }

    public void setPathologie(String pathologie) {
        this.pathologie = pathologie;
    }

    public String getRapportMedical() {
        return rapportMedical;
    }

    public void setRapportMedical(String rapportMedical) {
        this.rapportMedical = rapportMedical;
    }

    public String getResumerConseils() {
        return resumerConseils;
    }

    public void setResumerConseils(String resumerConseils) {
        this.resumerConseils = resumerConseils;
    }

    public boolean isValide() {
        return valide;
    }

    public void setValide(boolean valide) {
        this.valide = valide;
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
}
