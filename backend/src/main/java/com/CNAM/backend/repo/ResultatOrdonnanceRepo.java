package com.CNAM.backend.repo;

import com.CNAM.backend.model.FichierOrdonnance;
import com.CNAM.backend.model.ResultatOrdonnance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResultatOrdonnanceRepo extends JpaRepository<ResultatOrdonnance,Long> {
    List<ResultatOrdonnance> findByFichierOrdonnanceId(Long fichierOrdonnanceId);


}
