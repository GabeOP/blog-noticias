package com.gabriel.blognoticias.models.dto;

import java.util.Date;
import java.util.UUID;

public class ComentarioDTO {
  private UUID id;
  private UsuarioResponseDTO autorComentario;
  private String comentario;
  private Date dataComentario;

  public ComentarioDTO(){}

  public ComentarioDTO(UUID id, PostDTO postagem_id, UsuarioResponseDTO autorComentario, String comentario, Date dataComentario) {
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

  public Date getDataComentario() {
    return dataComentario;
  }

  public void setDataComentario(Date dataComentario) {
    this.dataComentario = dataComentario;
  }
}
