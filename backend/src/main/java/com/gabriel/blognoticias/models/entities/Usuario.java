package com.gabriel.blognoticias.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gabriel.blognoticias.enums.Cargo;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
  public class Usuario implements UserDetails {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @NotBlank
  @Column(unique = true)
  private String nome;

  @NotBlank
  @Column(unique = true)
  private String email;

  @NotBlank
  private String senha;

  private Cargo cargo = Cargo.COMUM;

  @OneToMany(mappedBy = "autor")
  @JsonIgnore
  private List<Post> postList = new ArrayList<>();

  @OneToMany(mappedBy = "autorComentario")
  @JsonIgnore
  private List<Comentario> comentarioList = new ArrayList<>();

  public Usuario() {}

  public Usuario(UUID id, String nome, String senha, String email) {
    this.id = id;
    this.nome = nome;
    this.senha = senha;
    this.email = email;
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

  public List<Comentario> getComentarioList() {
    return comentarioList;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    if(this.cargo == Cargo.ADM) return List.of(new SimpleGrantedAuthority("ROLE_ADMIN"), new SimpleGrantedAuthority("ROLE_USER"));
    else return List.of(new SimpleGrantedAuthority("ROLE_USER"));
  }

  @Override
  public String getPassword() {
    return senha;
  }

  @Override
  public String getUsername() {
    return nome;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }
}
