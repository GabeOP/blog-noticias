import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { roleService } from '../../services/roleService';
import {
  Users,
  Shield,
  Key,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle,
  AlertCircle,
  X,
  Lock
} from 'lucide-react';
import './GerenciarUsuarios.css';

export const GerenciarUsuarios = () => {
  const { user: currentUser, hasPermission } = useAuth();

  // Estados principais
  const [activeTab, setActiveTab] = useState('usuarios'); // 'usuarios' | 'cargos'
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Toast / Mensagens
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: string }

  // Modal: Editar Cargos do Usuário
  const [selectedUserForRoles, setSelectedUserForRoles] = useState(null);
  const [userRolesSelection, setUserRolesSelection] = useState([]);
  const [savingUserRoles, setSavingUserRoles] = useState(false);

  // Modal: Criar / Editar Cargo (IAM)
  const [roleModalMode, setRoleModalMode] = useState(null); // null | 'create' | 'edit'
  const [currentRoleData, setCurrentRoleData] = useState({ id: null, nome: '', descricao: '', permissions: [] });
  const [savingRole, setSavingRole] = useState(false);

  // Modal: Confirmação de Exclusão
  const [deleteConfirmation, setDeleteConfirmation] = useState(null); // { type: 'user' | 'role', id: string, name: string }

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, rolesData, permissionsData] = await Promise.all([
        userService.getUsers(),
        roleService.getRoles(),
        roleService.getPermissions()
      ]);
      setUsers(usersData || []);
      setRoles(rolesData || []);
      setPermissions(permissionsData || []);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      showNotification('error', 'Falha ao carregar dados do sistema.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- Handlers: Gerenciar Cargos de Usuário ---
  const handleOpenUserRolesModal = (user) => {
    setSelectedUserForRoles(user);
    // Suporta tanto lista de roles quanto fallback para o cargo legado
    const initialRoles = user.roles && user.roles.length > 0
      ? [...user.roles]
      : (user.cargo === 'ADM' ? ['ROLE_ADMIN'] : ['ROLE_COMUM']);
    setUserRolesSelection(initialRoles);
  };

  const handleToggleUserRole = (roleName) => {
    setUserRolesSelection((prev) => {
      if (prev.includes(roleName)) {
        return prev.filter((r) => r !== roleName);
      } else {
        return [...prev, roleName];
      }
    });
  };

  const handleSaveUserRoles = async () => {
    if (!selectedUserForRoles) return;
    if (userRolesSelection.length === 0) {
      showNotification('error', 'O usuário precisa ter ao menos um cargo.');
      return;
    }

    setSavingUserRoles(true);
    try {
      await userService.updateUserRoles(selectedUserForRoles.id, userRolesSelection);
      showNotification('success', `Cargos de ${selectedUserForRoles.nome} atualizados com sucesso.`);
      setSelectedUserForRoles(null);
      await loadData();
    } catch (err) {
      console.error('Erro ao atualizar cargos:', err);
      showNotification('error', err.response?.data?.message || 'Erro ao atualizar cargos do usuário.');
    } finally {
      setSavingUserRoles(false);
    }
  };

  // --- Handlers: Criar / Editar Cargo (IAM) ---
  const handleOpenCreateRole = () => {
    setCurrentRoleData({
      id: null,
      nome: '',
      descricao: '',
      permissions: []
    });
    setRoleModalMode('create');
  };

  const handleOpenEditRole = (role) => {
    setCurrentRoleData({
      id: role.id,
      nome: role.nome,
      descricao: role.descricao || '',
      permissions: role.permissions ? [...role.permissions] : []
    });
    setRoleModalMode('edit');
  };

  const handleToggleRolePermission = (permName) => {
    setCurrentRoleData((prev) => {
      const exists = prev.permissions.includes(permName);
      const newPerms = exists
        ? prev.permissions.filter((p) => p !== permName)
        : [...prev.permissions, permName];
      return { ...prev, permissions: newPerms };
    });
  };

  const handleToggleAllCategoryPermissions = (categoryPerms, shouldSelect) => {
    setCurrentRoleData((prev) => {
      const names = categoryPerms.map((p) => p.nome);
      let newPerms = prev.permissions.filter((p) => !names.includes(p));
      if (shouldSelect) {
        newPerms = [...newPerms, ...names];
      }
      return { ...prev, permissions: newPerms };
    });
  };

  const handleSaveRole = async () => {
    if (!currentRoleData.nome.trim()) {
      showNotification('error', 'O nome do cargo é obrigatório.');
      return;
    }

    setSavingRole(true);
    try {
      if (roleModalMode === 'create') {
        await roleService.createRole(currentRoleData);
        showNotification('success', `Cargo ${currentRoleData.nome} criado com sucesso.`);
      } else {
        await roleService.updateRole(currentRoleData.id, currentRoleData);
        showNotification('success', `Cargo ${currentRoleData.nome} atualizado com sucesso.`);
      }
      setRoleModalMode(null);
      await loadData();
    } catch (err) {
      console.error('Erro ao salvar cargo:', err);
      showNotification('error', err.response?.data?.message || 'Erro ao salvar cargo.');
    } finally {
      setSavingRole(false);
    }
  };

  // --- Handlers: Exclusão com Confirmação ---
  const handleExecuteDelete = async () => {
    if (!deleteConfirmation) return;

    try {
      if (deleteConfirmation.type === 'user') {
        await userService.deleteUser(deleteConfirmation.id);
        showNotification('success', `Usuário ${deleteConfirmation.name} excluído.`);
      } else if (deleteConfirmation.type === 'role') {
        await roleService.deleteRole(deleteConfirmation.id);
        showNotification('success', `Cargo ${deleteConfirmation.name} excluído.`);
      }
      setDeleteConfirmation(null);
      await loadData();
    } catch (err) {
      console.error('Erro ao excluir:', err);
      showNotification('error', err.response?.data?.message || 'Erro ao realizar exclusão.');
    }
  };

  // Filtragem de Usuários por Nome ou Email
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchesName = u.nome?.toLowerCase().includes(q);
    const matchesEmail = u.email?.toLowerCase().includes(q);
    return matchesName || matchesEmail;
  });

  // Agrupamento de Permissões por Categoria IAM
  const permissionCategories = [
    {
      title: 'Postagens & Publicações',
      key: 'post',
      filter: (p) => p.nome.startsWith('POST_')
    },
    {
      title: 'Comentários & Interações',
      key: 'comment',
      filter: (p) => p.nome.startsWith('COMMENT_')
    },
    {
      title: 'Gestão de Usuários',
      key: 'user',
      filter: (p) => p.nome.startsWith('USER_')
    },
    {
      title: 'Governança do Sistema & IAM',
      key: 'iam',
      filter: (p) => p.nome.startsWith('ROLE_')
    }
  ];

  const uncategorizedPermissions = permissions.filter(
    (p) => !p.nome.startsWith('POST_') &&
           !p.nome.startsWith('COMMENT_') &&
           !p.nome.startsWith('USER_') &&
           !p.nome.startsWith('ROLE_')
  );

  return (
    <div className="iam-container">
      {/* Cabeçalho */}
      <div className="iam-header">
        <div className="iam-title-group">
          <h2>Gerenciamento de Acessos & IAM</h2>
          <p className="iam-subtitle">
            Administre usuários cadastrados, atribuição de cargos e controle granular de permissões (RBAC).
          </p>
        </div>
      </div>

      {/* Alerta de Feedback */}
      {notification && (
        <div className={`iam-alert iam-alert-${notification.type}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{notification.message}</span>
          </div>
          <button className="iam-alert-close" onClick={() => setNotification(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Métricas / Resumo */}
      <div className="iam-stats-grid">
        <div className="iam-stat-card">
          <div className="iam-stat-icon blue">
            <Users size={22} />
          </div>
          <div className="iam-stat-info">
            <h3>{users.length}</h3>
            <p>Usuários Cadastrados</p>
          </div>
        </div>

        <div className="iam-stat-card">
          <div className="iam-stat-icon slate">
            <Shield size={22} />
          </div>
          <div className="iam-stat-info">
            <h3>{roles.length}</h3>
            <p>Cargos no Sistema</p>
          </div>
        </div>

        <div className="iam-stat-card">
          <div className="iam-stat-icon green">
            <Key size={22} />
          </div>
          <div className="iam-stat-info">
            <h3>{permissions.length}</h3>
            <p>Permissões Granulares</p>
          </div>
        </div>
      </div>

      {/* Abas */}
      <div className="iam-tabs-bar">
        <button
          className={`iam-tab-btn ${activeTab === 'usuarios' ? 'active' : ''}`}
          onClick={() => setActiveTab('usuarios')}
        >
          <Users size={18} />
          <span>Usuários</span>
          <span className="iam-badge-count">{users.length}</span>
        </button>

        <button
          className={`iam-tab-btn ${activeTab === 'cargos' ? 'active' : ''}`}
          onClick={() => setActiveTab('cargos')}
        >
          <Shield size={18} />
          <span>Cargos & Permissões (IAM)</span>
          <span className="iam-badge-count">{roles.length}</span>
        </button>
      </div>

      {loading ? (
        <div className="iam-loading">Carregando informações de acesso...</div>
      ) : (
        <>
          {/* =========================================
              ABA 1: USUÁRIOS
             ========================================= */}
          {activeTab === 'usuarios' && (
            <div>
              <div className="iam-actions-bar">
                <div className="iam-search-box">
                  <Search size={18} color="#94a3b8" />
                  <input
                    type="text"
                    placeholder="Filtrar por nome ou e-mail..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="iam-table-container">
                <table className="iam-table">
                  <thead>
                    <tr>
                      <th>Usuário</th>
                      <th>Cargos Atribuídos</th>
                      <th style={{ textAlign: 'right' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="iam-empty-state">
                          Nenhum usuário encontrado com os filtros aplicados.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => {
                        const isSelf = currentUser?.id === user.id;
                        const isPrimaryAdmin = user.nome?.toLowerCase() === 'adm';
                        const userRoles = user.roles && user.roles.length > 0
                          ? user.roles
                          : (user.cargo === 'ADM' ? ['ROLE_ADMIN'] : ['ROLE_COMUM']);

                        return (
                          <tr key={user.id}>
                            <td>
                              <div className="user-identity">
                                <div className="user-avatar-initials">
                                  {user.nome?.substring(0, 2).toUpperCase() || 'U'}
                                </div>
                                <div>
                                  <div className="user-name">
                                    {user.nome} {isSelf && <span style={{ fontSize: '0.75rem', color: '#64748b' }}>(Você)</span>}
                                  </div>
                                  <div className="user-email">{user.email || 'Sem e-mail cadastrado'}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="role-badge-list">
                                {userRoles.map((rName) => {
                                  let tagClass = 'custom';
                                  if (rName === 'ROLE_ADMIN') tagClass = 'admin';
                                  if (rName === 'ROLE_COMUM') tagClass = 'comum';
                                  return (
                                    <span key={rName} className={`role-tag ${tagClass}`}>
                                      {rName}
                                    </span>
                                  );
                                })}
                              </div>
                            </td>
                            <td>
                              <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                                {hasPermission('USER_UPDATE') && (
                                  <button
                                    className="btn-secondary-action"
                                    onClick={() => handleOpenUserRolesModal(user)}
                                    title="Alterar os cargos atribuídos a este usuário"
                                  >
                                    <Edit2 size={14} />
                                    <span>Cargos</span>
                                  </button>
                                )}

                                {hasPermission('USER_DELETE') && !isSelf && !isPrimaryAdmin && (
                                  <button
                                    className="btn-danger-action"
                                    onClick={() =>
                                      setDeleteConfirmation({
                                        type: 'user',
                                        id: user.id,
                                        name: user.nome
                                      })
                                    }
                                    title="Excluir usuário permanentemente"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================
              ABA 2: CARGOS & PERMISSÕES (IAM)
             ========================================= */}
          {activeTab === 'cargos' && (
            <div>
              <div className="iam-actions-bar">
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
                  Cargos definem grupos de permissões que podem ser concedidas aos usuários da aplicação.
                </p>

                {hasPermission('ROLE_MANAGE') && (
                  <button className="btn-primary-action" onClick={handleOpenCreateRole}>
                    <Plus size={16} />
                    <span>Novo Cargo</span>
                  </button>
                )}
              </div>

              <div className="roles-grid">
                {roles.map((role) => {
                  const isStandard = role.nome === 'ROLE_ADMIN' || role.nome === 'ROLE_COMUM';
                  const rolePerms = role.permissions || [];

                  return (
                    <div key={role.id} className="role-card">
                      <div>
                        <div className="role-card-header">
                          <div className="role-card-title">
                            <Shield size={18} color="rgb(59, 89, 152)" />
                            <h4>{role.nome}</h4>
                          </div>
                          {isStandard && (
                            <span className="role-tag comum" title="Cargo padrão protegido do sistema">
                              Padrão
                            </span>
                          )}
                        </div>

                        <p className="role-card-desc">
                          {role.descricao || 'Sem descrição cadastrada para este cargo.'}
                        </p>

                        <div className="role-permissions-summary">
                          <h5>Permissões ({rolePerms.length})</h5>
                          <div className="permissions-chips">
                            {rolePerms.length === 0 ? (
                              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                Nenhuma permissão associada
                              </span>
                            ) : (
                              <>
                                {rolePerms.slice(0, 5).map((pName) => (
                                  <span key={pName} className="perm-chip">
                                    {pName}
                                  </span>
                                ))}
                                {rolePerms.length > 5 && (
                                  <span className="perm-chip-more">+{rolePerms.length - 5}</span>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="role-card-actions">
                        {hasPermission('ROLE_MANAGE') && (
                          <button
                            className="btn-secondary-action"
                            onClick={() => handleOpenEditRole(role)}
                            title="Editar permissões associadas a este cargo"
                          >
                            <Edit2 size={14} />
                            <span>Permissões</span>
                          </button>
                        )}

                        {hasPermission('ROLE_MANAGE') && !isStandard && (
                          <button
                            className="btn-danger-action"
                            onClick={() =>
                              setDeleteConfirmation({
                                type: 'role',
                                id: role.id,
                                name: role.nome
                              })
                            }
                            title="Excluir este cargo customizado"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* =========================================
          MODAL: EDITAR CARGOS DO USUÁRIO
         ========================================= */}
      {selectedUserForRoles && (
        <div className="iam-modal-overlay">
          <div className="iam-modal">
            <div className="iam-modal-header">
              <h3>Atribuir Cargos a {selectedUserForRoles.nome}</h3>
              <button
                className="btn-close-modal"
                onClick={() => setSelectedUserForRoles(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="iam-modal-body">
              <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '16px' }}>
                Selecione os cargos que este usuário possuirá no sistema. As permissões de todos os
                cargos selecionados serão somadas.
              </p>

              <div className="role-options-list">
                {roles.map((r) => {
                  const isChecked = userRolesSelection.includes(r.nome);
                  const isPrimaryAdminRole =
                    selectedUserForRoles?.nome?.toLowerCase() === 'adm' && r.nome === 'ROLE_ADMIN';

                  return (
                    <label key={r.id} className="role-checkbox-item">
                      <input
                        type="checkbox"
                        checked={isPrimaryAdminRole || isChecked}
                        disabled={isPrimaryAdminRole}
                        onChange={() => !isPrimaryAdminRole && handleToggleUserRole(r.nome)}
                      />
                      <div className="role-checkbox-info">
                        <span className="role-checkbox-title">
                          {r.nome}
                          {isPrimaryAdminRole && (
                            <span style={{ fontSize: '0.75rem', color: '#dc2626', marginLeft: 6 }}>
                              (Obrigatório para o admin principal)
                            </span>
                          )}
                        </span>
                        <span className="role-checkbox-desc">
                          {r.descricao || 'Sem descrição cadastrada.'}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="iam-modal-footer">
              <button
                className="btn-secondary-action"
                onClick={() => setSelectedUserForRoles(null)}
                disabled={savingUserRoles}
              >
                Cancelar
              </button>
              <button
                className="btn-primary-action"
                onClick={handleSaveUserRoles}
                disabled={savingUserRoles}
              >
                {savingUserRoles ? 'Salvando...' : 'Confirmar Alterações'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL: CRIAR / EDITAR CARGO & PERMISSÕES
         ========================================= */}
      {roleModalMode && (
        <div className="iam-modal-overlay">
          <div className="iam-modal" style={{ maxWidth: '680px' }}>
            <div className="iam-modal-header">
              <h3>{roleModalMode === 'create' ? 'Novo Cargo' : `Editar ${currentRoleData.nome}`}</h3>
              <button className="btn-close-modal" onClick={() => setRoleModalMode(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="iam-modal-body">
              <div className="form-group">
                <label>Identificador do Cargo (Role):</label>
                <input
                  type="text"
                  placeholder="Ex: ROLE_EDITOR ou ROLE_MODERADOR"
                  value={currentRoleData.nome}
                  disabled={roleModalMode === 'edit' && (currentRoleData.nome === 'ROLE_ADMIN' || currentRoleData.nome === 'ROLE_COMUM')}
                  onChange={(e) =>
                    setCurrentRoleData({ ...currentRoleData, nome: e.target.value.toUpperCase() })
                  }
                />
              </div>

              <div className="form-group">
                <label>Descrição funcional:</label>
                <textarea
                  rows="2"
                  placeholder="Ex: Usuário responsável por criar e revisar postagens no blog."
                  value={currentRoleData.descricao}
                  onChange={(e) =>
                    setCurrentRoleData({ ...currentRoleData, descricao: e.target.value })
                  }
                />
              </div>

              <div style={{ marginTop: '20px' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#334155', display: 'block', marginBottom: '8px' }}>
                  Matriz de Permissões Granulares:
                </label>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '14px' }}>
                  Ative as permissões que compõem este perfil de acesso:
                </p>

                {permissionCategories.map((category) => {
                  const categoryPerms = permissions.filter(category.filter);
                  if (categoryPerms.length === 0) return null;

                  const allSelected = categoryPerms.every((p) =>
                    currentRoleData.permissions.includes(p.nome)
                  );

                  return (
                    <div key={category.key} className="permission-category">
                      <div className="permission-category-header">
                        <div className="permission-category-title">
                          <Lock size={14} color="#64748b" />
                          <span>{category.title}</span>
                        </div>
                        <div className="permission-category-actions">
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleAllCategoryPermissions(categoryPerms, !allSelected)
                            }
                          >
                            {allSelected ? 'Desmarcar todos' : 'Marcar todos'}
                          </button>
                        </div>
                      </div>

                      <div>
                        {categoryPerms.map((perm) => {
                          const isChecked = currentRoleData.permissions.includes(perm.nome);
                          return (
                            <label key={perm.id} className="permission-item">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleRolePermission(perm.nome)}
                              />
                              <div>
                                <span className="perm-label-code">{perm.nome}</span>
                                <span className="perm-label-desc">
                                  {perm.descricao || 'Sem descrição cadastrada'}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {uncategorizedPermissions.length > 0 && (
                  <div className="permission-category">
                    <div className="permission-category-header">
                      <div className="permission-category-title">
                        <span>Outras Permissões</span>
                      </div>
                    </div>
                    <div>
                      {uncategorizedPermissions.map((perm) => (
                        <label key={perm.id} className="permission-item">
                          <input
                            type="checkbox"
                            checked={currentRoleData.permissions.includes(perm.nome)}
                            onChange={() => handleToggleRolePermission(perm.nome)}
                          />
                          <div>
                            <span className="perm-label-code">{perm.nome}</span>
                            <span className="perm-label-desc">{perm.descricao}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="iam-modal-footer">
              <button
                className="btn-secondary-action"
                onClick={() => setRoleModalMode(null)}
                disabled={savingRole}
              >
                Cancelar
              </button>
              <button
                className="btn-primary-action"
                onClick={handleSaveRole}
                disabled={savingRole}
              >
                {savingRole ? 'Salvando...' : 'Salvar Cargo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL: CONFIRMAÇÃO DE EXCLUSÃO
         ========================================= */}
      {deleteConfirmation && (
        <div className="iam-modal-overlay">
          <div className="iam-modal" style={{ maxWidth: '440px' }}>
            <div className="iam-modal-header">
              <h3>Confirmar Exclusão</h3>
              <button className="btn-close-modal" onClick={() => setDeleteConfirmation(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="iam-modal-body">
              <p style={{ margin: 0, color: '#334155', fontSize: '0.92rem', lineHeight: '1.5' }}>
                Tem certeza que deseja excluir permanentemente o{' '}
                <strong>{deleteConfirmation.type === 'user' ? 'usuário' : 'cargo'}</strong>{' '}
                <span style={{ color: '#dc2626', fontWeight: 600 }}>{deleteConfirmation.name}</span>?
              </p>
              <p style={{ marginTop: '10px', fontSize: '0.8rem', color: '#64748b' }}>
                Esta ação é irreversível e removerá as permissões e dados vinculados.
              </p>
            </div>

            <div className="iam-modal-footer">
              <button className="btn-secondary-action" onClick={() => setDeleteConfirmation(null)}>
                Cancelar
              </button>
              <button
                className="btn-danger-action"
                style={{ backgroundColor: '#dc2626', color: '#ffffff', borderColor: '#dc2626' }}
                onClick={handleExecuteDelete}
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

