package com.gabriel.blognoticias.controllers;

import com.gabriel.blognoticias.configs.security.TokenService;
import com.gabriel.blognoticias.models.dto.LoginResponseDTO;
import com.gabriel.blognoticias.models.dto.UsuarioDTO;
import com.gabriel.blognoticias.models.dto.UsuarioResponseDTO;
import com.gabriel.blognoticias.models.entities.Usuario;
import com.gabriel.blognoticias.services.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuario")
@CrossOrigin(origins = "http://127.0.0.1:5500/")
public class UsuarioController {

  private UsuarioService service;
  private AuthenticationManager authenticationManager;
  private TokenService tokenService;

  public UsuarioController(UsuarioService service, AuthenticationManager authenticationManager, TokenService tokenService) {
    this.service = service;
    this.authenticationManager = authenticationManager;
    this.tokenService = tokenService;
  }

  @GetMapping
  public ResponseEntity<List<UsuarioResponseDTO>> getAll() {
    List<UsuarioResponseDTO> response = service.getAll();
    return ResponseEntity.status(HttpStatus.OK).body(response);
  }

  @GetMapping("/{nome}")
  public ResponseEntity<UsuarioResponseDTO> getByNome(@PathVariable String nome) {
    UsuarioResponseDTO response = service.findByNome(nome);
    return ResponseEntity.status(HttpStatus.OK).body(response);
  }

  @PostMapping
  public ResponseEntity<String> criaUsuario(@RequestBody UsuarioDTO usuario) {
    String response = service.criaUsuario(usuario);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @PatchMapping
  public ResponseEntity editaCargoUsuario(@RequestBody UsuarioDTO usuario) {
    service.editaCargoUsuario(usuario);
    return ResponseEntity.status(HttpStatus.OK).body("Sucesso.");
  }

  @PostMapping("/login")
  public ResponseEntity login(@RequestBody UsuarioDTO data) {
    var senhaDoUsuario = new UsernamePasswordAuthenticationToken(data.getNome(), data.getSenha());
    var auth = this.authenticationManager.authenticate(senhaDoUsuario);
    var token = tokenService.generateToken((Usuario)auth.getPrincipal());

    ResponseEntity<UsuarioResponseDTO> dto = this.getByNome(data.getNome());

    return ResponseEntity.ok().body(new LoginResponseDTO(
            token,
            dto.getBody().getId(),
            dto.getBody().getNome(),
            dto.getBody().getCargo()));
  }

  @PostMapping("/auth")
  public ResponseEntity auth(@RequestHeader(value = "Authorization") String token) {
    tokenService.validateToken(token);
    return ResponseEntity.ok().build();
  }
}
