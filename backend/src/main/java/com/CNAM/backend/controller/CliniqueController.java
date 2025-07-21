package com.CNAM.backend.controller;

import com.CNAM.backend.model.*;
import com.CNAM.backend.repo.CliniqueRepo;
import com.CNAM.backend.repo.DemandeRepo;
import com.CNAM.backend.repo.SoigneRepo;
import com.CNAM.backend.repo.UtilisateurRepo;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cliniques")
public class CliniqueController {

    @Autowired
    private CliniqueRepo cliniqueRepo;

    @Autowired
    private SoigneRepo soigneRepository;

    @Autowired
    private UtilisateurRepo utilisateurRepo;

    @Autowired
    private DemandeRepo demandeRepo;

    @PostMapping
    public ResponseEntity<Clinique> createClinique(@RequestBody Clinique clinique) {
        Clinique savedClinique = cliniqueRepo.save(clinique);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedClinique);
    }

    @GetMapping
    public ResponseEntity<List<Clinique>> getAllCliniques() {
        List<Clinique> cliniques = cliniqueRepo.findAll();
        return ResponseEntity.ok(cliniques);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Clinique> getCliniqueById(@PathVariable Long id) {
        Clinique clinique = cliniqueRepo.findById(id).orElse(null);
        return clinique != null ? ResponseEntity.ok(clinique) : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Clinique> updateClinique(@PathVariable Long id, @RequestBody Clinique cliniqueDetails) {
        Clinique clinique = cliniqueRepo.findById(id).orElse(null);
        if (clinique != null) {
            clinique.setNom(cliniqueDetails.getNom());
            clinique.setEmail(cliniqueDetails.getEmail());
            clinique.setPays(cliniqueDetails.getPays());
            clinique.setType(cliniqueDetails.getType());
            Clinique updatedClinique = cliniqueRepo.save(clinique);
            return ResponseEntity.ok(updatedClinique);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClinique(@PathVariable Long id) {
        try {
            // Supprimer les enregistrements de Soigne associés à cette clinique
            List<Soigne> soignes = soigneRepository.findByCliniqueId(id);
            if (soignes != null && !soignes.isEmpty()) {
                soigneRepository.deleteAll(soignes);
            }
            cliniqueRepo.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}/patients")
    public ResponseEntity<List<Patient>> getPatientsByCliniqueId(@PathVariable Long id) {
        List<Soigne> soignes = soigneRepository.findByCliniqueId(id);
        List<Patient> patients = soignes.stream().map(Soigne::getPatient).collect(Collectors.toList());
        return ResponseEntity.ok(patients);
    }


//    @GetMapping("/{email}")
//    public ResponseEntity<Clinique> getCliniqueByEmail(@PathVariable String email) {
//        Optional<Clinique> clinique = cliniqueRepo.findByEmail(email);
//        return clinique.isPresent() ? ResponseEntity.ok(clinique.get()) : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//    }




    @GetMapping("/patients")
    public ResponseEntity<List<String>> getPatientsByUserEmail(HttpServletRequest request) {
        String userEmail = (String) request.getSession().getAttribute("userEmail");
        if (userEmail == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        Optional<Clinique> cliniqueOptional = cliniqueRepo.findByEmail(userEmail);
        if (!cliniqueOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        Long cliniqueId = cliniqueOptional.get().getId();
        List<Soigne> soignes = soigneRepository.findByCliniqueId(cliniqueId);
        List<String> patientNames = soignes.stream()
                .map(soigne -> soigne.getPatient().getNom())
                .collect(Collectors.toList());

        return ResponseEntity.ok(patientNames);
    }


    // CliniqueController.java
    @GetMapping("/findByEmail")
    public ResponseEntity<Clinique> getCliniqueByEmail(@RequestParam String email) {
        Clinique clinique = cliniqueRepo.findByEmail(email).orElse(null);
        return clinique != null ? ResponseEntity.ok(clinique) : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }


    @PostMapping("/addDemandetToClinique/{id}")
    public ResponseEntity<Demande> addDemandetToClinique(@PathVariable Long id, @RequestBody Demande demande) {
        try {
            // Enregistrer la demande pour générer l'ID
            Demande savedDemande = demandeRepo.save(demande);

            Optional<Clinique> cliniqueData = cliniqueRepo.findById(id);
            if (cliniqueData.isPresent()) {
                Clinique clinique = cliniqueData.get();
                List<Demande> demandes = clinique.getDemandes();
                demandes.add(savedDemande);
                clinique.setDemandes(demandes);
                cliniqueRepo.save(clinique);

                // Retourner la demande enregistrée avec son ID
                return new ResponseEntity<>(savedDemande, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}/demandes")
    public ResponseEntity<List<Demande>> getDemandesByCliniqueId(@PathVariable Long id) {
        Optional<Clinique> clinique = cliniqueRepo.findById(id);
        if (clinique == null) {
            return ResponseEntity.notFound().build();
        }
        List<Demande> demandes = clinique.get().getDemandes();
        if (demandes.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(demandes);
    }

    @GetMapping("/{id}/getCliniqueByDemandeId")
    public ResponseEntity<Clinique> getCliniqueByDemandeId(@PathVariable Long id) {
        Optional<Demande> demande = demandeRepo.findById(id);

        if (!demande.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Clinique> clinique = cliniqueRepo.findByIdDemande(demande.get().getId());

        if (!clinique.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(clinique.get());
    }


    @GetMapping("/count")
    public ResponseEntity<Long> countCliniques() {
        long count = cliniqueRepo.count();
        return ResponseEntity.ok(count);
    }


    @Autowired
    private SoigneRepo soigneRepo;

//    @GetMapping("/sortedByPatients")
//    public ResponseEntity<List<Clinique>> getCliniquesSortedByPatients() {
//        List<Object[]> cliniqueWithPatientCounts = soigneRepo.countPatientsByClinique();
//        List<Clinique> sortedCliniques = cliniqueWithPatientCounts.stream()
//                .map(entry -> (Clinique) entry[0])
//                .collect(Collectors.toList());
//
//        return ResponseEntity.ok(sortedCliniques);
//    }


    @GetMapping("/sortedByPatients")
    public ResponseEntity<List<Map<String, Object>>> getCliniquesSortedByPatients() {
        List<Object[]> cliniqueWithPatientCounts = cliniqueRepo.findClinicsWithPatientCounts();
        List<Map<String, Object>> sortedCliniques = cliniqueWithPatientCounts.stream()
                .map(entry -> {
                    Clinique clinique = (Clinique) entry[0];
                    Long patientCount = (Long) entry[1];
                    Map<String, Object> result = new HashMap<>();
                    result.put("id", clinique.getId());
                    result.put("nom", clinique.getNom());
                    result.put("email", clinique.getEmail());
                    result.put("pays", clinique.getPays());
                    result.put("type", clinique.getType());
                    result.put("patientCount", patientCount);
                    return result;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(sortedCliniques);
    }




}
