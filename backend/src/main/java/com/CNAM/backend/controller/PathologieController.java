package com.CNAM.backend.controller;

import com.CNAM.backend.model.Pathologie;
import com.CNAM.backend.repo.PathologieRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/patho")
public class PathologieController {
    @Autowired
    private PathologieRepo pathologieRepo;

    @GetMapping("/getAllPathologies")
    public ResponseEntity<List<Pathologie>> getAllPathologies() {
        try {
            List<Pathologie> pathologieList = new ArrayList<>();
            pathologieRepo.findAll().forEach(pathologieList::add);
            if (pathologieList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(pathologieList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getPathologieById/{id}")
    public ResponseEntity<Pathologie> getPathologieById(@PathVariable Long id) {
        Optional<Pathologie> pathologieData = pathologieRepo.findById(id);
        if (pathologieData.isPresent()) {
            return new ResponseEntity<>(pathologieData.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/addPathologie")
    public ResponseEntity<Pathologie> addPathologie(@RequestBody Pathologie pathologie) {
        Pathologie pathologieObj = pathologieRepo.save(pathologie);
        return new ResponseEntity<>(pathologieObj, HttpStatus.OK);
    }

    @PostMapping("/updatePathologie/{id}")
    public ResponseEntity<Pathologie> updatePathologie(@PathVariable Long id, @RequestBody Pathologie newPathologieData) {
        Optional<Pathologie> ancientPathologie = pathologieRepo.findById(id);
        if (ancientPathologie.isPresent()) {
            Pathologie updatePathologieData = ancientPathologie.get();
            updatePathologieData.setType(newPathologieData.getType());
            Pathologie Objpathologie = pathologieRepo.save(updatePathologieData);
            return new ResponseEntity<>(Objpathologie, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/deletePathologie/{id}")
    public ResponseEntity<HttpStatus> deletePathologieById(@PathVariable Long id) {
        try {
            pathologieRepo.deleteById(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
