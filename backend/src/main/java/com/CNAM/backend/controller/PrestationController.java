package com.CNAM.backend.controller;

import com.CNAM.backend.model.Prestation;
import com.CNAM.backend.model.Rapport;
import com.CNAM.backend.model.Recevoir;
import com.CNAM.backend.repo.PrestationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/prestation")
public class PrestationController {
    @Autowired
    private PrestationRepo prestationRepo;

    @GetMapping("/getAllPrestations")
    public ResponseEntity<List<Prestation>> getAllPrestations() {
        try {
            List<Prestation> prestationList = new ArrayList<>();
            prestationRepo.findAll().forEach(prestationList::add);
            if (prestationList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(prestationList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getPrestationById/{id}")
    public ResponseEntity<Prestation> getPrestationById(@PathVariable Long id) {
        Optional<Prestation> prestationData = prestationRepo.findById(id);
        if (prestationData.isPresent()) {
            return new ResponseEntity<>(prestationData.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/addPrestation")
    public ResponseEntity<Prestation> addPrestation(@RequestBody Prestation prestation) {
        Prestation prestationObj = prestationRepo.save(prestation);
        return new ResponseEntity<>(prestationObj, HttpStatus.OK);
    }


    // PrestationController.java






    @PutMapping("/updatePrestation/{id}")
    public ResponseEntity<Prestation> updatePrestation(@PathVariable Long id, @RequestBody Prestation newPrestationData) {
        Optional<Prestation> ancientPrestation = prestationRepo.findById(id);
        if (ancientPrestation.isPresent()) {
            Prestation updatePrestationData = ancientPrestation.get();
            updatePrestationData.setLibelle(newPrestationData.getLibelle());
            Prestation prestationObj = prestationRepo.save(updatePrestationData);
            return new ResponseEntity<>(prestationObj, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }


    @DeleteMapping("/deletePrestation/{id}")
    public ResponseEntity<HttpStatus> deletePrestationById(@PathVariable Long id) {
        try {
            prestationRepo.deleteById(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PostMapping("/addRapportToPrestation/{prestationId}")
    public ResponseEntity<Prestation> addRapportToPrestation(@PathVariable Long prestationId, @RequestBody Rapport rapport) {
        try {
            Optional<Prestation> prestationData = prestationRepo.findById(prestationId);
            if (prestationData.isPresent()) {
                Prestation prestation = prestationData.get();
                List<Rapport> rapports = prestation.getRapports();
                rapports.add(rapport);
                prestation.setRapports(rapports);
                Prestation updatedPrestation = prestationRepo.save(prestation);
                return new ResponseEntity<>(updatedPrestation, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



}
