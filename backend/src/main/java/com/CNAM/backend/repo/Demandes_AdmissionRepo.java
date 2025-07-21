package com.CNAM.backend.repo;

import com.CNAM.backend.model.Demandes_Admission;
import com.CNAM.backend.model.Patient;
import com.CNAM.backend.model.Statut;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface Demandes_AdmissionRepo extends JpaRepository<Demandes_Admission, Long> {
    List<Demandes_Admission> findByValideIsFalseAndPatientStatut(Statut statut);
    long countByValideIsFalse();
    @Query("SELECT da.patient FROM Demandes_Admission da WHERE da.valide = false")
    List<Patient> findPatientsEnAttente();

    @Query("SELECT d FROM Demandes_Admission d WHERE d.patient.id = :patientId AND d.valide = :valide")
    Optional<Demandes_Admission> findByPatientIdAndValide(@Param("patientId") Long patientId, @Param("valide") boolean valide);

}
