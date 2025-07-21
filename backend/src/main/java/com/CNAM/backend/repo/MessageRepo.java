package com.CNAM.backend.repo;

import com.CNAM.backend.model.Demandes_Admission;
import com.CNAM.backend.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepo extends JpaRepository<Message,Long> {
    List<Message> findByDestinataireId(Long destinataireId);
    long countByDestinataireIdAndLuFalse(Long id);
    List<Message> findByDestinataireIdAndLuFalse(Long id);
    List<Message> findByDemandesAdmissionId(Long demandeAdmissionId);

}
