package com.CNAM.backend.repo;

import com.CNAM.backend.model.Traitement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TraitementRepo extends JpaRepository<Traitement,Long> {
}
