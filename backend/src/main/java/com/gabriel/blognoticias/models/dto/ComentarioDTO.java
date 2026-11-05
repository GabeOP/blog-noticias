package com.gabriel.blognoticias.models.dto;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

public class ComentarioDTO {
  private UUID id;
  private UsuarioResponseDTO autorComentario;
  private String comentario;
  private LocalDateTime dataComentario = LocalDateTime.now();
  private int upCount;
  private Set<UUID> upvotes = new HashSet<>();

  public ComentarioDTO(){}

  public ComentarioDTO(UUID id, UsuarioResponseDTO autorComentario, String comentario, LocalDateTime dataComentario) {
    this.id = id;
    this.autorComentario = autorComentario;
    this.comentario = comentario;
    this.dataComentario = dataComentario;
  }

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public UsuarioResponseDTO getAutorComentario() {
    return autorComentario;
  }

  public void setAutorComentario(UsuarioResponseDTO autorComentario) {
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

  public int getUpCount() {
    return upCount;
  }

  public void setUpCount(int upCount) {
    this.upCount = upCount;
  }

  public Set<UUID> getUpvotes() {
    if (this.upvotes == null) {
      this.upvotes = new HashSet<>();
    }
    return upvotes;
  }

  public void setUpvotes(Set<UUID> upvotes) {
    this.upvotes = upvotes != null ? upvotes : new HashSet<>();
    this.upCount = this.upvotes.size();
  }
}
