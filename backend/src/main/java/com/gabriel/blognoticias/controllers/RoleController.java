package com.gabriel.blognoticias.controllers;

import com.gabriel.blognoticias.models.dto.PermissionDTO;
import com.gabriel.blognoticias.models.dto.RoleDTO;
import com.gabriel.blognoticias.services.RoleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/roles")
public class RoleController {

  private final RoleService roleService;

  public RoleController(RoleService roleService) {
    this.roleService = roleService;
  }

  @GetMapping
  public ResponseEntity<List<RoleDTO>> getAllRoles() {
    return ResponseEntity.ok(roleService.getAllRoles());
  }

  @GetMapping("/{id}")
  public ResponseEntity<RoleDTO> getRoleById(@PathVariable UUID id) {
    return ResponseEntity.ok(roleService.getRoleById(id));
  }

  @PostMapping
  public ResponseEntity<RoleDTO> createRole(@RequestBody RoleDTO dto) {
    RoleDTO created = roleService.createRole(dto);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
  }

  @PutMapping("/{id}")
  public ResponseEntity<RoleDTO> updateRole(@PathVariable UUID id, @RequestBody RoleDTO dto) {
    RoleDTO updated = roleService.updateRole(id, dto);
    return ResponseEntity.ok(updated);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteRole(@PathVariable UUID id) {
    roleService.deleteRole(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/permissions")
  public ResponseEntity<List<PermissionDTO>> getAllPermissions() {
    return ResponseEntity.ok(roleService.getAllPermissions());
  }
}

