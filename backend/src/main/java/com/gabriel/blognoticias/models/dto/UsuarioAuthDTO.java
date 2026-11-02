package com.gabriel.blognoticias.models.dto;

import java.util.Set;
import java.util.UUID;

public class UsuarioAuthDTO {
  private UUID id;
  private String nome;
  private String email;
  private Set<String> roles;
  private Set<String> permissions;

  public UsuarioAuthDTO() {}

  public UsuarioAuthDTO(UUID id, String nome, String email, Set<String> roles, Set<String> permissions) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.roles = roles;
    this.permissions = permissions;
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

  public Set<String> getRoles() {
    return roles;
  }

  public void setRoles(Set<String> roles) {
    this.roles = roles;
  }

  public Set<String> getPermissions() {
    return permissions;
  }

  public void setPermissions(Set<String> permissions) {
    this.permissions = permissions;
  }
}

