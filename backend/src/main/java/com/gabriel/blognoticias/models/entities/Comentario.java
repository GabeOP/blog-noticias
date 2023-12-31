package com.gabriel.blognoticias.models.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.UUID;

@Entity
public class Comentario {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @JsonBackReference
  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "postagem_id", nullable = false)
  private Post postagem_id;

  @ManyToOne
  @JoinColumn(name = "usuario_id", nullable = false)
  private Usuario autorComentario;

  @NotBlank
  private String comentario;

  @DateTimeFormat(pattern = "dd/MM/yyyy")
  LocalDateTime dataComentario = LocalDateTime.now(ZoneId.of("America/Sao_Paulo"));

  public Comentario() {}

  public Comentario(UUID id, Post postagem_id, Usuario autorComentario, String comentario) {
    this.id = id;
    this.postagem_id = postagem_id;
    this.autorComentario = autorComentario;
    this.comentario = comentario;
  }

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public Post getPostagem_id() {
    return postagem_id;
  }

  public void setPostagem_id(Post postagem_id) {
    this.postagem_id = postagem_id;
  }

  public Usuario getAutorComentario() {
    return autorComentario;
  }

  public void setAutorComentario(Usuario autorComentario) {
    this.autorComentario = autorComentario;
  }

  public String getComentario() {
    return comentario;
  }

  public void setComentario(String comentario) {
    this.comentario = comentario;
  }

  public LocalDateTime getDataComentario() {
    return dataComentario;
  }

  public void setDataComentario(LocalDateTime dataComentario) {
    this.dataComentario = dataComentario;
  }
}