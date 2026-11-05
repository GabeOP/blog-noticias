import React, { useState } from 'react';
import { Formulario } from '../../components/FormularioUsuario/Formulario';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { InfoProjeto } from '../../components/InfoProjeto/InfoProjeto';
import '../Cadastro/Cadastro.css';

export default function PaginaLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const handleLoginSubmit = async (dados) => {
    setLoading(true);
    setErro(null);

    try {
      await login(dados);
      navigate('/');
    } catch (error) {
      console.error('Erro no login:', error);
      setErro('Usuário ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Entrar no Blog</h2>
          <p>Informe suas credenciais para continuar</p>
        </div>

        <div className="auth-body">
          {erro && <div className="auth-alert error">{erro}</div>}

          <Formulario
            onSubmit={handleLoginSubmit}
            buttonText="Entrar"
            loading={loading}
          />
        </div>

        <div className="auth-footer">
          <p>
            Não possui cadastro? <Link to="/cadastro">Registre-se aqui</Link>
          </p>
        </div>
      </div>

      <InfoProjeto />
    </div>
  );
}
