package com.gabriel.blognoticias.services;

import com.gabriel.blognoticias.models.dto.PostDTO;
import com.gabriel.blognoticias.models.entities.Post;
import com.gabriel.blognoticias.models.exception.CampoNaoPreenchidoException;
import com.gabriel.blognoticias.repositories.PostRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionSystemException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PostService {

  private PostRepository repository;
  private ModelMapper modelMapper;

  public PostService(PostRepository repository, ModelMapper modelMapper) {
    this.repository = repository;
    this.modelMapper = modelMapper;
  }


  public List<PostDTO> getAll() {
    List<PostDTO> response = repository.findAll()
            .stream().map(x -> modelMapper.map(x, PostDTO.class)).collect(Collectors.toList());
    return response;
  }

  public Post getById(UUID id) {
    Optional<Post> response = repository.findById(id);
    return response.get();
  }

  @Transactional
  public void criarPost(PostDTO postdto) {
    try {
      repository.save(modelMapper.map(postdto, Post.class));
    }catch(TransactionSystemException ex) {
      throw new CampoNaoPreenchidoException(ex.getMessage());
    }
  }
}
