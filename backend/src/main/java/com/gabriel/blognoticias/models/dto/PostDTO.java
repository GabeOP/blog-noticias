package com.gabriel.blognoticias.models.dto;

import java.util.UUID;

public class PostDTO {
  private UUID id;
  private String titulo;
  private String conteudo;
  private String linkImagem;
  private UsuarioDTO autor;

  public PostDTO() {}

  public PostDTO(UUID id, String titulo, String conteudo, String linkImagem, UsuarioDTO autor) {
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

  public UsuarioDTO getAutor() {
    return autor;
  }

  public void setAutor(UsuarioDTO autor) {
    this.autor = autor;
  }
}
