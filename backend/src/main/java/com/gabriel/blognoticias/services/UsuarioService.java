package com.gabriel.blognoticias.services;

import com.gabriel.blognoticias.models.dto.UsuarioDTO;
import com.gabriel.blognoticias.models.dto.UsuarioResponseDTO;
import com.gabriel.blognoticias.models.entities.Usuario;
import com.gabriel.blognoticias.models.exception.JaCadastradoException;
import com.gabriel.blognoticias.models.exception.NaoEncontradoException;
import com.gabriel.blognoticias.repositories.UsuarioRepository;
import com.gabriel.blognoticias.email.services.EmailService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
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

  @Autowired
  private EmailService emailService;

  public UsuarioService(UsuarioRepository repository, ModelMapper modelMapper, EmailService emailService) {
    this.repository = repository;
    this.modelMapper = modelMapper;
    this.emailService = emailService;
  }

  public List<UsuarioResponseDTO> getAll() {
    List<UsuarioResponseDTO> response = repository.findAll()
            .stream().map(x -> modelMapper.map(x, UsuarioResponseDTO.class)).collect(Collectors.toList());
    return response;
  }

  public UsuarioResponseDTO findByNome(String nome) {
    UserDetails response = repository.findByNome(nome);

    if(response == null) {
      throw new NaoEncontradoException("Usuário não encontrado");
    }

    return modelMapper.map(response, UsuarioResponseDTO.class);
  }

  public String criaUsuario(UsuarioDTO usuariodto) {
    try {
      usuariodto.setSenha(new BCryptPasswordEncoder().encode(usuariodto.getSenha()));
      repository.save(modelMapper.map(usuariodto, Usuario.class));

      emailService.enviarEmail(usuariodto.getNome(), usuariodto.getEmail());
      return "Usuário cadastrado com sucesso";
    }catch(DataIntegrityViolationException ex) {
      throw new JaCadastradoException(ex.getMessage());
    }
  }

  public void editaCargoUsuario(UsuarioDTO usuario) {
    Usuario response = (Usuario) repository.findByNome(usuario.getNome());

    response.setCargo(usuario.getCargo());

    repository.save(response);
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    return repository.findByNome(username);
  }
}
