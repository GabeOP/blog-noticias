package com.gabriel.blognoticias.controllers;

import com.gabriel.blognoticias.models.dto.PostDTO;
import com.gabriel.blognoticias.models.entities.Post;
import com.gabriel.blognoticias.services.PostService;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/post")
@CrossOrigin(origins = "*")
public class PostController {

  private PostService service;
  private ModelMapper modelMapper;

  public PostController(PostService service) {
    this.service = service;
  }

  @GetMapping
  public ResponseEntity<List<PostDTO>> getAll(Pageable pageable) {
    Page<PostDTO> response = service.getAll(pageable);
    return ResponseEntity.status(HttpStatus.OK).body(response.getContent());
  }

  @GetMapping("/{id}")
  public ResponseEntity<Post> getById(@PathVariable UUID id) {
    Post response = service.getById(id);
    return ResponseEntity.status(HttpStatus.OK).body(response);
  }

  @PostMapping
  public ResponseEntity<String> criarPost(@RequestBody PostDTO post) {
    service.criarPost(post);
    return ResponseEntity.status(HttpStatus.CREATED).body("Postagem criada");
  }
}
