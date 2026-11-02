package com.gabriel.blognoticias.models.entities;

import jakarta.persistence.*;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "permission")
public class Permission {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(unique = true, nullable = false)
  private String nome;

  private String descricao;

  public Permission() {}

  public Permission(String nome, String descricao) {
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

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    Permission that = (Permission) o;
    return Objects.equals(nome, that.nome);
  }

  @Override
  public int hashCode() {
    return Objects.hash(nome);
  }
}

