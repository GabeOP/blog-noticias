package com.gabriel.blognoticias.services;

import com.gabriel.blognoticias.models.dto.ComentarioDTO;
import com.gabriel.blognoticias.models.dto.PostDTO;
import com.gabriel.blognoticias.models.dto.PostDetailsDTO;
import com.gabriel.blognoticias.models.entities.Post;
import com.gabriel.blognoticias.models.entities.Usuario;
import com.gabriel.blognoticias.models.exception.CampoNaoPreenchidoException;
import com.gabriel.blognoticias.models.exception.NaoEncontradoException;
import com.gabriel.blognoticias.repositories.PostRepository;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.TransactionSystemException;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PostService {

  private final PostRepository repository;
  private final ModelMapper modelMapper;

  public PostService(PostRepository repository, ModelMapper modelMapper) {
    this.repository = repository;
    this.modelMapper = modelMapper;
  }

  @Transactional(readOnly = true)
  public Page<PostDTO> getAll(Pageable pageable) {
    return getAll(null, "DESC", pageable);
  }

  @Transactional(readOnly = true)
  public Page<PostDTO> getAll(String search, String direction, Pageable pageable) {
    Sort.Direction sortDirection = "ASC".equalsIgnoreCase(direction) ? Sort.Direction.ASC : Sort.Direction.DESC;
    Sort sort = Sort.by(sortDirection, "dataPostagem");

    Pageable sortedPageable = PageRequest.of(
        pageable.getPageNumber(),
        pageable.getPageSize(),
        sort
    );

    String querySearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
    Page<Post> page = repository.searchPosts(querySearch, sortedPageable);

    return page.map(x -> {
      PostDTO dto = modelMapper.map(x, PostDTO.class);
      dto.setUpvotes(x.getUpvotes());
      dto.setUpCount(x.getUpCount());
      return dto;
    });
  }

  @Transactional(readOnly = true)
  public PostDetailsDTO getById(UUID id) {
    Post post = repository.findById(id)
        .orElseThrow(() -> new NaoEncontradoException("Postagem não encontrada"));

    PostDetailsDTO dto = modelMapper.map(post, PostDetailsDTO.class);
    dto.setUpvotes(post.getUpvotes());
    dto.setUpCount(post.getUpCount());

    // Ordena os comentários com mais "up" no topo (critério de desempate: data do comentário)
    if (post.getComentarioList() != null) {
      List<ComentarioDTO> comentariosDTO = post.getComentarioList().stream()
          .map(c -> {
            ComentarioDTO cdto = modelMapper.map(c, ComentarioDTO.class);
            cdto.setUpvotes(c.getUpvotes());
            cdto.setUpCount(c.getUpCount());
            return cdto;
          })
          .sorted((c1, c2) -> {
            int cmp = Integer.compare(c2.getUpCount(), c1.getUpCount());
            if (cmp != 0) {
              return cmp;
            }
            if (c2.getDataComentario() != null && c1.getDataComentario() != null) {
              return c2.getDataComentario().compareTo(c1.getDataComentario());
            }
            return 0;
          })
          .collect(Collectors.toList());
      dto.setComentarioList(comentariosDTO);
    }

    return dto;
  }

  @Transactional
  public void criarPost(PostDTO postdto) {
    try {
      Post post = modelMapper.map(postdto, Post.class);
      if (post.getDataPostagem() == null) {
        post.setDataPostagem(LocalDateTime.now(ZoneId.of("America/Sao_Paulo")));
      }
      repository.save(post);
    } catch(TransactionSystemException ex) {
      throw new CampoNaoPreenchidoException(ex.getMessage());
    }
  }

  @Transactional
  public void editarPost(UUID id, PostDTO dto) {
    Post post = repository.findById(id)
        .orElseThrow(() -> new NaoEncontradoException("Postagem não encontrada"));

    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
      throw new AccessDeniedException("Usuário não autenticado.");
    }

    Usuario usuarioAtual = (Usuario) auth.getPrincipal();

    boolean isAutor = post.getAutor() != null && (
        (post.getAutor().getId() != null && post.getAutor().getId().equals(usuarioAtual.getId())) ||
        (post.getAutor().getNome() != null && post.getAutor().getNome().equalsIgnoreCase(usuarioAtual.getNome()))
    );

    boolean canEditByPermission = auth.getAuthorities().stream()
        .anyMatch(a -> "POST_UPDATE".equals(a.getAuthority()) || "ROLE_ADMIN".equals(a.getAuthority()));

    if (!isAutor && !canEditByPermission) {
      throw new AccessDeniedException("Você só tem permissão para editar suas próprias postagens.");
    }

    if (dto.getTitulo() != null && !dto.getTitulo().trim().isEmpty()) {
      post.setTitulo(dto.getTitulo().trim());
    }
    if (dto.getConteudo() != null && !dto.getConteudo().trim().isEmpty()) {
      post.setConteudo(dto.getConteudo().trim());
    }
    if (dto.getLinkImagem() != null && !dto.getLinkImagem().trim().isEmpty()) {
      post.setLinkImagem(dto.getLinkImagem().trim());
    }

    repository.save(post);
  }

  @Transactional
  public void excluirPost(UUID id) {
    Post post = repository.findById(id)
        .orElseThrow(() -> new NaoEncontradoException("Postagem não encontrada"));

    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
      throw new AccessDeniedException("Usuário não autenticado.");
    }

    Usuario usuarioAtual = (Usuario) auth.getPrincipal();

    boolean isAutor = post.getAutor() != null && (
        (post.getAutor().getId() != null && post.getAutor().getId().equals(usuarioAtual.getId())) ||
        (post.getAutor().getNome() != null && post.getAutor().getNome().equalsIgnoreCase(usuarioAtual.getNome()))
    );

    boolean canDeleteByPermission = auth.getAuthorities().stream()
        .anyMatch(a -> "POST_DELETE".equals(a.getAuthority()) || "ROLE_ADMIN".equals(a.getAuthority()));

    if (!isAutor && !canDeleteByPermission) {
      throw new AccessDeniedException("Você só tem permissão para excluir suas próprias postagens.");
    }

    repository.delete(post);
  }

  @Transactional
  public Map<String, Object> toggleUpvote(UUID id) {
    Post post = repository.findById(id)
        .orElseThrow(() -> new NaoEncontradoException("Postagem não encontrada"));

    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
      throw new AccessDeniedException("Usuário não autenticado.");
    }

    Usuario usuarioAtual = (Usuario) auth.getPrincipal();
    UUID usuarioId = usuarioAtual.getId();

    boolean upvoted;
    if (post.getUpvotes().contains(usuarioId)) {
      post.getUpvotes().remove(usuarioId);
      upvoted = false;
    } else {
      post.getUpvotes().add(usuarioId);
      upvoted = true;
    }

    repository.save(post);

    Map<String, Object> response = new HashMap<>();
    response.put("upCount", post.getUpCount());
    response.put("upvoted", upvoted);
    return response;
  }
}
