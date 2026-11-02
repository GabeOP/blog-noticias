package com.gabriel.blognoticias.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gabriel.blognoticias.enums.Cargo;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

@Entity
@Table(name = "usuario")
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

  @Enumerated(EnumType.ORDINAL)
  private Cargo cargo = Cargo.COMUM;

  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(
      name = "usuario_roles",
      joinColumns = @JoinColumn(name = "usuario_id"),
      inverseJoinColumns = @JoinColumn(name = "role_id")
  )
  private Set<Role> roles = new HashSet<>();

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
    if (roles != null && roles.stream().anyMatch(r -> "ROLE_ADMIN".equals(r.getNome()))) {
      return Cargo.ADM;
    }
    return cargo != null ? cargo : Cargo.COMUM;
  }

  public void setCargo(Cargo cargo) {
    this.cargo = cargo;
  }

  public Set<Role> getRoles() {
    return roles;
  }

  public void setRoles(Set<Role> roles) {
    this.roles = roles;
  }

  public void addRole(Role role) {
    this.roles.add(role);
  }

  public List<Comentario> getComentarioList() {
    return comentarioList;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    Set<GrantedAuthority> authorities = new HashSet<>();

    if (this.roles != null && !this.roles.isEmpty()) {
      for (Role role : this.roles) {
        authorities.add(new SimpleGrantedAuthority(role.getNome()));
        if (role.getPermissions() != null) {
          for (Permission permission : role.getPermissions()) {
            authorities.add(new SimpleGrantedAuthority(permission.getNome()));
          }
        }
      }
    } else {
      // Fallback para cargos legados caso as roles ainda estejam sendo sincronizadas
      if (this.cargo == Cargo.ADM) {
        authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
      } else {
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
      }
    }

    return authorities;
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
