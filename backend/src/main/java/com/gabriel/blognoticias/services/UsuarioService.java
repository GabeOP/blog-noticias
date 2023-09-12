package com.gabriel.blognoticias.services;

import com.gabriel.blognoticias.models.entities.Usuario;
import com.gabriel.blognoticias.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

  private UsuarioRepository repository;

  public UsuarioService(UsuarioRepository repository) {
    this.repository = repository;
  }

  public void criaUsuario(Usuario usuario) {
    repository.save(usuario);
  }
}
