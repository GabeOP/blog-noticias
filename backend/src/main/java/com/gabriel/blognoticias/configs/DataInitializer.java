package com.gabriel.blognoticias.configs;

import com.gabriel.blognoticias.enums.Cargo;
import com.gabriel.blognoticias.models.entities.Permission;
import com.gabriel.blognoticias.models.entities.Post;
import com.gabriel.blognoticias.models.entities.Role;
import com.gabriel.blognoticias.models.entities.Usuario;
import com.gabriel.blognoticias.repositories.PermissionRepository;
import com.gabriel.blognoticias.repositories.PostRepository;
import com.gabriel.blognoticias.repositories.RoleRepository;
import com.gabriel.blognoticias.repositories.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

  private final PermissionRepository permissionRepository;
  private final RoleRepository roleRepository;
  private final UsuarioRepository usuarioRepository;
  private final PostRepository postRepository;

  public DataInitializer(PermissionRepository permissionRepository,
                         RoleRepository roleRepository,
                         UsuarioRepository usuarioRepository,
                         PostRepository postRepository) {
    this.permissionRepository = permissionRepository;
    this.roleRepository = roleRepository;
    this.usuarioRepository = usuarioRepository;
    this.postRepository = postRepository;
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

    // 3. Garantir explicitamente que o usuário adm SEMPRE possua ROLE_ADMIN e Cargo.ADM
    Usuario adm = (Usuario) usuarioRepository.findByNome("adm");
    if (adm != null) {
      if (adm.getRoles() == null) {
        adm.setRoles(new HashSet<>());
      }
      adm.getRoles().add(roleAdmin);
      adm.setCargo(Cargo.ADM);
      usuarioRepository.save(adm);
    }

    // 4. Vincular demais usuários existentes sem role
    List<Usuario> usuarios = usuarioRepository.findAll();
    for (Usuario user : usuarios) {
      if (user.getRoles() == null || user.getRoles().isEmpty()) {
        if ("adm".equalsIgnoreCase(user.getNome())) {
          user.getRoles().add(roleAdmin);
          user.setCargo(Cargo.ADM);
        } else {
          user.getRoles().add(roleComum);
        }
        usuarioRepository.save(user);
      }
    }

    // 5. Garantir que todas as postagens existentes possuam dataPostagem válida
    List<Post> posts = postRepository.findAll();
    for (Post post : posts) {
      if (post.getDataPostagem() == null) {
        post.setDataPostagem(LocalDateTime.now(ZoneId.of("America/Sao_Paulo")));
        postRepository.save(post);
      }
    }
  }

  private Permission getOrCreatePermission(String nome, String descricao) {
    return permissionRepository.findByNome(nome).orElseGet(() ->
        permissionRepository.save(new Permission(nome, descricao))
    );
  }
}
