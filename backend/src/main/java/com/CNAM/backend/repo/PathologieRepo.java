package com.CNAM.backend.repo;

import com.CNAM.backend.model.Pathologie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PathologieRepo extends JpaRepository<Pathologie,Long> {
}
