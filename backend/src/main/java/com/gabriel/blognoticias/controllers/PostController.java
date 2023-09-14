package com.gabriel.blognoticias.controllers;

import com.gabriel.blognoticias.models.entities.Post;
import com.gabriel.blognoticias.services.PostService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/post")
public class PostController {

  private PostService service;

  public PostController(PostService service) {
    this.service = service;
  }

  @GetMapping
  public ResponseEntity<List<Post>> getAll() {
    List<Post> response = service.getAll();
    return ResponseEntity.status(HttpStatus.OK).body(response);
  }

  @PostMapping
  public ResponseEntity<String> criarPost(@RequestBody Post post) {
    service.criarPost(post);
    return ResponseEntity.status(HttpStatus.CREATED).body("Postagem criada");
  }
}
