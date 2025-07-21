package com.CNAM.backend.controller;

import com.CNAM.backend.model.Clinique;
import com.CNAM.backend.model.Utilisateur;
import com.CNAM.backend.repo.CliniqueRepo;
import com.CNAM.backend.repo.UtilisateurRepo;
import com.CNAM.backend.security.JwtUtil;
import com.CNAM.backend.service.EmailService;
import com.CNAM.backend.service.UserDetailsServiceImpl;
import com.CNAM.backend.service.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/utilisateurs")
public class UtilisateurController {
    

    @Autowired
    private UtilisateurRepo utilisateurRepository;
    @Autowired
    private UserDetailsServiceImpl utilisateurService;

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CliniqueRepo cliniqueRepository;

    @Autowired
    private EmailService emailService;

    private String code;

    @PostMapping("/verifyInfo")
    public ResponseEntity<String> verifyUserInfo(@RequestBody Utilisateur utilisateur) {
        if (!cliniqueRepository.existsByEmail(utilisateur.getEmail())) {
            return new ResponseEntity<>("Email non trouvé.", HttpStatus.BAD_REQUEST);
        }
        if (utilisateurRepository.existsByEmail(utilisateur.getEmail())) {
            return new ResponseEntity<>("Email déjà utilisé.", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>("Informations vérifiées avec succès.", HttpStatus.OK);
    }

    @PostMapping("/sendVerificationCode")
    public ResponseEntity<String> sendVerificationCode(@RequestParam String email) {
        code = emailService.sendVerificationCode(email);
        return new ResponseEntity<>("Code de vérification envoyé.", HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<String> createUtilisateur(@RequestBody Utilisateur utilisateur, @RequestParam String verificationCode) {
        if (!cliniqueRepository.existsByEmail(utilisateur.getEmail())) {
            return new ResponseEntity<>("Email non trouvé.", HttpStatus.BAD_REQUEST);
        }
        if (utilisateurRepository.existsByEmail(utilisateur.getEmail())) {
            return new ResponseEntity<>("Email déjà utilisé.", HttpStatus.BAD_REQUEST);
        }
        boolean isCorrectCode = emailService.verifyVerificationCode(code, verificationCode);
        if (!isCorrectCode) {
            return new ResponseEntity<>("Code de vérification incorrect.", HttpStatus.BAD_REQUEST);
        }
        Optional<Clinique> cliniqueOpt = cliniqueRepository.findByEmail(utilisateur.getEmail());
        if (!cliniqueOpt.isPresent()) {
            return new ResponseEntity<>("Email non trouvé.", HttpStatus.BAD_REQUEST);
        }

        Clinique clinique = cliniqueOpt.get();
        if ("International".equalsIgnoreCase(clinique.getType())) {
            utilisateur.setRole("Clinique_etranger");
        } else if ("Nationale".equalsIgnoreCase(clinique.getType())) {
            utilisateur.setRole("Clinique_national");
        }
        utilisateur.setImageData(Utilisateur.DEFAULT_IMAGE_DATA);

        String encryptedPassword = passwordEncoder.encode(utilisateur.getPwd());
        utilisateur.setPwd(encryptedPassword);

        utilisateurRepository.save(utilisateur);
        return new ResponseEntity<>("Utilisateur créé avec succès.", HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Utilisateur>> getAllUtilisateurs() {
        List<Utilisateur> utilisateurs = utilisateurRepository.findAll();
        return new ResponseEntity<>(utilisateurs, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Utilisateur> getUtilisateurById(@PathVariable Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id).orElse(null);
        return utilisateur != null ? new ResponseEntity<>(utilisateur, HttpStatus.OK) :
                new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("email/{email}")
    public ResponseEntity<Utilisateur> getUtilisateurByEmail(@PathVariable String email) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email);
        return utilisateur != null ? new ResponseEntity<>(utilisateur, HttpStatus.OK) :
                new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Utilisateur> updateUtilisateur(@PathVariable Long id, @RequestBody Utilisateur utilisateurDetails) {
        Utilisateur utilisateur = utilisateurRepository.findById(id).orElse(null);
        if (utilisateur != null) {
            utilisateur.setImageData(utilisateurDetails.getImageData());
            utilisateur.setNom(utilisateurDetails.getNom());
            Utilisateur updatedUtilisateur = utilisateurRepository.save(utilisateur);
            return new ResponseEntity<>(updatedUtilisateur, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUtilisateur(@PathVariable Long id) {
        utilisateurRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }



    @GetMapping("/info")
    public ResponseEntity<Utilisateur> getUserInformation(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String user_email = jwtUtil.extractEmail(token);
        Utilisateur utilisateur = utilisateurRepository.findByEmail(user_email);

        if (utilisateur != null) {
            return new ResponseEntity<>(utilisateur, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }




    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Missing or invalid Authorization header");
        }

        String token = authHeader.replace("Bearer ", "");
        jwtUtil.expireToken(token);
        return ResponseEntity.ok("Logged out successfully");
    }



}
