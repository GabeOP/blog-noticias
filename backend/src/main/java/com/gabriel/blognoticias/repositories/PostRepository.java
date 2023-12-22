package com.gabriel.blognoticias.repositories;

import com.gabriel.blognoticias.models.entities.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, UUID> {

  @Query("SELECT p FROM Post p JOIN FETCH p.autor")
  List<Post> findAll();
}
