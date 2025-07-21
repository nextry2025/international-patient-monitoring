package com.CNAM.backend.controller;

import com.CNAM.backend.model.Prestation;
import com.CNAM.backend.model.Recevoir;
import com.CNAM.backend.model.Patient;
import com.CNAM.backend.repo.PrestationRepo;
import com.CNAM.backend.repo.RecevoirRepo;
import com.CNAM.backend.repo.PatientRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/recevoir")
public class RecevoirController {

    @Autowired
    private RecevoirRepo recevoirRepo;

    @Autowired
    private PrestationRepo prestationRepo;

    @Autowired
    private PatientRepo patientRepo;

    @GetMapping("/getAllRecevoirs")
    public ResponseEntity<List<Recevoir>> getAllRecevoirs() {
        try {
            List<Recevoir> recevoirList = new ArrayList<>();
            recevoirRepo.findAll().forEach(recevoirList::add);
            if (recevoirList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(recevoirList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getRecevoirById/{id}")
    public ResponseEntity<Recevoir> getRecevoirById(@PathVariable Long id) {
        Optional<Recevoir> recevoirData = recevoirRepo.findById(id);
        if (recevoirData.isPresent()) {
            return new ResponseEntity<>(recevoirData.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/addRecevoir")
    public ResponseEntity<Recevoir> addRecevoir(@RequestBody Recevoir recevoir) {
        Recevoir recevoirObj = recevoirRepo.save(recevoir);
        return new ResponseEntity<>(recevoirObj, HttpStatus.OK);
    }

    @PutMapping("/updateRecevoir/{id}")
    public ResponseEntity<Recevoir> updateRecevoir(@PathVariable Long id, @RequestBody Recevoir newRecevoirData) {
        Optional<Recevoir> ancientRecevoir = recevoirRepo.findById(id);
        if (ancientRecevoir.isPresent()) {
            Recevoir updateRecevoirData = ancientRecevoir.get();
            updateRecevoirData.setDate(newRecevoirData.getDate());
            updateRecevoirData.setPatient(newRecevoirData.getPatient());
            updateRecevoirData.setPrestation(newRecevoirData.getPrestation());
            updateRecevoirData.setFkUserId(newRecevoirData.getFkUserId());
            Recevoir recevoirObj = recevoirRepo.save(updateRecevoirData);
            return new ResponseEntity<>(recevoirObj, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/deleteRecevoir/{id}")
    public ResponseEntity<HttpStatus> deleteRecevoirById(@PathVariable Long id) {
        try {
            recevoirRepo.deleteById(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/addPrestationWithPatient")
    public ResponseEntity<Prestation> addPrestationWithPatient(@RequestParam Long patientId, @RequestBody Prestation prestation) {
        try {
            // Vérifier si le patient existe
            Optional<Patient> patientOpt = patientRepo.findById(patientId);
            if (!patientOpt.isPresent()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            // Sauvegarder la prestation
            Prestation savedPrestation = prestationRepo.save(prestation);

            // Ajouter une entrée dans la table 'recevoir' avec l'ID de l'utilisateur
            Recevoir recevoir = new Recevoir();
            recevoir.setPatient(patientOpt.get());
            recevoir.setPrestation(savedPrestation);
            recevoir.setDate(new Date());
            recevoir.setFkUserId(prestation.getUserId());
            recevoirRepo.save(recevoir);

            return ResponseEntity.ok(savedPrestation);
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }



    @GetMapping("/prestationsByPatientAndUser")
    public ResponseEntity<List<Prestation>> getPrestationsByPatientAndUser(@RequestParam Long patientId, @RequestParam Long userId) {
        try {
            List<Recevoir> recevoirList = recevoirRepo.findByPatientIdAndFkUserId(patientId, userId);
            List<Prestation> prestations = new ArrayList<>();
            for (Recevoir recevoir : recevoirList) {
                prestations.add(recevoir.getPrestation());
            }
            return new ResponseEntity<>(prestations, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }






    @GetMapping("/prestationsByPatient/{patientId}")
    public ResponseEntity<List<Prestation>> getPrestationsByPatient(@PathVariable Long patientId) {
        try {
            List<Recevoir> recevoirList = recevoirRepo.findByPatientId(patientId);
            List<Prestation> prestations = new ArrayList<>();
            for (Recevoir recevoir : recevoirList) {
                prestations.add(recevoir.getPrestation());
            }
            return new ResponseEntity<>(prestations, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



}
