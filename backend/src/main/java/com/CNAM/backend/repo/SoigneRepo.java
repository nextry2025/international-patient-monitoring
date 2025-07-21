package com.CNAM.backend.repo;


import com.CNAM.backend.model.Patient;
import com.CNAM.backend.model.Soigne;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface SoigneRepo extends JpaRepository<Soigne, Long> {
    List<Soigne> findByCliniqueId(Long cliniqueId);

    Optional<Soigne> findByPatientId(Long patientId);

    @Query("SELECT s.clinique.pays, COUNT(s.patient.id) FROM Soigne s GROUP BY s.clinique.pays")
    List<Object[]> countPatientsByPays();


    @Query("SELECT s.patient FROM Soigne s")
    List<Patient> findPatientsPrisEnCharge();





    @Query("SELECT c, COUNT(s.patient.id) AS patientCount " +
            "FROM Clinique c LEFT JOIN Soigne s ON c.id = s.clinique.id " +
            "GROUP BY c.id " +
            "ORDER BY patientCount DESC")
    List<Object[]> countPatientsByClinique();

}

