package com.CNAM.backend.controller;

import com.CNAM.backend.security.JwtUtil;
import com.CNAM.backend.model.Utilisateur;
import com.CNAM.backend.dto.LoginRequest;
import com.CNAM.backend.repo.UtilisateurRepo;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UtilisateurRepo utilisateurRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public void login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) throws IOException {
        String email = loginRequest.getEmail();
        String pwd = loginRequest.getPwd();

        Utilisateur utilisateur = utilisateurRepository.findByEmail(email);

        if (utilisateur != null && passwordEncoder.matches(pwd, utilisateur.getPwd())) {
            String token = jwtUtil.generateToken(utilisateur.getEmail());
            response.setContentType("application/json");
            JSONObject jsonResponse = new JSONObject()
                    .put("token", token);
            response.getWriter().write(jsonResponse.toString());
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            JSONObject errorResponse = new JSONObject()
                    .put("error", "Email ou mot de passe incorrect.");
            response.getWriter().write(errorResponse.toString());
        }
    }
}
