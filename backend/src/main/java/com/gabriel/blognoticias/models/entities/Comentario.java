package com.gabriel.blognoticias.models.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.util.Date;
import java.util.UUID;

@Entity
public class Comentario {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne
  @JoinColumn(name = "postagem_id", nullable = false)
  private Post postagem_id;

  private Usuario autorComentario;

  @NotBlank
  private String comentario;
  private Date dataComentario;


  public Comentario() {}

  public Comentario(UUID id, Post postagem_id, Usuario autorComentario, String comentario, Date dataComentario) {
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