package com.gabriel.blognoticias.models.dto;

import com.gabriel.blognoticias.enums.Cargo;

import java.util.UUID;

public class LoginResponseDTO {
  private String token;
  private UUID id;
  private String nome;
  private Cargo cargo;

  public LoginResponseDTO() {}

  public LoginResponseDTO(String token, UUID id, String nome, Cargo cargo) {
    this.token = token;
    this.id = id;
    this.nome = nome;
    this.cargo = cargo;
  }

  public String getToken() {
    return token;
  }

  public void setToken(String token) {
    this.token = token;
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

  public Cargo getCargo() {
    return cargo;
  }

  public void setCargo(Cargo cargo) {
    this.cargo = cargo;
  }
}
