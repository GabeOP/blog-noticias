package com.gabriel.blognoticias.models.dto;

import com.gabriel.blognoticias.enums.Cargo;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

public class UsuarioResponseDTO {
  private UUID id;
  private String nome;
  private String email;
  private Cargo cargo = Cargo.COMUM;
  private Set<String> roles = new HashSet<>();

  public UsuarioResponseDTO() {}

  public UsuarioResponseDTO(UUID id, String nome) {
    this.id = id;
    this.nome = nome;
  }

  public UsuarioResponseDTO(UUID id, String nome, String email, Cargo cargo, Set<String> roles) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.cargo = cargo;
    this.roles = roles;
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

  public Cargo getCargo() {
    return cargo;
  }

  public void setCargo(Cargo cargo) {
    this.cargo = cargo;
  }

  public Set<String> getRoles() {
    return roles;
  }

  public void setRoles(Set<String> roles) {
    this.roles = roles;
  }
}
