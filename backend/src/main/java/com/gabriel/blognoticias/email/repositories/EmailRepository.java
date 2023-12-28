package com.gabriel.blognoticias.email.repositories;

import com.gabriel.blognoticias.email.models.entities.EmailModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EmailRepository extends JpaRepository<EmailModel, UUID> {
}
