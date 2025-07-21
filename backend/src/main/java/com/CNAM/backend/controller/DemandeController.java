package com.CNAM.backend.controller;

import com.CNAM.backend.model.Demande;
import com.CNAM.backend.repo.DemandeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/demande")
public class DemandeController {
    @Autowired
    private DemandeRepo demandeRepo;

    @PutMapping("/{id}/valide_national")
    public ResponseEntity<Demande> validerDemandeNational(@PathVariable Long id) {
        Optional<Demande> demandeOptional = demandeRepo.findById(id);
        if (!demandeOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Demande demande = demandeOptional.get();
        demande.setValideCliniqueNational(true);
        demandeRepo.save(demande);

        return ResponseEntity.ok(demande);
    }

    @PutMapping("/{id}/valide_admin")
    public ResponseEntity<Demande> validerDemandeAdmin(@PathVariable Long id,@RequestBody Demande demande_valide) {
        Optional<Demande> demandeOptional = demandeRepo.findById(id);
        if (!demandeOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Demande demande = demandeOptional.get();
        demande.setValideAdmin(true);
        demande.setCommentaire(demande_valide.getCommentaire());
        demandeRepo.save(demande);

        return ResponseEntity.ok(demande);
    }


    @GetMapping("/validees/national")
    public ResponseEntity<List<Demande>> getDemandesValideesParCliniqueNationale() {
        List<Demande> demandes = demandeRepo.findByValideCliniqueNational(true);
        return ResponseEntity.ok(demandes);
    }

    @GetMapping("/validees/admin")
    public ResponseEntity<List<Demande>> getDemandesValideesParAdmin() {
        List<Demande> demandes = demandeRepo.findByValideAdmin(true);
        return ResponseEntity.ok(demandes);
    }





    @GetMapping("/nonValidees/national")
    public ResponseEntity<List<Demande>> getDemandesNonValideesParCliniqueNationale() {
        List<Demande> demandes = demandeRepo.findByValideCliniqueNational(false);
        return ResponseEntity.ok(demandes);
    }

    @GetMapping("/nonValidees/admin")
    public ResponseEntity<List<Demande>> getDemandesNonValideesParAdmin() {
        List<Demande> demandesValideesParCliniqueNational = demandeRepo.findByValideCliniqueNational(true);
        List<Demande> demandes = demandesValideesParCliniqueNational.stream().filter(demande -> !demande.isValideAdmin()).collect(Collectors.toList());
        return ResponseEntity.ok(demandes);
    }







    @GetMapping("/getAllDemandes")
    public ResponseEntity<List<Demande>> getAllDemandes() {
        try {
            List<Demande> demandeList = new ArrayList<>();
            demandeRepo.findAll().forEach(demandeList::add);
            if (demandeList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(demandeList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getDemandeById/{id}")
    public ResponseEntity<Demande> getDemandeById(@PathVariable Long id) {
        Optional<Demande> demandeData = demandeRepo.findById(id);
        if (demandeData.isPresent()) {
            return new ResponseEntity<>(demandeData.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/addDemande")
    public ResponseEntity<Demande> addDemande(@RequestBody Demande demande) {
        try {
            Demande demandeObj = demandeRepo.save(demande);
            return new ResponseEntity<>(demandeObj, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/updateDemande/{id}")
    public ResponseEntity<Demande> updateDemande(@PathVariable Long id, @RequestBody Demande newDemandeData) {
        Optional<Demande> ancientDemande = demandeRepo.findById(id);
        if (ancientDemande.isPresent()) {
            Demande updateDemandeData = ancientDemande.get();
            updateDemandeData.setNomPrenom(newDemandeData.getNomPrenom());
            updateDemandeData.setINAM(newDemandeData.getINAM());
            updateDemandeData.setResume(newDemandeData.getResume());
            updateDemandeData.setTel(newDemandeData.getTel());
            updateDemandeData.setPiecesJointes(newDemandeData.getPiecesJointes());
            updateDemandeData.setValideCliniqueNational(newDemandeData.isValideCliniqueNational());
            updateDemandeData.setValideAdmin(newDemandeData.isValideAdmin());
            Demande demandeObj = demandeRepo.save(updateDemandeData);
            return new ResponseEntity<>(demandeObj, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/deleteDemande/{id}")
    public ResponseEntity<HttpStatus> deleteDemandeById(@PathVariable Long id) {
        try {
            demandeRepo.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @Autowired
    private DemandeRepo demandeRepository;

    @PutMapping("/{id}/demande_accomplement")
    public ResponseEntity<Demande> demandeAccomplement(@PathVariable Long id) {
        Optional<Demande> optionalDemande = demandeRepository.findById(id);
        if (optionalDemande.isPresent()) {
            Demande demande = optionalDemande.get();
            demande.setDemande_accomplement(true);
            demandeRepository.save(demande);
            return ResponseEntity.ok(demande);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
