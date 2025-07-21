package com.CNAM.backend.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "expediteur_id", nullable = false)
    private Utilisateur expediteur;

    @ManyToOne
    @JoinColumn(name = "destinataire_id", nullable = false)
    private Utilisateur destinataire;

    @Column(nullable = false)
    private String contenu;

    @Column(nullable = false)
    private LocalDateTime horodatage;

    @ManyToOne
    @JoinColumn(name = "demande_id", nullable = true)
    private Demande demande;

    @ManyToOne
    @JoinColumn(name = "demande_admission_id", nullable = true)
    private Demandes_Admission demandesAdmission;
    private boolean lu = false;

    public Message() {
    }


    public Message(Long id, Utilisateur expediteur, Utilisateur destinataire, String contenu, LocalDateTime horodatage, Demande demande, Demandes_Admission demandesAdmission, boolean lu) {
        this.id = id;
        this.expediteur = expediteur;
        this.destinataire = destinataire;
        this.contenu = contenu;
        this.horodatage = horodatage;
        this.demande = demande;
        this.demandesAdmission = demandesAdmission;
        this.lu = lu;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Utilisateur getExpediteur() {
        return expediteur;
    }

    public void setExpediteur(Utilisateur expediteur) {
        this.expediteur = expediteur;
    }

    public Utilisateur getDestinataire() {
        return destinataire;
    }

    public void setDestinataire(Utilisateur destinataire) {
        this.destinataire = destinataire;
    }

    public String getContenu() {
        return contenu;
    }

    public void setContenu(String contenu) {
        this.contenu = contenu;
    }

    public LocalDateTime getHorodatage() {
        return horodatage;
    }

    public void setHorodatage(LocalDateTime horodatage) {
        this.horodatage = horodatage;
    }

    public Demande getDemande() {
        return demande;
    }

    public void setDemande(Demande demande) {
        this.demande = demande;
    }

    public Demandes_Admission getDemandesAdmission() {
        return demandesAdmission;
    }

    public void setDemandesAdmission(Demandes_Admission demandesAdmission) {
        this.demandesAdmission = demandesAdmission;
    }

    public boolean isLu() {
        return lu;
    }

    public void setLu(boolean lu) {
        this.lu = lu;
    }
}
