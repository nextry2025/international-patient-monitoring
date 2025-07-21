package com.CNAM.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Demande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;
    private String NomPrenom;
    private Integer INAM;
    private String resume;

    private Integer Tel;
    private List<String> PiecesJointes;
    private boolean valideCliniqueNational;
    private boolean valideAdmin;
    private boolean Demande_accomplement;
    private String commentaire;



    @OneToMany(mappedBy = "demande", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Message> messages;

    public Demande() {
    }

    public Demande(Long id, String nomPrenom, Integer INAM, String resume, Integer tel, List<String> piecesJointes, boolean valideCliniqueNational, boolean valideAdmin, boolean Demande_accomplement,String commentaire) {
        Id = id;
        NomPrenom = nomPrenom;
        this.INAM = INAM;
        this.resume = resume;
        Tel = tel;
        PiecesJointes = piecesJointes;
        this.valideCliniqueNational = valideCliniqueNational;
        this.valideAdmin = valideAdmin;
        this.Demande_accomplement = Demande_accomplement;
        this.commentaire=commentaire;
    }

    public Long getId() {
        return Id;
    }

    public void setId(Long id) {
        Id = id;
    }

    public String getNomPrenom() {
        return NomPrenom;
    }

    public void setNomPrenom(String nomPrenom) {
        NomPrenom = nomPrenom;
    }

    public Integer getINAM() {
        return INAM;
    }

    public void setINAM(Integer INAM) {
        this.INAM = INAM;
    }

    public String getResume() {
        return resume;
    }

    public void setResume(String resume) {
        this.resume = resume;
    }



    public Integer getTel() {
        return Tel;
    }

    public void setTel(Integer tel) {
        Tel = tel;
    }

    public List<String> getPiecesJointes() {
        return PiecesJointes;
    }

    public void setPiecesJointes(List<String> piecesJointes) {
        PiecesJointes = piecesJointes;
    }

    public boolean isValideCliniqueNational() {
        return valideCliniqueNational;
    }

    public void setValideCliniqueNational(boolean valideCliniqueNational) {
        this.valideCliniqueNational = valideCliniqueNational;
    }

    public boolean isValideAdmin() {
        return valideAdmin;
    }

    public void setValideAdmin(boolean valideAdmin) {
        this.valideAdmin = valideAdmin;
    }

    public boolean isDemande_accomplement() {
        return Demande_accomplement;
    }

    public void setDemande_accomplement(boolean Demande_accomplement) {
        this.Demande_accomplement = Demande_accomplement;
    }

    public String getCommentaire() {
        return commentaire;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }

    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }
}
