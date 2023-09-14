package com.gabriel.blognoticias.services;

import com.gabriel.blognoticias.models.entities.Usuario;
import com.gabriel.blognoticias.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

  private UsuarioRepository repository;

  public UsuarioService(UsuarioRepository repository) {
    this.repository = repository;
  }

  public List<Usuario> getAll() {
    return repository.findAll();
  }

  public Usuario findByNome(String nome) {
    return repository.findByNome(nome);
  }

  public void criaUsuario(Usuario usuario) {
    repository.save(usuario);
  }


}
