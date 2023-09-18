package com.gabriel.blognoticias.controllers;

import com.gabriel.blognoticias.models.dto.PostDTO;
import com.gabriel.blognoticias.services.PostService;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/post")
public class PostController {

  private PostService service;
  private ModelMapper modelMapper;

  public PostController(PostService service) {
    this.service = service;
  }

  @CrossOrigin(origins = "*")
  @GetMapping
  public ResponseEntity<List<PostDTO>> getAll() {
    List<PostDTO> response = service.getAll();
    return ResponseEntity.status(HttpStatus.OK).body(response);
  }

  @CrossOrigin(origins = "*")
  @PostMapping
  public ResponseEntity<String> criarPost(@RequestBody PostDTO post) {
    service.criarPost(post);
    return ResponseEntity.status(HttpStatus.CREATED).body("Postagem criada");
  }
}
