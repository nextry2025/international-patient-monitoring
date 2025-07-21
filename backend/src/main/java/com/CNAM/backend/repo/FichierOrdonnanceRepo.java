package com.CNAM.backend.repo;

import com.CNAM.backend.model.FichierOrdonnance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FichierOrdonnanceRepo extends JpaRepository<FichierOrdonnance,Long> {
    List<FichierOrdonnance> findByRapportId(Long rapportId);
}
