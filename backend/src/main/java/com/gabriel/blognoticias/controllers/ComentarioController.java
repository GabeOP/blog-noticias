package com.gabriel.blognoticias.controllers;

import com.gabriel.blognoticias.models.dto.ComentarioDTO;
import com.gabriel.blognoticias.models.entities.Comentario;
import com.gabriel.blognoticias.services.ComentarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/comentario")
@CrossOrigin(origins = "http://127.0.0.1:5500/")
public class ComentarioController {

  @Autowired
  private ComentarioService service;

  @CrossOrigin(origins = "*")
  @GetMapping
  public ResponseEntity<List<ComentarioDTO>> getAll() {
    List<ComentarioDTO> response = service.getAll();
    return ResponseEntity.status(HttpStatus.OK).body(response);
  }

  @CrossOrigin(origins = "*")
  @GetMapping("/{id}")
  public ResponseEntity<Comentario> getById(@PathVariable UUID id) {
    Comentario response = service.getById(id);
    return ResponseEntity.status(HttpStatus.OK).body(response);
  }

  @CrossOrigin(origins = "*")
  @PostMapping
  public ResponseEntity<String> criarComentario(@RequestBody Comentario comentario) {
    service.criarComentario(comentario);
    return ResponseEntity.status(HttpStatus.CREATED).body("Comentário criado com sucesso");
  }
}
