package com.CNAM.backend.repo;

import com.CNAM.backend.model.Actes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActesRepo extends JpaRepository<Actes,Long> {
}
