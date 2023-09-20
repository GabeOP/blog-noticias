package com.gabriel.blognoticias.services;

import com.gabriel.blognoticias.models.dto.UsuarioDTO;
import com.gabriel.blognoticias.models.entities.Usuario;
import com.gabriel.blognoticias.models.exception.JaCadastradoException;
import com.gabriel.blognoticias.repositories.UsuarioRepository;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService implements UserDetailsService {

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

//  public UsuarioDTO findByNome(String nome) {
//    Usuario response = repository.findByNome(nome)
//            .orElseThrow(() -> new NaoEncontradoException("[ERRO] Usuário não encontrado"));
//    return modelMapper.map(response, UsuarioDTO.class);
//  }

  public void criaUsuario(UsuarioDTO usuariodto) {
    try {
      usuariodto.setSenha(new BCryptPasswordEncoder().encode(usuariodto.getSenha()));
      repository.save(modelMapper.map(usuariodto, Usuario.class));
    }catch(DataIntegrityViolationException ex) {
      throw new JaCadastradoException(ex.getMessage());
    }
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    return repository.findByNome(username);
  }
}
