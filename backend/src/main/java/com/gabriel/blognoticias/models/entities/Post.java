package com.gabriel.blognoticias.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
public class Post {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @NotBlank
  @Lob
  private String titulo;

  @NotBlank
  @Lob
  private String conteudo;

  @NotBlank
  private String linkImagem;

  @ManyToOne
  @JoinColumn(name = "usuario_id", nullable = false)
  private Usuario autor;

  @OneToMany(mappedBy = "postagem_id")
  @JsonIgnore
  private List<Comentario> comentarioList = new ArrayList<>();

  public Post() {}

  public Post(UUID id, String titulo, String conteudo, String linkImagem, Usuario autor, List<Comentario> comentarioList) {
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

  public Usuario getAutor() {
    return autor;
  }

  public void setAutor(Usuario autor) {
    this.autor = autor;
  }

  public List<Comentario> getComentarioList() {
    return comentarioList;
  }

  public void setComentarioList(List<Comentario> comentarioList) {
    this.comentarioList = comentarioList;
  }
}
