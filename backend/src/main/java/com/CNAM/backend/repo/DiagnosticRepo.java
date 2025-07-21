package com.CNAM.backend.repo;

import com.CNAM.backend.model.Diagnostic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DiagnosticRepo extends JpaRepository<Diagnostic,Long> {
    List<Diagnostic> findByPathologieId(Long pathologieId);
}
