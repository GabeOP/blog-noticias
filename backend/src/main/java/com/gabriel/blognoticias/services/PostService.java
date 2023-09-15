package com.gabriel.blognoticias.services;

import com.gabriel.blognoticias.models.dto.PostDTO;
import com.gabriel.blognoticias.models.entities.Post;
import com.gabriel.blognoticias.repositories.PostRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
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
  public void criarPost(Post post) {
    repository.save(post);
  }


}