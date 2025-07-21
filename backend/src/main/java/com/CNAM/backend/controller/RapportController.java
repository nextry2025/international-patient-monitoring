package com.CNAM.backend.controller;

import com.CNAM.backend.model.FichierOrdonnance;
import com.CNAM.backend.model.Rapport;
import com.CNAM.backend.repo.RapportRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/rapport")
public class RapportController {
    @Autowired
    private RapportRepo rapportRepo;

    @GetMapping("/getAllRapports")
    public ResponseEntity<List<Rapport>> getAllRapports() {
        try {
            List<Rapport> rapportList = new ArrayList<>();
            rapportRepo.findAll().forEach(rapportList::add);
            if (rapportList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(rapportList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getRapportById/{id}")
    public ResponseEntity<Rapport> getRapportById(@PathVariable Long id) {
        Optional<Rapport> rapportData = rapportRepo.findById(id);
        if (rapportData.isPresent()) {
            return new ResponseEntity<>(rapportData.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/addRapport")
    public ResponseEntity<Rapport> addRapport(@RequestBody Rapport rapport) {
        Rapport rapportObj = rapportRepo.save(rapport);
        return new ResponseEntity<>(rapportObj, HttpStatus.OK);
    }

    @PutMapping("/updateRapport/{id}")
    public ResponseEntity<Rapport> updateRapport(@PathVariable Long id, @RequestBody Rapport newRapportData) {
        Optional<Rapport> ancientRapport = rapportRepo.findById(id);
        if (ancientRapport.isPresent()) {
            Rapport updateRapportData = ancientRapport.get();
            updateRapportData.setDescription(newRapportData.getDescription());
            Rapport rapportObj = rapportRepo.save(updateRapportData);
            return new ResponseEntity<>(rapportObj, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/deleteRapport/{id}")
    public ResponseEntity<HttpStatus> deleteRapportById(@PathVariable Long id) {
        try {
            rapportRepo.deleteById(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/addFichierOrdonnance/{rapportId}")
    public ResponseEntity<Rapport> addFichierOrdonnance(@PathVariable Long rapportId, @RequestBody FichierOrdonnance fichierOrdonnance) {
        Optional<Rapport> optionalRapport = rapportRepo.findById(rapportId);

        if (optionalRapport.isPresent()) {
            Rapport rapport = optionalRapport.get();

            // Ajouter le fichier ordonnance à la liste des fichiers ordonnance du rapport
            rapport.getFichiersOrdonnance().add(fichierOrdonnance);

            // Sauvegarder les modifications
            Rapport updatedRapport = rapportRepo.save(rapport);

            return new ResponseEntity<>(updatedRapport, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
