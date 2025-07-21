package com.CNAM.backend.service;

import com.CNAM.backend.controller.UtilisateurController;
import com.CNAM.backend.model.Utilisateur;
import com.CNAM.backend.repo.UtilisateurRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UtilisateurService {

    @Autowired
    private UtilisateurRepo userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public Utilisateur saveUser(Utilisateur user) {
        user.setPwd(passwordEncoder.encode(user.getPwd()));
        return userRepository.save(user);
    }

    public Utilisateur findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
