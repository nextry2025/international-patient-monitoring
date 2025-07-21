package com.CNAM.backend.repo;

import com.CNAM.backend.model.Clinique;
import com.CNAM.backend.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface CliniqueRepo extends JpaRepository<Clinique, Long> {
    boolean existsByEmail(String email);
    Optional<Clinique> findByEmail(String email);
    Optional<Clinique> findById(Long id);


    @Query("SELECT c FROM Clinique c JOIN c.demandes d WHERE d.id = :idDemande")
    Optional<Clinique> findByIdDemande(@Param("idDemande") Long idDemande);




    @Query("SELECT c, COUNT(s.patient.id) AS patientCount " +
            "FROM Clinique c LEFT JOIN Soigne s ON c.id = s.clinique.id " +
            "GROUP BY c.id " +
            "ORDER BY patientCount DESC")
    List<Object[]> findClinicsWithPatientCounts();
}
