package com.gabriel.blognoticias.repositories;

import com.gabriel.blognoticias.models.entities.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, UUID> {
  Optional<Permission> findByNome(String nome);
}

