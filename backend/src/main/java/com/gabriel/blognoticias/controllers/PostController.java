package com.gabriel.blognoticias.controllers;

import com.gabriel.blognoticias.models.entities.Post;
import com.gabriel.blognoticias.models.entities.Usuario;
import com.gabriel.blognoticias.services.PostService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/post")
public class PostController {

  private PostService service;

  public PostController(PostService service) {
    this.service = service;
  }

  @PostMapping
  public ResponseEntity<String> criarPost(@RequestBody Post post, @RequestBody Usuario usuario) {
    service.criarPost(post, usuario);
    return ResponseEntity.status(HttpStatus.CREATED).body("Postagem criada");
  }
}
