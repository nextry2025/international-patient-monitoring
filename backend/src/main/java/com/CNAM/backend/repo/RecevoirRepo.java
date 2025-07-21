package com.CNAM.backend.repo;

import com.CNAM.backend.model.Prestation;
import com.CNAM.backend.model.Recevoir;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RecevoirRepo extends JpaRepository<Recevoir,Long> {
    List<Recevoir> findByPatientIdAndFkUserId(Long patientId, Long userId);


    List<Recevoir> findByPatientId(Long patientId);

}
