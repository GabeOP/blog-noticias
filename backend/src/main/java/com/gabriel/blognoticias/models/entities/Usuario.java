package com.gabriel.blognoticias.models.entities;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
public class Usuario {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(unique = true)
  private String nome;

  public Usuario() {}

  public Usuario(UUID id, String nome) {
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
}
