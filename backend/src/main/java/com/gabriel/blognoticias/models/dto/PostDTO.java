package com.gabriel.blognoticias.models.dto;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

public class PostDTO {
  private UUID id;
  private String titulo;
  private String conteudo;
  private String linkImagem;
  private LocalDateTime dataPostagem;
  private UsuarioResponseDTO autor;
  private int upCount;
  private Set<UUID> upvotes = new HashSet<>();

  public PostDTO() {}

  public PostDTO(UUID id, String titulo, String conteudo, String linkImagem, LocalDateTime dataPostagem, UsuarioResponseDTO autor) {
    this.id = id;
    this.titulo = titulo;
    this.conteudo = conteudo;
    this.linkImagem = linkImagem;
    this.dataPostagem = dataPostagem;
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

  public LocalDateTime getDataPostagem() {
    return dataPostagem;
  }

  public void setDataPostagem(LocalDateTime dataPostagem) {
    this.dataPostagem = dataPostagem;
  }

  public UsuarioResponseDTO getAutor() {
    return autor;
  }

  public void setAutor(UsuarioResponseDTO autor) {
    this.autor = autor;
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
