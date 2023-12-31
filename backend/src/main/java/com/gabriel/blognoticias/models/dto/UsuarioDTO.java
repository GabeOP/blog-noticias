package com.gabriel.blognoticias.models.dto;

import com.gabriel.blognoticias.enums.Cargo;
import com.gabriel.blognoticias.models.entities.Post;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class UsuarioDTO implements Serializable {

  private UUID id;
  private String nome;
  private String email;
  private String senha;
  private Cargo cargo = Cargo.COMUM;
  private List<Post> postList = new ArrayList<>();

  public UsuarioDTO() {}

  public UsuarioDTO(UUID id, String nome, String senha, String email) {
    this.id = id;
    this.nome = nome;
    this.senha = senha;
    this.email = email;
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

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  //  public List<Post> getPostList() {
//    return postList;
//  }

  public void setPostList(List<Post> postList) {
    this.postList = postList;
  }

  public String getSenha() {
    return senha;
  }

  public void setSenha(String senha) {
    this.senha = senha;
  }

  public Cargo getCargo() {
    return cargo;
  }

  public void setCargo(Cargo cargo) {
    this.cargo = cargo;
  }
}
