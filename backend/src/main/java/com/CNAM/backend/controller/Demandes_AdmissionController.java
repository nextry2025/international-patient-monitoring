package com.CNAM.backend.controller;


import com.CNAM.backend.model.Demandes_Admission;
import com.CNAM.backend.model.Message;
import com.CNAM.backend.model.Patient;
import com.CNAM.backend.model.Soigne;
import com.CNAM.backend.model.Statut;
import com.CNAM.backend.repo.Demandes_AdmissionRepo;
import com.CNAM.backend.repo.MessageRepo;
import com.CNAM.backend.repo.PatientRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.CNAM.backend.repo.SoigneRepo;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/demandes_admission")
public class Demandes_AdmissionController {

    @Autowired
    private Demandes_AdmissionRepo demandesAdmissionRepo;

    @Autowired
    private SoigneRepo soigneRepo;
    @Autowired
    private PatientRepo patientRepo;
    @Autowired
    private MessageRepo messageRepo;

    @PostMapping("/addDemande")
    public ResponseEntity<Demandes_Admission> addDemandeAdmission(@RequestBody Demandes_Admission demandeAdmission) {
        try {
            Long patientId = demandeAdmission.getPatient().getId();
            Patient patient = patientRepo.findById(patientId)
                    .orElseThrow(() -> new RuntimeException("Patient non trouvé avec l'ID : " + patientId));

            patient.setStatut(Statut.EN_ATTENTE_ADMISSION);
            patientRepo.save(patient);
            Demandes_Admission nouvelleDemande = demandesAdmissionRepo.save(demandeAdmission);
            return new ResponseEntity<>(nouvelleDemande, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace(); // Log the error for debugging
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/getDemandeAdmissionById/{id}")
    public ResponseEntity<Demandes_Admission> findDemandeAdmissionById(@PathVariable Long id) {
        try {
            Optional<Demandes_Admission> demande = demandesAdmissionRepo.findById(id);
            return demande.map(d -> new ResponseEntity<>(d, HttpStatus.OK))
                    .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/nonValidees")
    public ResponseEntity<List<Demandes_Admission>> getDemandesNonValidees() {
        try {
            List<Demandes_Admission> demandesNonValidees = demandesAdmissionRepo.findByValideIsFalseAndPatientStatut(Statut.EN_ATTENTE_ADMISSION);
            return new ResponseEntity<>(demandesNonValidees, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    @PutMapping("/valider/{id}")
    public ResponseEntity<Demandes_Admission> validerDemande(@PathVariable Long id) {
        Optional<Demandes_Admission> demandeData = demandesAdmissionRepo.findById(id);

        if (demandeData.isPresent()) {
            Demandes_Admission demande = demandeData.get();
            demande.setValide(true);
            demandesAdmissionRepo.save(demande);
            Soigne soigne = new Soigne(demande.getClinique(), demande.getPatient(), demande.getDateDebut(), demande.getDateFin(), demande.getResumerConseils());
            soigneRepo.save(soigne);

            return new ResponseEntity<>(demande, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }





    @GetMapping("/countPendingAdmissions")
    public ResponseEntity<Long> countPendingAdmissions() {
        try {
            long count = demandesAdmissionRepo.countByValideIsFalse();
            return new ResponseEntity<>(count, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/en-attente")
    public ResponseEntity<List<Patient>> getPatientsEnAttente() {
        List<Patient> patientsEnAttente = demandesAdmissionRepo.findPatientsEnAttente();
        return ResponseEntity.ok(patientsEnAttente);
    }



    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteDemande(@PathVariable Long id) {
        try {
            // Trouver la demande d'admission
            Demandes_Admission demandesAdmission = demandesAdmissionRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Demandes_Admission not found with id " + id));

            // Trouver et supprimer les messages associés à cette demande d'admission
            List<Message> messages = messageRepo.findByDemandesAdmissionId(id);
            messageRepo.deleteAll(messages);

            // Supprimer la demande d'admission elle-même
            demandesAdmissionRepo.deleteById(id);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting demande");
        }
    }

}
