package com.CNAM.backend.controller;

import com.CNAM.backend.model.Traitement;
import com.CNAM.backend.repo.TraitementRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
public class TraitementController {
    @Autowired
    private TraitementRepo traitementRepo;

    @GetMapping("/getAllTraitements")
    public ResponseEntity<List<Traitement>> getAllTraitements() {
        try {
            List<Traitement> traitementList = new ArrayList<>();
            traitementRepo.findAll().forEach(traitementList::add);
            if (traitementList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(traitementList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getTraitementById/{id}")
    public ResponseEntity<Traitement> getTraitementById(@PathVariable Long id) {
        Optional<Traitement> traitementData = traitementRepo.findById(id);
        if (traitementData.isPresent()) {
            return new ResponseEntity<>(traitementData.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/addTraitement")
    public ResponseEntity<Traitement> addTraitement(@RequestBody Traitement traitement) {
        Traitement traitementObj = traitementRepo.save(traitement);
        return new ResponseEntity<>(traitementObj, HttpStatus.OK);
    }

    @PutMapping("/updateTraitement/{id}")
    public ResponseEntity<Traitement> updateTraitement(@PathVariable Long id, @RequestBody Traitement newTraitementData) {
        Optional<Traitement> ancientTraitement = traitementRepo.findById(id);
        if (ancientTraitement.isPresent()) {
            Traitement updateTraitementData = ancientTraitement.get();
            updateTraitementData.setClinique(newTraitementData.getClinique());
            updateTraitementData.setPathologie(newTraitementData.getPathologie());
            Traitement traitementObj = traitementRepo.save(updateTraitementData);
            return new ResponseEntity<>(traitementObj, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/deleteTraitement/{id}")
    public ResponseEntity<HttpStatus> deleteTraitementById(@PathVariable Long id) {
        try {
            traitementRepo.deleteById(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
