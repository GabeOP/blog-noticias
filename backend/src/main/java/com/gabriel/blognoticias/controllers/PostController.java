package com.gabriel.blognoticias.controllers;

import com.gabriel.blognoticias.models.dto.PostDTO;
import com.gabriel.blognoticias.models.dto.PostDetailsDTO;
import com.gabriel.blognoticias.services.FileService;
import com.gabriel.blognoticias.services.PostService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/post")
public class PostController {

  private final PostService service;
  private final FileService fileService;

  public PostController(PostService service, FileService fileService) {
    this.service = service;
    this.fileService = fileService;
  }

  @GetMapping
  public ResponseEntity<List<PostDTO>> getAll(Pageable pageable) {
    Page<PostDTO> response = service.getAll(pageable);
    return ResponseEntity.status(HttpStatus.OK).body(response.getContent());
  }

  @GetMapping("/{id}")
  public ResponseEntity<PostDetailsDTO> getById(@PathVariable UUID id) {
    PostDetailsDTO response = service.getById(id);
    return ResponseEntity.status(HttpStatus.OK).body(response);
  }

  @PostMapping
  public ResponseEntity<String> criarPost(@RequestBody PostDTO post) {
    service.criarPost(post);
    return ResponseEntity.status(HttpStatus.CREATED).body("Postagem criada");
  }

  @PostMapping("/upload")
  public ResponseEntity<Map<String, String>> uploadImagem(@RequestParam("file") MultipartFile file) {
    String fileUrl = fileService.store(file);
    return ResponseEntity.status(HttpStatus.CREATED).body(Collections.singletonMap("url", fileUrl));
  }
}
