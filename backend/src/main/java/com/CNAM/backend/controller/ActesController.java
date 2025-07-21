package com.CNAM.backend.controller;

import com.CNAM.backend.model.Actes;
import com.CNAM.backend.repo.ActesRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/actes")
public class ActesController {

    @Autowired
    private ActesRepo actesRepo;

    @PostMapping
    public Actes createActes(@RequestBody Actes actes) {
        return actesRepo.save(actes);
    }

    @GetMapping
    public List<Actes> getAllActes() {
        return actesRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Actes> getActesById(@PathVariable Long id) {
        Optional<Actes> actes = actesRepo.findById(id);
        if (actes.isPresent()) {
            return ResponseEntity.ok(actes.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Actes> updateActes(@PathVariable Long id, @RequestBody Actes actesDetails) {
        Optional<Actes> actes = actesRepo.findById(id);
        if (actes.isPresent()) {
            Actes updatedActes = actes.get();
            updatedActes.setCode(actesDetails.getCode());
            updatedActes.setLibelle(actesDetails.getLibelle());
            updatedActes.setType(actesDetails.getType());
            return ResponseEntity.ok(actesRepo.save(updatedActes));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActes(@PathVariable Long id) {
        if (actesRepo.existsById(id)) {
            actesRepo.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
