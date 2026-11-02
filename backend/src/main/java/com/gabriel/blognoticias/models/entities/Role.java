package com.gabriel.blognoticias.models.entities;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "role")
public class Role {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(unique = true, nullable = false)
  private String nome;

  private String descricao;

  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(
      name = "role_permissions",
      joinColumns = @JoinColumn(name = "role_id"),
      inverseJoinColumns = @JoinColumn(name = "permission_id")
  )
  private Set<Permission> permissions = new HashSet<>();

  public Role() {}

  public Role(String nome, String descricao) {
    this.nome = nome;
    this.descricao = descricao;
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

  public Set<Permission> getPermissions() {
    return permissions;
  }

  public void setPermissions(Set<Permission> permissions) {
    this.permissions = permissions;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    Role role = (Role) o;
    return Objects.equals(nome, role.nome);
  }

  @Override
  public int hashCode() {
    return Objects.hash(nome);
  }
}

