package com.gabriel.blognoticias.models.dto;

import java.util.List;
import java.util.UUID;

public class PostDetailsDTO {

  private UUID id;
  private String titulo;
  private String conteudo;
  private String linkImagem;
  private UsuarioResponseDTO autor;
  private List<ComentarioDTO> comentarioList;

  public PostDetailsDTO() {}

  public PostDetailsDTO(UUID id, String titulo, String conteudo, String linkImagem, UsuarioResponseDTO autor, List<ComentarioDTO> comentarioList) {
    this.id = id;
    this.titulo = titulo;
    this.conteudo = conteudo;
    this.linkImagem = linkImagem;
    this.autor = autor;
    this.comentarioList = comentarioList;
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

  public UsuarioResponseDTO getAutor() {
    return autor;
  }

  public void setAutor(UsuarioResponseDTO autor) {
    this.autor = autor;
  }

  public List<ComentarioDTO> getComentarioList() {
    return comentarioList;
  }

  public void setComentarioList(List<ComentarioDTO> comentarioList) {
    this.comentarioList = comentarioList;
  }
}
