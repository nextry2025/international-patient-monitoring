package com.CNAM.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class ResultatOrdonnance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String fichier;


    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "id_fichier_ordonnance")
    private FichierOrdonnance fichierOrdonnance;

    public ResultatOrdonnance() {
    }

    public ResultatOrdonnance(String fichier) {
        this.fichier = fichier;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }



    public String getFichier() {
        return fichier;
    }

    public void setFichier(String fichier) {
        this.fichier = fichier;
    }

    public FichierOrdonnance getFichierOrdonnance() {
        return fichierOrdonnance;
    }

    public void setFichierOrdonnance(FichierOrdonnance fichierOrdonnance) {
        this.fichierOrdonnance = fichierOrdonnance;
    }
}
