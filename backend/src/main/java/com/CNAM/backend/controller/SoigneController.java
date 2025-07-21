package com.CNAM.backend.controller;

import com.CNAM.backend.model.Patient;
import com.CNAM.backend.model.Soigne;
import com.CNAM.backend.repo.SoigneRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class SoigneController {
    @Autowired
    private SoigneRepo soigneRepo;

    @GetMapping("/getAllSoignes")
    public ResponseEntity<List<Soigne>> getAllSoignes() {
        try {
            List<Soigne> soigneList = new ArrayList<>();
            soigneRepo.findAll().forEach(soigneList::add);
            if (soigneList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(soigneList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getSoigneById/{id}")
    public ResponseEntity<Soigne> getSoigneById(@PathVariable Long id) {
        Optional<Soigne> soigneData = soigneRepo.findById(id);
        if (soigneData.isPresent()) {
            return new ResponseEntity<>(soigneData.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

//    @PostMapping("/addSoigne")
//    public ResponseEntity<Soigne> addSoigne(@RequestBody Soigne soigne) {
//        Soigne soigneObj = soigneRepo.save(soigne);
//        return new ResponseEntity<>(soigneObj, HttpStatus.OK);
//    }

    @PostMapping("/addSoigne")
    public ResponseEntity<Soigne> addSoigne(@RequestBody Soigne soigne) {
        Soigne soigneObj = soigneRepo.save(soigne);
        return new ResponseEntity<>(soigneObj, HttpStatus.OK);
    }


    @PutMapping("/updateSoigne/{id}")
    public ResponseEntity<Soigne> updateSoigne(@PathVariable Long id, @RequestBody Soigne newSoigneData) {
        Optional<Soigne> ancientSoigne = soigneRepo.findById(id);
        if (ancientSoigne.isPresent()) {
            Soigne updateSoigneData = ancientSoigne.get();
            updateSoigneData.setDateDebut(newSoigneData.getDateDebut());
            updateSoigneData.setDateFin(newSoigneData.getDateFin());
            updateSoigneData.setClinique(newSoigneData.getClinique());
            updateSoigneData.setPatient(newSoigneData.getPatient());
            updateSoigneData.setPriseEnCharge(newSoigneData.getPriseEnCharge());
            Soigne soigneObj = soigneRepo.save(updateSoigneData);
            return new ResponseEntity<>(soigneObj, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/deleteSoigne/{id}")
    public ResponseEntity<HttpStatus> deleteSoigneById(@PathVariable Long id) {
        try {
            soigneRepo.deleteById(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getSoigneByIdClinique/{idClinique}")
    public ResponseEntity<List<Soigne>> getSoigneByIdClinique(@PathVariable Long idClinique) {
        try {
            List<Soigne> soigneList = soigneRepo.findByCliniqueId(idClinique);
            if (soigneList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(soigneList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/patients_per_country")
    public ResponseEntity<Map<String, Long>> countPatientsPerCountry() {
        try {
            Map<String, Long> patientsPerCountry = new HashMap<>();

            List<Object[]> result = soigneRepo.countPatientsByPays();
            for (Object[] row : result) {
                String country = (String) row[0];
                Long patientCount = (Long) row[1];
                patientsPerCountry.put(country, patientCount);
            }

            return ResponseEntity.ok(patientsPerCountry);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/getPatientCountryById/{patientId}")
    public ResponseEntity<String> getPatientCountryById(@PathVariable Long patientId) {
        try {
            Optional<Soigne> soigneData = soigneRepo.findByPatientId(patientId);
            if (soigneData.isPresent()) {
                String country = soigneData.get().getClinique().getPays(); // Assuming Patient has a method to get the country
                return ResponseEntity.ok(country);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }



    @GetMapping("/soigne/count")
    public ResponseEntity<Long> getSoigneCount() {
        try {
            long count = soigneRepo.count();
            return new ResponseEntity<>(count, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/patientssoigne")
    public ResponseEntity<List<Patient>> getPatientsPrisEnCharge() {
        try {
            List<Patient> patientsPrisEnCharge = soigneRepo.findPatientsPrisEnCharge();
            return new ResponseEntity<>(patientsPrisEnCharge, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}

