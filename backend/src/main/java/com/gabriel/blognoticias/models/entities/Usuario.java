package com.gabriel.blognoticias.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gabriel.blognoticias.enums.Cargo;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
public class Usuario {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(unique = true)
  private String nome;

  private String senha;

  private Cargo cargo = Cargo.COMUM;

  @OneToMany(mappedBy = "autor")
  @JsonIgnore
  private List<Post> postList = new ArrayList<>();

  public Usuario() {}

  public Usuario(UUID id, String nome, String senha) {
    this.id = id;
    this.nome = nome;
    this.senha = senha;
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

  public String getSenha() {
    return senha;
  }

  public void setSenha(String senha) {
    this.senha = senha;
  }

  public List<Post> getPostList() {
    return postList;
  }

  public Cargo getCargo() {
    return cargo;
  }

  public void setCargo(Cargo cargo) {
    this.cargo = cargo;
  }
}
