package com.gabriel.blognoticias.configs;

import com.gabriel.blognoticias.models.entities.Permission;
import com.gabriel.blognoticias.models.entities.Role;
import com.gabriel.blognoticias.models.entities.Usuario;
import com.gabriel.blognoticias.repositories.PermissionRepository;
import com.gabriel.blognoticias.repositories.RoleRepository;
import com.gabriel.blognoticias.repositories.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

  private final PermissionRepository permissionRepository;
  private final RoleRepository roleRepository;
  private final UsuarioRepository usuarioRepository;

  public DataInitializer(PermissionRepository permissionRepository,
                         RoleRepository roleRepository,
                         UsuarioRepository usuarioRepository) {
    this.permissionRepository = permissionRepository;
    this.roleRepository = roleRepository;
    this.usuarioRepository = usuarioRepository;
  }

  @Override
  @Transactional
  public void run(String... args) {
    // 1. Criar ou obter permissões granulares
    Permission postRead = getOrCreatePermission("POST_READ", "Permissão para visualizar postagens");
    Permission postCreate = getOrCreatePermission("POST_CREATE", "Permissão para criar postagens");
    Permission postUpdate = getOrCreatePermission("POST_UPDATE", "Permissão para editar postagens");
    Permission postDelete = getOrCreatePermission("POST_DELETE", "Permissão para deletar postagens");

    Permission commentCreate = getOrCreatePermission("COMMENT_CREATE", "Permissão para comentar em postagens");
    Permission commentDelete = getOrCreatePermission("COMMENT_DELETE", "Permissão para deletar comentários");

    Permission userRead = getOrCreatePermission("USER_READ", "Permissão para listar usuários");
    Permission userUpdate = getOrCreatePermission("USER_UPDATE", "Permissão para editar cargos de usuários");
    Permission userDelete = getOrCreatePermission("USER_DELETE", "Permissão para excluir usuários");
    Permission roleManage = getOrCreatePermission("ROLE_MANAGE", "Permissão para gerenciar perfis e permissões");

    // 2. Criar ou obter Roles
    Role roleAdmin = roleRepository.findByNome("ROLE_ADMIN").orElseGet(() -> {
      Role role = new Role("ROLE_ADMIN", "Administrador do sistema com acesso total");
      return roleRepository.save(role);
    });

    Role roleComum = roleRepository.findByNome("ROLE_COMUM").orElseGet(() -> {
      Role role = new Role("ROLE_COMUM", "Usuário padrão do blog");
      return roleRepository.save(role);
    });

    // Associar permissões aos roles
    Set<Permission> adminPermissions = new HashSet<>(Arrays.asList(
        postRead, postCreate, postUpdate, postDelete,
        commentCreate, commentDelete,
        userRead, userUpdate, userDelete, roleManage
    ));
    roleAdmin.setPermissions(adminPermissions);
    roleRepository.save(roleAdmin);

    Set<Permission> comumPermissions = new HashSet<>(Arrays.asList(
        postRead, commentCreate, commentDelete
    ));
    roleComum.setPermissions(comumPermissions);
    roleRepository.save(roleComum);

    // 3. Vincular usuários existentes aos roles
    List<Usuario> usuarios = usuarioRepository.findAll();
    for (Usuario user : usuarios) {
      if (user.getRoles() == null || user.getRoles().isEmpty()) {
        if ("adm".equalsIgnoreCase(user.getNome())) {
          user.getRoles().add(roleAdmin);
        } else {
          user.getRoles().add(roleComum);
        }
        usuarioRepository.save(user);
      }
    }
  }

  private Permission getOrCreatePermission(String nome, String descricao) {
    return permissionRepository.findByNome(nome).orElseGet(() ->
        permissionRepository.save(new Permission(nome, descricao))
    );
  }
}

