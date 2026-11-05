import React, { useState } from 'react';
import { Formulario } from '../../components/FormularioUsuario/Formulario';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../axios/config';
import { InfoProjeto } from '../../components/InfoProjeto/InfoProjeto';
import './Cadastro.css';

export function PaginaCadastro() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);

  const handleCadastroSubmit = async (dados) => {
    setLoading(true);
    setErro(null);
    setSucesso(null);

    try {
      const response = await API.post('/usuario', dados);
      setSucesso(response.data || 'Usuário cadastrado com sucesso! Redirecionando para login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      if (error.response?.data?.message) {
        setErro(error.response.data.message);
      } else {
        setErro('Erro no cadastro: nome de usuário ou e-mail já cadastrado no sistema.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Cadastro</h2>
          <p>Crie sua conta para participar da comunidade</p>
        </div>

        <div className="auth-body">
          {erro && <div className="auth-alert error">{erro}</div>}
          {sucesso && <div className="auth-alert success">{sucesso}</div>}

          <Formulario
            onSubmit={handleCadastroSubmit}
            buttonText="Cadastrar"
            loading={loading}
          />
        </div>

        <div className="auth-footer">
          <p>
            Já possui cadastro? <Link to="/login">Faça o login aqui</Link>
          </p>
        </div>
      </div>

      <InfoProjeto />
    </div>
  );
}
