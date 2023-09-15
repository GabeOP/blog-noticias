package com.gabriel.blognoticias.models.dto;

import com.gabriel.blognoticias.models.entities.Post;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class UsuarioDTO {

  private UUID id;
  private String nome;
  private List<Post> postList = new ArrayList<>();

  public UsuarioDTO() {}

  public UsuarioDTO(UUID id, String nome) {
    this.id = id;
    this.nome = nome;
  }

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public String getNome() {
    return nome;
  }

  public void setNome(String nome) {
    this.nome = nome;
  }

  public List<Post> getPostList() {
    return postList;
  }

  public void setPostList(List<Post> postList) {
    this.postList = postList;
  }
}
