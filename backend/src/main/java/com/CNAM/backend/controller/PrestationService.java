package com.CNAM.backend.controller;

import com.CNAM.backend.model.Prestation;
import com.CNAM.backend.repo.PrestationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PrestationService {
    @Autowired
    private PrestationRepo prestationRepository;

    public Prestation save(Prestation prestation) {
        return prestationRepository.save(prestation);
    }
}
