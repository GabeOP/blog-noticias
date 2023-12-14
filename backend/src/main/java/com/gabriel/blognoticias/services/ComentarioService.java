package com.gabriel.blognoticias.services;

import com.gabriel.blognoticias.models.dto.ComentarioDTO;
import com.gabriel.blognoticias.models.entities.Comentario;
import com.gabriel.blognoticias.repositories.ComentarioRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ComentarioService {

  @Autowired
  private ComentarioRepository repository;

  @Autowired
  private ModelMapper modelMapper;

  public List<ComentarioDTO> getAll() {
    List<ComentarioDTO> response = repository.findAll()
            .stream().map(x -> modelMapper.map(x, ComentarioDTO.class)).collect(Collectors.toList());
    return response;
  }

  public Comentario getById(UUID id) {
    return repository.findById(id).get();
  }

  public void criarComentario(Comentario comentario) {
    repository.save(comentario);
  }
}
