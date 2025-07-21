package com.CNAM.backend.repo;

import com.CNAM.backend.model.ActesDemande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActesDemandesRepo extends JpaRepository<ActesDemande,Long> {
    List<ActesDemande> findByDemandeId(Long demandeId);
}
