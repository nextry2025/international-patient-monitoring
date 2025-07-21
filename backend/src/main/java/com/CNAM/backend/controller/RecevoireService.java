package com.CNAM.backend.controller;

import com.CNAM.backend.model.Recevoir;
import com.CNAM.backend.repo.RecevoirRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RecevoireService {
    @Autowired
    private RecevoirRepo recevoireRepository;

    public Recevoir save(Recevoir recevoire) {
        return recevoireRepository.save(recevoire);
    }
}
