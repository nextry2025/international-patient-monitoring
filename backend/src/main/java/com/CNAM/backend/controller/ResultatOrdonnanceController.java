package com.CNAM.backend.controller;

import com.CNAM.backend.model.FichierOrdonnance;
import com.CNAM.backend.model.ResultatOrdonnance;
import com.CNAM.backend.repo.ResultatOrdonnanceRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/resultats-ordonnance")
public class ResultatOrdonnanceController {

    @Autowired
    private ResultatOrdonnanceRepo resultatOrdonnanceRepository;

    @GetMapping
    public List<ResultatOrdonnance> getAllResultatsOrdonnance() {
        return resultatOrdonnanceRepository.findAll();
    }




    @GetMapping("/fichierOrdonnance/{fichierOrdonnanceId}")
    public ResponseEntity<List<ResultatOrdonnance>> getResultatsByFichierOrdonnanceId(@PathVariable Long fichierOrdonnanceId) {
        List<ResultatOrdonnance> resultatsOrdonnance = resultatOrdonnanceRepository.findByFichierOrdonnanceId(fichierOrdonnanceId);
        if (resultatsOrdonnance.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(resultatsOrdonnance);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResultatOrdonnance> getResultatOrdonnanceById(@PathVariable Long id) {
        Optional<ResultatOrdonnance> resultatOrdonnance = resultatOrdonnanceRepository.findById(id);
        return resultatOrdonnance.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ResultatOrdonnance> createResultatOrdonnance(@RequestBody ResultatOrdonnance resultatOrdonnance) {
        ResultatOrdonnance savedResultatOrdonnance = resultatOrdonnanceRepository.save(resultatOrdonnance);
        return ResponseEntity.ok(savedResultatOrdonnance);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResultatOrdonnance> updateResultatOrdonnance(@PathVariable Long id, @RequestBody ResultatOrdonnance resultatOrdonnanceDetails) {
        Optional<ResultatOrdonnance> resultatOrdonnance = resultatOrdonnanceRepository.findById(id);
        if (!resultatOrdonnance.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        ResultatOrdonnance existingResultatOrdonnance = resultatOrdonnance.get();
        existingResultatOrdonnance.setFichier(resultatOrdonnanceDetails.getFichier());
        // update other fields if needed

        ResultatOrdonnance updatedResultatOrdonnance = resultatOrdonnanceRepository.save(existingResultatOrdonnance);
        return ResponseEntity.ok(updatedResultatOrdonnance);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResultatOrdonnance(@PathVariable Long id) {
        Optional<ResultatOrdonnance> resultatOrdonnance = resultatOrdonnanceRepository.findById(id);
        if (!resultatOrdonnance.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        resultatOrdonnanceRepository.delete(resultatOrdonnance.get());
        return ResponseEntity.noContent().build();
    }
}
