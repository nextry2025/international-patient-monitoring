package com.CNAM.backend.repo;

import com.CNAM.backend.model.Rapport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RapportRepo extends JpaRepository<Rapport,Long> {
}
