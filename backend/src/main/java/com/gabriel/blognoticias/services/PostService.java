package com.gabriel.blognoticias.services;

import com.gabriel.blognoticias.models.entities.Post;
import com.gabriel.blognoticias.repositories.PostRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {

  private PostRepository repository;

  public PostService(PostRepository repository) {
    this.repository = repository;
  }


  public List<Post> getAll() {
    return repository.findAll();
  }
  public void criarPost(Post post) {
    repository.save(post);
  }


}
