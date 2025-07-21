package com.CNAM.backend.controller;

import com.CNAM.backend.model.Demandes_Admission;
import com.CNAM.backend.model.Patient;
import com.CNAM.backend.model.Soigne;
import com.CNAM.backend.model.Statut;
import com.CNAM.backend.repo.PatientRepo;
import com.CNAM.backend.repo.SoigneRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.CNAM.backend.repo.Demandes_AdmissionRepo;
import com.CNAM.backend.repo.DemandeRepo;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/patient")
public class PatientController {
    @Autowired
    private PatientRepo patientRepo;

    @Autowired
    private  Demandes_AdmissionRepo demandesAdmissionRepo;
    @GetMapping("/getAllPatients")
    public ResponseEntity<List<Patient>> getAllPatients() {
        try {
            List<Patient> patientList = new ArrayList<>();
            patientRepo.findAll().forEach(patientList::add);
            if (patientList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(patientList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getPatientById/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        Optional<Patient> patientData = patientRepo.findById(id);
        if (patientData.isPresent()) {
            return new ResponseEntity<>(patientData.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/addPatient")
    public ResponseEntity<Patient> addPatient(@RequestBody Patient patient) {
        patient.setStatut(Statut.PRET_POUR_TRANSFERT_A_ÉTRANGER);
        Patient patientObj = patientRepo.save(patient);
        return new ResponseEntity<>(patientObj, HttpStatus.OK);
    }

    @PutMapping("/updatePatient/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable Long id, @RequestBody Patient newPatientData) {
        Optional<Patient> ancientPatient = patientRepo.findById(id);
        if (ancientPatient.isPresent()) {
            Patient updatePatientData = ancientPatient.get();
            updatePatientData.setNNI(newPatientData.getNNI());
            updatePatientData.setCni(newPatientData.getCni());
            updatePatientData.setNom(newPatientData.getNom());
            updatePatientData.setPassport(newPatientData.getPassport());
            updatePatientData.setPrenom(newPatientData.getPrenom());
            updatePatientData.setTel(newPatientData.getTel());
            updatePatientData.setStatut(newPatientData.getStatut());
            Patient patientObj = patientRepo.save(updatePatientData);
            return new ResponseEntity<>(patientObj, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }



    @PutMapping("/{id}/updateStatus/{updateStatus}")
    public ResponseEntity<Patient> updatePatientStatus(@PathVariable Long id, @PathVariable Statut updateStatus) {
        try {
            Patient patient = patientRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Patient non trouvé avec l'ID : " + id));


            patient.setStatut(updateStatus);

            Patient updatedPatient = patientRepo.save(patient);

            return new ResponseEntity<>(patient, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }




    @DeleteMapping("/deletePatient/{id}")
    public ResponseEntity<HttpStatus> deletePatientById(@PathVariable Long id) {
        try {
            patientRepo.deleteById(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



private final SoigneRepo soigneRepository;


    @Autowired
    public PatientController(SoigneRepo soigneRepository) {
        this.soigneRepository = soigneRepository;
    }

    @GetMapping("/checkClinique/{patientId}")
    public ResponseEntity<?> checkClinique(@PathVariable Long patientId) {
        Optional<Soigne> soigne = soigneRepository.findByPatientId(patientId);
        if (soigne.isPresent()) {
            String cliniqueId = soigne.get().getClinique().getEmail();
            return ResponseEntity.ok(Map.of("cliniqueId", cliniqueId));
        } else {
            return ResponseEntity.ok(Map.of());
        }
    }



    @GetMapping("/checkDemande/{patientId}")
    public ResponseEntity<?> checkDemande(@PathVariable Long patientId) {
        Optional<Demandes_Admission> demande = demandesAdmissionRepo.findByPatientIdAndValide(patientId, false);
        if (demande.isPresent()) {
            String cliniqueEmail = demande.get().getClinique().getEmail();
            Long demandeId = demande.get().getId();
            return ResponseEntity.ok(Map.of("inDemande", true, "cliniqueEmail", cliniqueEmail, "demandeId", demandeId));

        } else {
            return ResponseEntity.ok(Map.of("inDemande", false));
        }
    }






    @GetMapping("/count")
    public ResponseEntity<Long> countPatients() {
        long count = patientRepo.count();
        return ResponseEntity.ok(count);
    }





}
