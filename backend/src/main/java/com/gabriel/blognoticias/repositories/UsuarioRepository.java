package com.gabriel.blognoticias.repositories;

import com.gabriel.blognoticias.models.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {

  public Usuario findByNome(String nome);
}
