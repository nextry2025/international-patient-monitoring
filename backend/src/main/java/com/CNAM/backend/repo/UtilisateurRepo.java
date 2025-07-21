package com.CNAM.backend.repo;


import com.CNAM.backend.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UtilisateurRepo extends JpaRepository<Utilisateur, Long> {
    boolean existsByEmail(String email);

    Utilisateur findByEmail(String email);
}


