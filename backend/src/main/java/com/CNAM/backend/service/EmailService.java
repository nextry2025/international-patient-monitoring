package com.CNAM.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.util.Random;


@Service
public class EmailService {


    @Autowired
    private JavaMailSender emailSender;

    public static String generateVerificationCode() {
        Random random = new Random();
        int min = 1000;
        int max = 9999;
        int randomCode = random.nextInt(max - min + 1) + min;
        return String.valueOf(randomCode);
    }


    public String sendVerificationCode(String userEmail) {
        String verificationCode = generateVerificationCode();

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(userEmail);
        message.setSubject("CNAM : code de vérification");
        message.setText("Votre code de vérification est : " + verificationCode);
        emailSender.send(message);
        return (verificationCode);
    }
    public boolean verifyVerificationCode(String correctcode, String enteredCode) {
        return enteredCode.equals(correctcode);
    }
}
