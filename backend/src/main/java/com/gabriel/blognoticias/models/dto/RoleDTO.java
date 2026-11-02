package com.gabriel.blognoticias.models.dto;

import java.util.Set;
import java.util.UUID;

public class RoleDTO {
  private UUID id;
  private String nome;
  private String descricao;
  private Set<String> permissions;

  public RoleDTO() {}

  public RoleDTO(UUID id, String nome, String descricao, Set<String> permissions) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
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

  public String getDescricao() {
    return descricao;
  }

  public void setDescricao(String descricao) {
    this.descricao = descricao;
  }

  public Set<String> getPermissions() {
    return permissions;
  }

  public void setPermissions(Set<String> permissions) {
    this.permissions = permissions;
  }
}

