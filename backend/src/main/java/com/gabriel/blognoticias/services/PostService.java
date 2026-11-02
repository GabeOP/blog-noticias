package com.gabriel.blognoticias.services;

import com.gabriel.blognoticias.models.dto.PostDTO;
import com.gabriel.blognoticias.models.dto.PostDetailsDTO;
import com.gabriel.blognoticias.models.entities.Post;
import com.gabriel.blognoticias.models.exception.CampoNaoPreenchidoException;
import com.gabriel.blognoticias.repositories.PostRepository;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.TransactionSystemException;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Optional;
import java.util.UUID;

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

    return page.map(x -> modelMapper.map(x, PostDTO.class));
  }

  @Transactional(readOnly = true)
  public PostDetailsDTO getById(UUID id) {
    Optional<Post> response = repository.findById(id);
    return modelMapper.map(response.get(), PostDetailsDTO.class);
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
}
