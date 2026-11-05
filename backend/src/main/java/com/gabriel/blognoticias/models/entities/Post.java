package com.gabriel.blognoticias.models.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
public class Post {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @NotBlank
  @Column(columnDefinition="TEXT")
  private String titulo;

  @NotBlank
  @Column(columnDefinition="TEXT")
  private String conteudo;

  @NotBlank
  private String linkImagem;

  @DateTimeFormat(pattern = "dd/MM/yyyy")
  private LocalDateTime dataPostagem = LocalDateTime.now(ZoneId.of("America/Sao_Paulo"));

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "usuario_id", nullable = false)
  private Usuario autor;

  @JsonManagedReference
  @OneToMany(mappedBy = "postagem_id")
  private List<Comentario> comentarioList = new ArrayList<>();

  @ElementCollection(fetch = FetchType.EAGER)
  @CollectionTable(name = "post_upvotes", joinColumns = @JoinColumn(name = "post_id"))
  @Column(name = "usuario_id")
  private Set<UUID> upvotes = new HashSet<>();

  public Post() {}

  public Post(UUID id, String titulo, String conteudo, String linkImagem, Usuario autor) {
    this.id = id;
    this.titulo = titulo;
    this.conteudo = conteudo;
    this.linkImagem = linkImagem;
    this.autor = autor;
  }

  @PrePersist
  public void prePersist() {
    if (this.dataPostagem == null) {
      this.dataPostagem = LocalDateTime.now(ZoneId.of("America/Sao_Paulo"));
    }
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

  public LocalDateTime getDataPostagem() {
    return dataPostagem;
  }

  public void setDataPostagem(LocalDateTime dataPostagem) {
    this.dataPostagem = dataPostagem;
  }

  public Set<UUID> getUpvotes() {
    if (this.upvotes == null) {
      this.upvotes = new HashSet<>();
    }
    return upvotes;
  }

  public void setUpvotes(Set<UUID> upvotes) {
    this.upvotes = upvotes != null ? upvotes : new HashSet<>();
  }

  public int getUpCount() {
    return this.upvotes != null ? this.upvotes.size() : 0;
  }
}
