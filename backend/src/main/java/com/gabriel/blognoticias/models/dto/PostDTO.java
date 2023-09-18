package com.gabriel.blognoticias.models.dto;

import com.gabriel.blognoticias.models.entities.Usuario;

import java.util.UUID;

public class PostDTO {
  private UUID id;
  private String titulo;
  private String conteudo;
  private String linkImagem;
  private Usuario autor;

  public PostDTO() {}

  public PostDTO(UUID id, String titulo, String conteudo, String linkImagem, Usuario autor) {
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

  public void setAutor(Usuario autor) {
    this.autor = autor;
  }
}
