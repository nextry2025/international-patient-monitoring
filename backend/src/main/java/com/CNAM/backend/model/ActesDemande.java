package com.CNAM.backend.model;

import jakarta.persistence.*;

@Entity
public class ActesDemande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "demande_id", referencedColumnName = "id")
    private Demande demande;

    @ManyToOne
    @JoinColumn(name = "acte_id", referencedColumnName = "id")
    private Actes actes;

    private String statut;

    public ActesDemande() {
    }

    public ActesDemande(Long id, Demande demande, Actes actes,String statut) {
        this.id = id;
        this.demande = demande;
        this.actes = actes;
        this.statut=statut;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Demande getDemande() {
        return demande;
    }

    public void setDemande(Demande demande) {
        this.demande = demande;
    }

    public Actes getActes() {
        return actes;
    }

    public void setActes(Actes actes) {
        this.actes = actes;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }
}
