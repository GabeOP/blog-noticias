package com.gabriel.blognoticias.models.dto;

import com.gabriel.blognoticias.enums.Cargo;

import java.util.UUID;

public class UsuarioResponseDTO {
  private UUID id;
  private String nome;
  private Cargo cargo = Cargo.COMUM;
  //private List<PostUserDTO> postList = new ArrayList<>();

  public UsuarioResponseDTO() {}

  public UsuarioResponseDTO(UUID id, String nome) {
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

  //public List<PostUserDTO> getPostList() {
//    return postList;
//  }

//  public void setPostList(List<PostUserDTO> postList) {
//    this.postList = postList;
//  }

  public Cargo getCargo() {
    return cargo;
  }

  public void setCargo(Cargo cargo) {
    this.cargo = cargo;
  }
}
