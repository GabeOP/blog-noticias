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

import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

  @Transactional(readOnly = true)
  public List<ComentarioDTO> getAll() {
    return repository.findAll()
        .stream()
        .map(x -> {
          ComentarioDTO dto = modelMapper.map(x, ComentarioDTO.class);
          dto.setUpvotes(x.getUpvotes());
          dto.setUpCount(x.getUpCount());
          return dto;
        })
        .sorted((c1, c2) -> {
          int cmp = Integer.compare(c2.getUpCount(), c1.getUpCount());
          if (cmp != 0) return cmp;
          if (c2.getDataComentario() != null && c1.getDataComentario() != null) {
            return c2.getDataComentario().compareTo(c1.getDataComentario());
          }
          return 0;
        })
        .collect(Collectors.toList());
  }

  @Transactional(readOnly = true)
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

  @Transactional
  public Map<String, Object> toggleUpvote(UUID id) {
    Comentario comentario = repository.findById(id)
        .orElseThrow(() -> new NaoEncontradoException("Comentário não encontrado"));

    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
      throw new AccessDeniedException("Usuário não autenticado.");
    }

    Usuario usuarioAtual = (Usuario) auth.getPrincipal();
    UUID usuarioId = usuarioAtual.getId();

    boolean upvoted;
    if (comentario.getUpvotes().contains(usuarioId)) {
      comentario.getUpvotes().remove(usuarioId);
      upvoted = false;
    } else {
      comentario.getUpvotes().add(usuarioId);
      upvoted = true;
    }

    repository.save(comentario);

    Map<String, Object> response = new HashMap<>();
    response.put("upCount", comentario.getUpCount());
    response.put("upvoted", upvoted);
    return response;
  }
}
