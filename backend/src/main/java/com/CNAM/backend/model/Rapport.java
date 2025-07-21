package com.CNAM.backend.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Rapport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;

    @OneToMany(targetEntity = FichierOrdonnance.class, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "id_rapport",referencedColumnName = "id")
    private List<FichierOrdonnance> fichiersOrdonnance;


    public Rapport() {
    }

    public Rapport( String description, List<FichierOrdonnance> fichiersOrdonnance) {
        this.description = description;
        this.fichiersOrdonnance = fichiersOrdonnance;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<FichierOrdonnance> getFichiersOrdonnance() {
        return fichiersOrdonnance;
    }

    public void setFichiersOrdonnance(List<FichierOrdonnance> fichiersOrdonnance) {
        this.fichiersOrdonnance = fichiersOrdonnance;
    }
}
