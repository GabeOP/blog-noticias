package com.gabriel.blognoticias.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileService {

  private final Path rootLocation;

  public FileService(@Value("${app.upload.dir:uploads}") String uploadDir) {
    this.rootLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
    try {
      Files.createDirectories(this.rootLocation);
    } catch (IOException e) {
      throw new RuntimeException("Não foi possível criar o diretório de uploads.", e);
    }
  }

  public String store(MultipartFile file) {
    if (file == null || file.isEmpty()) {
      throw new IllegalArgumentException("Nenhum arquivo enviado ou arquivo vazio.");
    }

    String contentType = file.getContentType();
    if (contentType == null || !contentType.startsWith("image/")) {
      throw new IllegalArgumentException("Apenas arquivos de imagem são permitidos.");
    }

    String originalFilename = StringUtils.cleanPath(
        file.getOriginalFilename() != null ? file.getOriginalFilename() : "imagem.jpg"
    );

    String extension = "";
    int lastDot = originalFilename.lastIndexOf('.');
    if (lastDot > 0) {
      extension = originalFilename.substring(lastDot).toLowerCase();
    } else {
      extension = ".jpg";
    }

    String uniqueFilename = UUID.randomUUID() + extension;

    try {
      Path destinationFile = this.rootLocation.resolve(uniqueFilename).normalize();

      // Proteção de segurança contra Path Traversal
      if (!destinationFile.getParent().equals(this.rootLocation)) {
        throw new SecurityException("Tentativa de salvar arquivo fora do diretório de destino.");
      }

      try (InputStream inputStream = file.getInputStream()) {
        Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
      }

      return "/uploads/" + uniqueFilename;
    } catch (IOException e) {
      throw new RuntimeException("Falha ao armazenar arquivo.", e);
    }
  }
}

