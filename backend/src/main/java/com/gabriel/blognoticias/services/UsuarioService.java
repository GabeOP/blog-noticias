package com.gabriel.blognoticias.services;

import com.gabriel.blognoticias.models.dto.UsuarioDTO;
import com.gabriel.blognoticias.models.entities.Usuario;
import com.gabriel.blognoticias.repositories.UsuarioRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

  private UsuarioRepository repository;
  private ModelMapper modelMapper;

  public UsuarioService(UsuarioRepository repository, ModelMapper modelMapper) {
    this.repository = repository;
    this.modelMapper = modelMapper;
  }

  public List<UsuarioDTO> getAll() {
    List<UsuarioDTO> response = repository.findAll()
            .stream().map(x -> modelMapper.map(x, UsuarioDTO.class)).collect(Collectors.toList());
    return response;
  }

  public UsuarioDTO findByNome(String nome) {
    Usuario response = repository.findByNome(nome);
    return modelMapper.map(response, UsuarioDTO.class);
  }

  public void criaUsuario(Usuario usuario) {
    repository.save(usuario);
  }


}
