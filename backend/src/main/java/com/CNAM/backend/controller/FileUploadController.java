package com.CNAM.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class FileUploadController {

    Path rapportsDir = Paths.get("uploads/Rapports");
    Path demandesDir = Paths.get("uploads/Demandes");
    @PostMapping("/upload")

    public Map<String, Object> handleFileUpload(@RequestParam("files") MultipartFile[] files, @RequestParam("type") String type) {
        Map<String, Object> response = new HashMap<>();
        List<String> filePaths = new ArrayList<>();

        if (files == null || files.length == 0) {
            response.put("message", "Please select files to upload");
            return response;
        }

        // Parcourez chaque fichier
        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                continue; // Passez au fichier suivant s'il est vide (je crois)
            }

            try {
                byte[] bytes = file.getBytes();
                Path path;
                if (type.equals("Rapports")) {
                    path = Paths.get(rapportsDir.toString(), file.getOriginalFilename());
                } else if (type.equals("Demandes")) {
                    path = Paths.get(demandesDir.toString(), file.getOriginalFilename());
                } else {
                    response.put("message", "Invalid file type");
                    return response;
                }
                Files.write(path, bytes);

                String fileUrl = ServletUriComponentsBuilder.fromCurrentContextPath().path("/uploads/")
                        .path(type)
                        .path("/")
                        .path(file.getOriginalFilename())
                        .toUriString();
                filePaths.add(fileUrl);

                response.put("message", "You successfully uploaded '" + file.getOriginalFilename() + "'");
                response.put("filePath", filePaths);

            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return response;
    }

}