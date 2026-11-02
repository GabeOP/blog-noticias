package com.gabriel.blognoticias.controllers;

import com.gabriel.blognoticias.configs.security.TokenService;
import com.gabriel.blognoticias.models.dto.UsuarioAuthDTO;
import com.gabriel.blognoticias.models.dto.UsuarioDTO;
import com.gabriel.blognoticias.models.dto.UsuarioResponseDTO;
import com.gabriel.blognoticias.models.dto.UsuarioRolesUpdateDTO;
import com.gabriel.blognoticias.models.entities.Permission;
import com.gabriel.blognoticias.models.entities.Role;
import com.gabriel.blognoticias.models.entities.Usuario;
import com.gabriel.blognoticias.services.RabbitMQService;
import com.gabriel.blognoticias.services.UsuarioService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {

  private final UsuarioService service;
  private final AuthenticationManager authenticationManager;
  private final TokenService tokenService;

  @Autowired
  private RabbitMQService rabbitMQService;

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
    this.rabbitMQService.enviaMensagem("EMAIL", usuario);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @PatchMapping
  public ResponseEntity editaCargoUsuario(@RequestBody UsuarioDTO usuario) {
    service.editaCargoUsuario(usuario);
    return ResponseEntity.status(HttpStatus.OK).body("Sucesso.");
  }

  @PutMapping("/{id}/roles")
  public ResponseEntity<UsuarioResponseDTO> updateRoles(
      @PathVariable UUID id,
      @RequestBody UsuarioRolesUpdateDTO dto) {
    UsuarioResponseDTO response = service.updateUserRoles(id, dto.getRoles());
    return ResponseEntity.ok(response);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteUsuario(@PathVariable UUID id) {
    service.deleteUsuario(id);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/login")
  public ResponseEntity<UsuarioAuthDTO> login(@RequestBody UsuarioDTO data, HttpServletResponse response) {
    var authenticationToken = new UsernamePasswordAuthenticationToken(data.getNome(), data.getSenha());
    Authentication auth = this.authenticationManager.authenticate(authenticationToken);
    Usuario usuario = (Usuario) auth.getPrincipal();

    String token = tokenService.generateToken(usuario);

    // Injeta HttpOnly Cookie com o token JWT
    ResponseCookie cookie = ResponseCookie.from("token", token)
            .httpOnly(true)
            .secure(false) // HTTP localmente (em prod HTTPS pode ser true)
            .path("/")
            .maxAge(Duration.ofHours(2))
            .sameSite("Lax")
            .build();
    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

    UsuarioAuthDTO authDTO = buildUsuarioAuthDTO(usuario);
    return ResponseEntity.ok().body(authDTO);
  }

  @GetMapping("/me")
  public ResponseEntity<UsuarioAuthDTO> getCurrentUser() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    Usuario usuario = (Usuario) auth.getPrincipal();
    return ResponseEntity.ok().body(buildUsuarioAuthDTO(usuario));
  }

  @PostMapping("/logout")
  public ResponseEntity<String> logout(HttpServletResponse response) {
    ResponseCookie cookie = ResponseCookie.from("token", "")
            .httpOnly(true)
            .secure(false)
            .path("/")
            .maxAge(0)
            .sameSite("Lax")
            .build();
    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    return ResponseEntity.ok().body("Logout realizado com sucesso");
  }

  private UsuarioAuthDTO buildUsuarioAuthDTO(Usuario usuario) {
    Set<String> roles = usuario.getRoles() != null
            ? usuario.getRoles().stream().map(Role::getNome).collect(Collectors.toSet())
            : Collections.emptySet();

    Set<String> permissions = usuario.getRoles() != null
            ? usuario.getRoles().stream()
                .filter(r -> r.getPermissions() != null)
                .flatMap(r -> r.getPermissions().stream())
                .map(Permission::getNome)
                .collect(Collectors.toSet())
            : Collections.emptySet();

    return new UsuarioAuthDTO(usuario.getId(), usuario.getNome(), usuario.getEmail(), roles, permissions);
  }
}
