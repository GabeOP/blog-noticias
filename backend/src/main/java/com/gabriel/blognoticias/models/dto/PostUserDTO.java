package com.gabriel.blognoticias.models.dto;

import java.util.UUID;

/*
  Esse DTO é o que é mostrado ao realizar uma requisição GET em Usuario.
  Foi feito para evitar que fosse mostrado o autor em loop
*/
public class PostUserDTO {
  private UUID id;
  private String titulo;
  private String conteudo;
  private String linkImagem;

  public PostUserDTO() {}

  public PostUserDTO(UUID id, String titulo, String conteudo, String linkImagem) {
    this.id = id;
    this.titulo = titulo;
    this.conteudo = conteudo;
    this.linkImagem = linkImagem;
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

}
