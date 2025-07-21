package com.CNAM.backend.controller;

import com.CNAM.backend.model.Diagnostic;
import com.CNAM.backend.repo.DiagnosticRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
public class DiagnosticController {
    @Autowired
    private DiagnosticRepo diagnosticRepo;

    @GetMapping("/getAllDiagnostics")
    public ResponseEntity<List<Diagnostic>> getAllDiagnostics() {
        try {
            List<Diagnostic> diagnosticList = new ArrayList<>();
            diagnosticRepo.findAll().forEach(diagnosticList::add);
            if (diagnosticList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(diagnosticList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getDiagnosticById/{id}")
    public ResponseEntity<Diagnostic> getDiagnosticById(@PathVariable Long id) {
        Optional<Diagnostic> diagnosticData = diagnosticRepo.findById(id);
        if (diagnosticData.isPresent()) {
            return new ResponseEntity<>(diagnosticData.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/addDiagnostic")
    public ResponseEntity<Diagnostic> addDiagnostic(@RequestBody Diagnostic diagnostic) {
        Diagnostic diagnosticObj = diagnosticRepo.save(diagnostic);
        return new ResponseEntity<>(diagnosticObj, HttpStatus.OK);
    }

    @PutMapping("/updateDiagnostic/{id}")
    public ResponseEntity<Diagnostic> updateDiagnostic(@PathVariable Long id, @RequestBody Diagnostic newDiagnosticData) {
        Optional<Diagnostic> ancientDiagnostic = diagnosticRepo.findById(id);
        if (ancientDiagnostic.isPresent()) {
            Diagnostic updateDiagnosticData = ancientDiagnostic.get();
            updateDiagnosticData.setPatient(newDiagnosticData.getPatient());
            updateDiagnosticData.setPathologie(newDiagnosticData.getPathologie());
            Diagnostic diagnosticObj = diagnosticRepo.save(updateDiagnosticData);
            return new ResponseEntity<>(diagnosticObj, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/deleteDiagnostic/{id}")
    public ResponseEntity<HttpStatus> deleteDiagnosticById(@PathVariable Long id) {
        try {
            diagnosticRepo.deleteById(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/getPatientsByPathologieId/{pathologieId}")
    public ResponseEntity<List<Diagnostic>> getPatientsByPathologieId(@PathVariable Long pathologieId) {
        try {
            List<Diagnostic> diagnosticList = diagnosticRepo.findByPathologieId(pathologieId);
            if (diagnosticList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(diagnosticList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
