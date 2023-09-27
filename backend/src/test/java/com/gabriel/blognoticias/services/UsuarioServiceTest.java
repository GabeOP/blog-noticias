package com.gabriel.blognoticias.services;

import com.gabriel.blognoticias.enums.Cargo;
import com.gabriel.blognoticias.models.dto.UsuarioDTO;
import com.gabriel.blognoticias.models.dto.UsuarioResponseDTO;
import com.gabriel.blognoticias.models.entities.Usuario;
import com.gabriel.blognoticias.repositories.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.modelmapper.ModelMapper;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(SpringExtension.class)
public class UsuarioServiceTest {
  public static final UUID ID = UUID.randomUUID();
  public static final String NOME = "Gabriel";
  public static final String SENHA = "123";

  @InjectMocks
  UsuarioService service;

  @Mock
  UsuarioRepository repository;

  @Mock
  ModelMapper modelMapper;

  private Usuario usuario;
  private UsuarioDTO usuarioDTO;
  private UsuarioResponseDTO usuarioResponseDTO;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    startUsuario();
  }

  @Test
  void whenGetAllThenReturnListOfUsuarioResponseDTO() {
    when(repository.findAll()).thenReturn(List.of(usuario));
    when(modelMapper.map(any(), any())).thenReturn(usuarioResponseDTO);

    List<UsuarioResponseDTO> response = service.getAll();

    assertEquals(response.size(),1);

    assertEquals(response.get(0).getClass(), UsuarioResponseDTO.class);
    assertEquals(response.get(0).getNome(), NOME);
    assertEquals(response.get(0).getCargo(), Cargo.COMUM);
  }

  @Test
  void whenFindByNomeThenReturnUsuarioDTO() {
    when(repository.findByNome(any())).thenReturn(usuario);
    when(modelMapper.map(any(), any())).thenReturn(usuarioDTO);

    UsuarioDTO response = service.findByNome(any());

    assertEquals(response.getClass(), UsuarioDTO.class);
    assertEquals(response.getNome(), NOME);
    assertEquals(response.getCargo(), Cargo.COMUM);
  }


  private void startUsuario() {
    usuario = new Usuario(ID, NOME, SENHA);
    usuarioDTO = new UsuarioDTO(ID, NOME, SENHA);
    usuarioResponseDTO = new UsuarioResponseDTO(ID, NOME);

    repository.save(usuario);
  }
}
