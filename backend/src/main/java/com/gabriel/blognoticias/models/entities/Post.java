package com.gabriel.blognoticias.models.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

@Entity
public class Post {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @NotBlank
  private String titulo;

  @NotBlank
  private String conteudo;

  @NotBlank
  private String linkImagem;

  @ManyToOne
  @JoinColumn(name="usuario_id", nullable = false)
  private Usuario autor;

  public Post() {}

  public Post(UUID id, String titulo, String conteudo, String linkImagem, Usuario autor) {
    this.id = id;
    this.titulo = titulo;
    this.conteudo = conteudo;
    this.linkImagem = linkImagem;
    this.autor = autor;
  }

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public String getTitulo() {
    return titulo;
  }

  public void setTitulo(String titulo) {
    this.titulo = titulo;
  }

  public String getConteudo() {
    return conteudo;
  }

  public void setConteudo(String conteudo) {
    this.conteudo = conteudo;
  }

  public String getLinkImagem() {
    return linkImagem;
  }

  public void setLinkImagem(String linkImagem) {
    this.linkImagem = linkImagem;
  }

  public Usuario getAutor() {
    return autor;
  }
}
