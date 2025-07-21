package com.CNAM.backend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.List;

@Entity
public class FichierOrdonnance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fichier;

    @ManyToOne
    @JoinColumn(name = "id_rapport")
    private Rapport rapport;

    @OneToMany(targetEntity = ResultatOrdonnance.class, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @JoinColumn(name = "id_fichier_ordonnance",referencedColumnName = "id")
    private List<ResultatOrdonnance> resultatsOrdonnance;


    public FichierOrdonnance() {
    }

    public FichierOrdonnance(String fichier) {
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

    public List<ResultatOrdonnance> getResultatsOrdonnance() {
        return resultatsOrdonnance;
    }

    public void setResultatsOrdonnance(List<ResultatOrdonnance> resultatsOrdonnance) {
        this.resultatsOrdonnance = resultatsOrdonnance;
    }
}
