package com.gabriel.blognoticias.services;

import com.gabriel.blognoticias.models.dto.ComentarioDTO;
import com.gabriel.blognoticias.models.entities.Comentario;
import com.gabriel.blognoticias.models.entities.Usuario;
import com.gabriel.blognoticias.models.exception.NaoEncontradoException;
import com.gabriel.blognoticias.repositories.ComentarioRepository;
import org.modelmapper.ModelMapper;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ComentarioService {

  private final ComentarioRepository repository;
  private final ModelMapper modelMapper;

  public ComentarioService(ComentarioRepository repository, ModelMapper modelMapper) {
    this.repository = repository;
    this.modelMapper = modelMapper;
  }

  public List<ComentarioDTO> getAll() {
    return repository.findAll()
            .stream().map(x -> modelMapper.map(x, ComentarioDTO.class)).collect(Collectors.toList());
  }

  public Comentario getById(UUID id) {
    return repository.findById(id)
            .orElseThrow(() -> new NaoEncontradoException("Comentário não encontrado"));
  }

  @Transactional
  public void criarComentario(Comentario comentario) {
    repository.save(comentario);
  }

  @Transactional
  public void excluirComentario(UUID id) {
    Comentario comentario = repository.findById(id)
            .orElseThrow(() -> new NaoEncontradoException("Comentário não encontrado"));

    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
      throw new AccessDeniedException("Usuário não autenticado.");
    }

    Usuario usuarioAtual = (Usuario) auth.getPrincipal();

    boolean isAutor = comentario.getAutorComentario() != null && (
        (comentario.getAutorComentario().getId() != null && comentario.getAutorComentario().getId().equals(usuarioAtual.getId())) ||
        (comentario.getAutorComentario().getNome() != null && comentario.getAutorComentario().getNome().equalsIgnoreCase(usuarioAtual.getNome()))
    );

    boolean isModerador = auth.getAuthorities().stream()
        .anyMatch(a -> "COMMENT_DELETE".equals(a.getAuthority()) || "ROLE_ADMIN".equals(a.getAuthority()));

    if (!isAutor && !isModerador) {
      throw new AccessDeniedException("Você só tem permissão para excluir seus próprios comentários.");
    }

    repository.delete(comentario);
  }
}
