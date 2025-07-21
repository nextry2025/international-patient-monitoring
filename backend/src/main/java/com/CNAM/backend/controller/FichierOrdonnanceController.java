package com.CNAM.backend.controller;

import com.CNAM.backend.model.FichierOrdonnance;
import com.CNAM.backend.model.ResultatOrdonnance;
import com.CNAM.backend.repo.FichierOrdonnanceRepo;
import com.CNAM.backend.repo.ResultatOrdonnanceRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/fichiers-ordonnance")
public class FichierOrdonnanceController {

    @Autowired
    private FichierOrdonnanceRepo fichierOrdonnanceRepository;

    @Autowired
    private ResultatOrdonnanceRepo resultatOrdonnanceRepository;


    @GetMapping
    public List<FichierOrdonnance> getAllFichiersOrdonnance() {
        return fichierOrdonnanceRepository.findAll();
    }


    @GetMapping("/rapport/{rapportId}")
    public ResponseEntity<List<FichierOrdonnance>> getFichiersOrdonnanceByRapportId(@PathVariable Long rapportId) {
        List<FichierOrdonnance> fichiersOrdonnance = fichierOrdonnanceRepository.findByRapportId(rapportId);
        if (fichiersOrdonnance.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(fichiersOrdonnance);
    }



    @GetMapping("/{id}")
    public ResponseEntity<FichierOrdonnance> getFichierOrdonnanceById(@PathVariable Long id) {
        Optional<FichierOrdonnance> fichierOrdonnance = fichierOrdonnanceRepository.findById(id);
        return fichierOrdonnance.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<FichierOrdonnance> createFichierOrdonnance(@RequestBody FichierOrdonnance fichierOrdonnance) {
        FichierOrdonnance savedFichierOrdonnance = fichierOrdonnanceRepository.save(fichierOrdonnance);
        return ResponseEntity.ok(savedFichierOrdonnance);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FichierOrdonnance> updateFichierOrdonnance(@PathVariable Long id, @RequestBody FichierOrdonnance fichierOrdonnanceDetails) {
        Optional<FichierOrdonnance> fichierOrdonnance = fichierOrdonnanceRepository.findById(id);
        if (!fichierOrdonnance.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        FichierOrdonnance existingFichierOrdonnance = fichierOrdonnance.get();
        existingFichierOrdonnance.setFichier(fichierOrdonnanceDetails.getFichier());
        existingFichierOrdonnance.setResultatsOrdonnance(fichierOrdonnanceDetails.getResultatsOrdonnance());
        // update other fields if needed

        FichierOrdonnance updatedFichierOrdonnance = fichierOrdonnanceRepository.save(existingFichierOrdonnance);
        return ResponseEntity.ok(updatedFichierOrdonnance);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFichierOrdonnance(@PathVariable Long id) {
        Optional<FichierOrdonnance> fichierOrdonnance = fichierOrdonnanceRepository.findById(id);
        if (!fichierOrdonnance.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        fichierOrdonnanceRepository.delete(fichierOrdonnance.get());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{fichierOrdonnanceId}/resultat")
    public ResponseEntity<FichierOrdonnance> addResultatToFichierOrdonnance(
            @PathVariable Long fichierOrdonnanceId,
            @RequestBody ResultatOrdonnance resultatOrdonnance) {

        // Récupérer l'ordonnance par ID
        Optional<FichierOrdonnance> optionalFichierOrdonnance = fichierOrdonnanceRepository.findById(fichierOrdonnanceId);
        if (!optionalFichierOrdonnance.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        // Récupérer l'ordonnance existante
        FichierOrdonnance fichierOrdonnance = optionalFichierOrdonnance.get();

        // Associer le nouveau résultat à l'ordonnance
        resultatOrdonnance.setFichierOrdonnance(fichierOrdonnance);
        fichierOrdonnance.getResultatsOrdonnance().add(resultatOrdonnance);

        // Sauvegarder le nouveau résultat
        resultatOrdonnanceRepository.save(resultatOrdonnance);

        // Sauvegarder l'ordonnance mise à jour avec le nouveau résultat
        fichierOrdonnanceRepository.save(fichierOrdonnance);

        return ResponseEntity.ok(fichierOrdonnance);
    }


    @GetMapping("/{fichierOrdonnanceId}/resultats")
    public ResponseEntity<List<ResultatOrdonnance>> getResultatsByFichierOrdonnanceId(@PathVariable Long fichierOrdonnanceId) {
        // Récupérer l'ordonnance par ID
        Optional<FichierOrdonnance> optionalFichierOrdonnance = fichierOrdonnanceRepository.findById(fichierOrdonnanceId);
        if (!optionalFichierOrdonnance.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        // Récupérer les résultats associés à l'ordonnance
        FichierOrdonnance fichierOrdonnance = optionalFichierOrdonnance.get();
        List<ResultatOrdonnance> resultatsOrdonnance = fichierOrdonnance.getResultatsOrdonnance();

        return ResponseEntity.ok(resultatsOrdonnance);
    }


}
