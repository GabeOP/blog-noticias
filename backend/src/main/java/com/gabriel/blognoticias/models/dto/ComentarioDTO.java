package com.gabriel.blognoticias.models.dto;

import com.gabriel.blognoticias.models.entities.Post;
import com.gabriel.blognoticias.models.entities.Usuario;

import java.util.Date;
import java.util.UUID;

public class ComentarioDTO {
  private UUID id;
  private Post postagem_id;
  private Usuario autorComentario;
  private String comentario;
  private Date dataComentario;

  public ComentarioDTO(){}

  public ComentarioDTO(UUID id, Post postagem_id, Usuario autorComentario, String comentario, Date dataComentario) {
    this.id = id;
    this.postagem_id = postagem_id;
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

  public Date getDataComentario() {
    return dataComentario;
  }

  public void setDataComentario(Date dataComentario) {
    this.dataComentario = dataComentario;
  }
}
