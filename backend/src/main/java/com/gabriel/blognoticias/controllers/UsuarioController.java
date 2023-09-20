package com.gabriel.blognoticias.controllers;

import com.gabriel.blognoticias.models.dto.UsuarioDTO;
import com.gabriel.blognoticias.services.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {

  private UsuarioService service;
  private AuthenticationManager authenticationManager;

  public UsuarioController(UsuarioService service, AuthenticationManager authenticationManager) {
    this.service = service;
    this.authenticationManager = authenticationManager;
  }

  @CrossOrigin(origins = "*")
  @GetMapping
  public ResponseEntity<List<UsuarioDTO>> getAll() {
    List<UsuarioDTO> response = service.getAll();
    return ResponseEntity.status(HttpStatus.OK).body(response);
  }

//  @CrossOrigin(origins = "*")
//  @GetMapping("/{nome}")
//  public ResponseEntity<UsuarioDTO> getByNome(@PathVariable String nome) {
//    UsuarioDTO response = service.findByNome(nome);
//    return ResponseEntity.status(HttpStatus.OK).body(response);
//  }

  @CrossOrigin(origins = "*")
  @PostMapping
  public ResponseEntity<String> criaUsuario(@RequestBody UsuarioDTO usuario) {
    service.criaUsuario(usuario);
    return ResponseEntity.status(HttpStatus.CREATED).body("Usuário criado.");
  }

  @PostMapping("/login")
  public ResponseEntity login(@RequestBody UsuarioDTO data) {
    var senhaDoUsuario = new UsernamePasswordAuthenticationToken(data.getNome(), data.getSenha());
    var auth = this.authenticationManager.authenticate(senhaDoUsuario);

    return ResponseEntity.ok().build();
  }
}
