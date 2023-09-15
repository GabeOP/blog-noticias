package com.gabriel.blognoticias.services;

import com.gabriel.blognoticias.models.dto.UsuarioDTO;
import com.gabriel.blognoticias.models.entities.Usuario;
import com.gabriel.blognoticias.repositories.UsuarioRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

  private UsuarioRepository repository;
  private ModelMapper modelMapper;

  public UsuarioService(UsuarioRepository repository, ModelMapper modelMapper) {
    this.repository = repository;
    this.modelMapper = modelMapper;
  }

  public List<Usuario> getAll() {
    return repository.findAll();
  }

  public UsuarioDTO findByNome(String nome) {
    Usuario response = repository.findByNome(nome);
    return modelMapper.map(response, UsuarioDTO.class);
  }

  public void criaUsuario(Usuario usuario) {
    repository.save(usuario);
  }


}
