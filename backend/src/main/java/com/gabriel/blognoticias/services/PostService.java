package com.gabriel.blognoticias.services;

import com.gabriel.blognoticias.models.entities.Post;
import com.gabriel.blognoticias.models.entities.Usuario;
import com.gabriel.blognoticias.repositories.PostRepository;
import org.springframework.stereotype.Service;

@Service
public class PostService {

  private PostRepository repository;

  public PostService(PostRepository repository) {
    this.repository = repository;
  }

  public void criarPost(Post post, Usuario usuario) {
    repository.save(post);
    post.setAutor(usuario);
  }
}
