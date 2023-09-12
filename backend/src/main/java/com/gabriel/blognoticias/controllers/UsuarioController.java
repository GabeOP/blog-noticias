package com.gabriel.blognoticias.controllers;

import com.gabriel.blognoticias.models.entities.Usuario;
import com.gabriel.blognoticias.services.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {

  private UsuarioService service;

  public UsuarioController(UsuarioService service) {
    this.service = service;
  }

  @PostMapping
  public ResponseEntity<String> criaUsuario(@RequestBody Usuario usuario) {
    service.criaUsuario(usuario);
    return ResponseEntity.status(HttpStatus.CREATED).body("Usuário criado.");
  }
}
