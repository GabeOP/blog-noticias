package com.gabriel.blognoticias.controllers;

import com.gabriel.blognoticias.models.dto.UsuarioDTO;
import com.gabriel.blognoticias.models.entities.Usuario;
import com.gabriel.blognoticias.services.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {

  private UsuarioService service;

  public UsuarioController(UsuarioService service) {
    this.service = service;
  }

  @CrossOrigin(origins = "*")
  @GetMapping
  public ResponseEntity<List<UsuarioDTO>> getAll() {
    List<UsuarioDTO> response = service.getAll();
    return ResponseEntity.status(HttpStatus.OK).body(response);
  }

  @CrossOrigin(origins = "*")
  @GetMapping("/{nome}")
  public ResponseEntity<UsuarioDTO> getByNome(@PathVariable String nome) {
    UsuarioDTO response = service.findByNome(nome);
    return ResponseEntity.status(HttpStatus.OK).body(response);
  }

  @CrossOrigin(origins = "*")
  @PostMapping
  public ResponseEntity<String> criaUsuario(@RequestBody Usuario usuario) {
    service.criaUsuario(usuario);
    return ResponseEntity.status(HttpStatus.CREATED).body("Usuário criado.");
  }
}
