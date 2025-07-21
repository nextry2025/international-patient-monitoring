package com.CNAM.backend.repo;

import com.CNAM.backend.model.Prestation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrestationRepo extends JpaRepository<Prestation,Long> {

}
