import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import "./Header.css";

export const Header = () => {
  const { user, hasPermission, logout, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  return (
    <header>
      <Link to="/" id='h1-header'><h1>Blog</h1></Link>

      <div>
        <span>Seja bem-vindo(a), {user?.nome}</span>

        <nav id="usuario-container">
          {hasPermission('POST_CREATE') && (
            <Link to="/adm/criar-post" id="btnCriarPost">Criar post</Link>
          )}
          {hasPermission('USER_READ') && (
            <Link to="#" id="btnGerenciar">Gerenciar</Link>
          )}
          <Link to="/" id='btnPagInicial'>Página inicial</Link>
          <a href="#logout" id="btnSair" onClick={handleLogout}>Sair</a>
        </nav>
      </div>
    </header>
  );
};
