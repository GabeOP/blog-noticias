package com.gabriel.blognoticias.services;

import com.gabriel.blognoticias.enums.Cargo;
import com.gabriel.blognoticias.models.dto.UsuarioDTO;
import com.gabriel.blognoticias.models.dto.UsuarioResponseDTO;
import com.gabriel.blognoticias.models.entities.Role;
import com.gabriel.blognoticias.models.entities.Usuario;
import com.gabriel.blognoticias.models.exception.JaCadastradoException;
import com.gabriel.blognoticias.models.exception.NaoEncontradoException;
import com.gabriel.blognoticias.repositories.RoleRepository;
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
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UsuarioService implements UserDetailsService {

  private final UsuarioRepository repository;
  private final RoleRepository roleRepository;
  private final ModelMapper modelMapper;

  @Autowired
  private EmailService emailService;

  public UsuarioService(UsuarioRepository repository, RoleRepository roleRepository, ModelMapper modelMapper, EmailService emailService) {
    this.repository = repository;
    this.roleRepository = roleRepository;
    this.modelMapper = modelMapper;
    this.emailService = emailService;
  }

  public List<UsuarioResponseDTO> getAll() {
    return repository.findAll()
            .stream()
            .map(this::toResponseDTO)
            .collect(Collectors.toList());
  }

  public UsuarioResponseDTO findByNome(String nome) {
    UserDetails response = repository.findByNome(nome);

    if(response == null) {
      throw new NaoEncontradoException("Usuário não encontrado");
    }

    return toResponseDTO((Usuario) response);
  }

  public String criaUsuario(UsuarioDTO usuariodto) {
    try {
      usuariodto.setSenha(new BCryptPasswordEncoder().encode(usuariodto.getSenha()));
      Usuario usuario = modelMapper.map(usuariodto, Usuario.class);

      roleRepository.findByNome("ROLE_COMUM").ifPresent(usuario::addRole);

      repository.save(usuario);

      return "Usuário cadastrado com sucesso";
    } catch(DataIntegrityViolationException ex) {
      throw new JaCadastradoException(ex.getMessage());
    }
  }

  public void editaCargoUsuario(UsuarioDTO usuario) {
    Usuario response = (Usuario) repository.findByNome(usuario.getNome());

    response.setCargo(usuario.getCargo());

    if (usuario.getCargo() == Cargo.ADM) {
      roleRepository.findByNome("ROLE_ADMIN").ifPresent(response::addRole);
    } else {
      response.getRoles().removeIf(r -> "ROLE_ADMIN".equals(r.getNome()));
      roleRepository.findByNome("ROLE_COMUM").ifPresent(response::addRole);
    }

    repository.save(response);
  }

  @Transactional
  public UsuarioResponseDTO updateUserRoles(UUID usuarioId, Set<String> roleNames) {
    Usuario usuario = repository.findById(usuarioId)
        .orElseThrow(() -> new NaoEncontradoException("Usuário não encontrado"));

    Set<Role> newRoles = new HashSet<>();
    if (roleNames != null) {
      for (String rName : roleNames) {
        roleRepository.findByNome(rName).ifPresent(newRoles::add);
      }
    }

    usuario.setRoles(newRoles);

    // Sincroniza cargo legado
    if (newRoles.stream().anyMatch(r -> "ROLE_ADMIN".equalsIgnoreCase(r.getNome()))) {
      usuario.setCargo(Cargo.ADM);
    } else {
      usuario.setCargo(Cargo.COMUM);
    }

    Usuario saved = repository.save(usuario);
    return toResponseDTO(saved);
  }

  @Transactional
  public void deleteUsuario(UUID usuarioId) {
    Usuario usuario = repository.findById(usuarioId)
        .orElseThrow(() -> new NaoEncontradoException("Usuário não encontrado"));

    if ("adm".equalsIgnoreCase(usuario.getNome())) {
      throw new IllegalArgumentException("O usuário administrador principal não pode ser excluído.");
    }

    repository.delete(usuario);
  }

  private UsuarioResponseDTO toResponseDTO(Usuario u) {
    Set<String> roles = u.getRoles() != null
        ? u.getRoles().stream().map(Role::getNome).collect(Collectors.toSet())
        : Collections.emptySet();

    return new UsuarioResponseDTO(u.getId(), u.getNome(), u.getEmail(), u.getCargo(), roles);
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    return repository.findByNome(username);
  }
}
