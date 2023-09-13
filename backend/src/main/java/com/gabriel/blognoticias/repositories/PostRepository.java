package com.gabriel.blognoticias.repositories;

import com.gabriel.blognoticias.models.entities.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, UUID> {
}
