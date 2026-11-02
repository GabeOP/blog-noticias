package com.gabriel.blognoticias.services;

import com.gabriel.blognoticias.models.dto.PermissionDTO;
import com.gabriel.blognoticias.models.dto.RoleDTO;
import com.gabriel.blognoticias.models.entities.Permission;
import com.gabriel.blognoticias.models.entities.Role;
import com.gabriel.blognoticias.models.exception.JaCadastradoException;
import com.gabriel.blognoticias.models.exception.NaoEncontradoException;
import com.gabriel.blognoticias.repositories.PermissionRepository;
import com.gabriel.blognoticias.repositories.RoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RoleService {

  private final RoleRepository roleRepository;
  private final PermissionRepository permissionRepository;

  public RoleService(RoleRepository roleRepository, PermissionRepository permissionRepository) {
    this.roleRepository = roleRepository;
    this.permissionRepository = permissionRepository;
  }

  public List<RoleDTO> getAllRoles() {
    return roleRepository.findAll().stream()
        .map(this::toDTO)
        .sorted(Comparator.comparing(RoleDTO::getNome))
        .collect(Collectors.toList());
  }

  public List<PermissionDTO> getAllPermissions() {
    return permissionRepository.findAll().stream()
        .map(p -> new PermissionDTO(p.getId(), p.getNome(), p.getDescricao()))
        .sorted(Comparator.comparing(PermissionDTO::getNome))
        .collect(Collectors.toList());
  }

  public RoleDTO getRoleById(UUID id) {
    Role role = roleRepository.findById(id)
        .orElseThrow(() -> new NaoEncontradoException("Cargo não encontrado"));
    return toDTO(role);
  }

  @Transactional
  public RoleDTO createRole(RoleDTO dto) {
    String roleName = normalizeRoleName(dto.getNome());

    if (roleRepository.findByNome(roleName).isPresent()) {
      throw new JaCadastradoException("Cargo já cadastrado: " + roleName);
    }

    Role role = new Role(roleName, dto.getDescricao());

    if (dto.getPermissions() != null && !dto.getPermissions().isEmpty()) {
      Set<Permission> permissions = resolvePermissions(dto.getPermissions());
      role.setPermissions(permissions);
    }

    Role saved = roleRepository.save(role);
    return toDTO(saved);
  }

  @Transactional
  public RoleDTO updateRole(UUID id, RoleDTO dto) {
    Role role = roleRepository.findById(id)
        .orElseThrow(() -> new NaoEncontradoException("Cargo não encontrado"));

    if (dto.getDescricao() != null) {
      role.setDescricao(dto.getDescricao());
    }

    // Não permite renomear ROLE_ADMIN nem ROLE_COMUM
    if (dto.getNome() != null && !role.getNome().equals(dto.getNome())) {
      if ("ROLE_ADMIN".equals(role.getNome()) || "ROLE_COMUM".equals(role.getNome())) {
        throw new IllegalArgumentException("Os cargos padrão do sistema não podem ser renomeados.");
      }
      String newName = normalizeRoleName(dto.getNome());
      roleRepository.findByNome(newName).ifPresent(existing -> {
        if (!existing.getId().equals(role.getId())) {
          throw new JaCadastradoException("Cargo com este nome já existe: " + newName);
        }
      });
      role.setNome(newName);
    }

    if (dto.getPermissions() != null) {
      Set<Permission> permissions = resolvePermissions(dto.getPermissions());
      role.setPermissions(permissions);
    }

    Role updated = roleRepository.save(role);
    return toDTO(updated);
  }

  @Transactional
  public void deleteRole(UUID id) {
    Role role = roleRepository.findById(id)
        .orElseThrow(() -> new NaoEncontradoException("Cargo não encontrado"));

    if ("ROLE_ADMIN".equalsIgnoreCase(role.getNome()) || "ROLE_COMUM".equalsIgnoreCase(role.getNome())) {
      throw new IllegalArgumentException("Cargos padrão do sistema não podem ser excluídos.");
    }

    roleRepository.delete(role);
  }

  private Set<Permission> resolvePermissions(Set<String> permissionNames) {
    Set<Permission> result = new HashSet<>();
    for (String permName : permissionNames) {
      permissionRepository.findByNome(permName).ifPresent(result::add);
    }
    return result;
  }

  private String normalizeRoleName(String name) {
    if (name == null || name.trim().isEmpty()) {
      throw new IllegalArgumentException("Nome do cargo é obrigatório");
    }
    String cleaned = name.trim().toUpperCase().replace(" ", "_");
    if (!cleaned.startsWith("ROLE_")) {
      cleaned = "ROLE_" + cleaned;
    }
    return cleaned;
  }

  private RoleDTO toDTO(Role role) {
    Set<String> permissions = role.getPermissions() != null
        ? role.getPermissions().stream().map(Permission::getNome).collect(Collectors.toSet())
        : Collections.emptySet();

    return new RoleDTO(role.getId(), role.getNome(), role.getDescricao(), permissions);
  }
}

