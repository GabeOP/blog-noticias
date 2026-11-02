package com.gabriel.blognoticias.models.dto;

import java.util.Set;

public class UsuarioRolesUpdateDTO {
  private Set<String> roles;

  public UsuarioRolesUpdateDTO() {}

  public UsuarioRolesUpdateDTO(Set<String> roles) {
    this.roles = roles;
  }

  public Set<String> getRoles() {
    return roles;
  }

  public void setRoles(Set<String> roles) {
    this.roles = roles;
  }
}

