package com.gabriel.blognoticias.repositories;

import com.gabriel.blognoticias.models.entities.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, UUID> {

  @Query("SELECT p FROM Post p JOIN FETCH p.autor")
  List<Post> findAll();

  @Query(
      value = "SELECT p FROM Post p WHERE (:search IS NULL OR :search = '' OR LOWER(p.titulo) LIKE LOWER(CONCAT('%', :search, '%')))",
      countQuery = "SELECT count(p) FROM Post p WHERE (:search IS NULL OR :search = '' OR LOWER(p.titulo) LIKE LOWER(CONCAT('%', :search, '%')))"
  )
  Page<Post> searchPosts(@Param("search") String search, Pageable pageable);
}
