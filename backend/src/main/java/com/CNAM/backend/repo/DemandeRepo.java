package com.CNAM.backend.repo;

import com.CNAM.backend.model.Demande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DemandeRepo extends JpaRepository<Demande, Long> {
    List<Demande> findByValideCliniqueNational(boolean valideCliniqueNational);
    List<Demande> findByValideAdmin(boolean valideAdmin);

}


