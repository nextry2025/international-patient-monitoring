package com.CNAM.backend.controller;

import com.CNAM.backend.model.ActesDemande;
import com.CNAM.backend.repo.ActesDemandesRepo;
import com.CNAM.backend.repo.ActesRepo;
import com.CNAM.backend.repo.DemandeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/actes_demandes")
public class ActesDemandesController {

    @Autowired
    private ActesDemandesRepo actesDemandesRepo;

    @Autowired
    private DemandeRepo demandeRepo;

    @Autowired
    private ActesRepo actesRepo;

    @PostMapping
    public ResponseEntity<?> createActesDemandes(@RequestBody List<ActesDemande> actesDemandes) {
        try {
            List<ActesDemande> savedActesDemandes = new ArrayList<>();

            for (ActesDemande actesDemande : actesDemandes) {
                if (actesDemande.getDemande() != null) {
                    demandeRepo.findById(actesDemande.getDemande().getId())
                            .ifPresent(actesDemande::setDemande);
                }
                if (actesDemande.getActes() != null) {
                    actesRepo.findById(actesDemande.getActes().getId())
                            .ifPresent(actesDemande::setActes);
                }
                ActesDemande savedActesDemande = actesDemandesRepo.save(actesDemande);
                savedActesDemandes.add(savedActesDemande);
            }

            return ResponseEntity.ok(savedActesDemandes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }



    @GetMapping("/demande/{demandeId}/actes")
    public ResponseEntity<List<ActesDemande>> getActesByDemande(@PathVariable Long demandeId) {
        List<ActesDemande> actesDemandes = actesDemandesRepo.findByDemandeId(demandeId);
        return ResponseEntity.ok(actesDemandes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ActesDemande> getActesDemandeById(@PathVariable Long id) {
        return actesDemandesRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<ActesDemande> getAllActesDemandes() {
        return actesDemandesRepo.findAll();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ActesDemande> updateActesDemande(@PathVariable Long id, @RequestBody ActesDemande actesDemandeDetails) {
        return actesDemandesRepo.findById(id)
                .map(actesDemande -> {
                    actesDemande.setDemande(actesDemandeDetails.getDemande());
                    actesDemande.setActes(actesDemandeDetails.getActes());
                    ActesDemande updatedActesDemande = actesDemandesRepo.save(actesDemande);
                    return ResponseEntity.ok(updatedActesDemande);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/demande/{demandeId}")
    public ResponseEntity<Void> deleteActesByDemandeId(@PathVariable Long demandeId) {
        try {
            // Trouver tous les actes associés à la demande
            List<ActesDemande> actesDemandes = actesDemandesRepo.findByDemandeId(demandeId);

            // Supprimer chaque acte
            for (ActesDemande actesDemande : actesDemandes) {
                actesDemandesRepo.deleteById(actesDemande.getId());
            }

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActeDemande(@PathVariable Long id) {
        try {
            actesDemandesRepo.deleteById(id);
            return ResponseEntity.<Void>ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
