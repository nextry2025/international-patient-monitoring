package com.CNAM.backend.controller;


import com.CNAM.backend.model.Demande;
import com.CNAM.backend.model.Demandes_Admission;
import com.CNAM.backend.model.Message;
import com.CNAM.backend.model.Utilisateur;
import com.CNAM.backend.repo.DemandeRepo;
import com.CNAM.backend.repo.Demandes_AdmissionRepo;
import com.CNAM.backend.repo.MessageRepo;
import com.CNAM.backend.repo.UtilisateurRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageRepo messageRepository;

    @Autowired
    private UtilisateurRepo userRepository;
    @Autowired
    private  DemandeRepo demandeRepo;
    @Autowired
    private Demandes_AdmissionRepo demandesAdmissionRepo;


    @PostMapping("/send")
    public Message sendMessage(@RequestParam Long senderId,
                               @RequestParam Long receiverId,
                               @RequestParam(required = false) Long demandeId,
                               @RequestParam String content,
                               @RequestParam(required = false) Long demandeAdmissionId) {

        Utilisateur sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        Utilisateur receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Demande demande = null;
        if (demandeId != null) {
            demande = demandeRepo.findById(demandeId)
                    .orElseThrow(() -> new RuntimeException("Demande not found"));
        }

        Demandes_Admission demandeAdmission = null;
        if (demandeAdmissionId != null && !demandeAdmissionId.equals("null")) {
            Long admissionId = Long.valueOf(demandeAdmissionId);
            demandeAdmission = demandesAdmissionRepo.findById(admissionId)
                    .orElseThrow(() -> new RuntimeException("Demande Admission not found"));
        }

        Message message = new Message();
        message.setExpediteur(sender);
        message.setDestinataire(receiver);
        message.setDemande(demande);
        message.setDemandesAdmission(demandeAdmission);
        message.setContenu(content);
        message.setHorodatage(LocalDateTime.now());

        return messageRepository.save(message);
    }



    @GetMapping("/forUser/{id}")
    public List<Message> getMessagesForUser(@PathVariable Long id) {
        return messageRepository.findByDestinataireId(id);
    }



    @GetMapping("/nonlu/{id}")
    public long getUnreadMessagesCount(@PathVariable Long id) {
        return messageRepository.countByDestinataireIdAndLuFalse(id);
    }

    @PostMapping("/markermessagescommelu/{id}")
    public void markermessagescommelu(@PathVariable Long id) {
        List<Message> messages = messageRepository.findByDestinataireIdAndLuFalse(id);
        for (Message message : messages) {
            message.setLu(true);
            messageRepository.save(message);
        }
    }


}

