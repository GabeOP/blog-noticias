import React, { useState } from 'react';
import { Formulario } from '../../components/FormularioUsuario/Formulario';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PaginaLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [erro, setErro] = useState(null);

  const handleLoginSubmit = async (dados) => {
    try {
      setErro(null);
      await login(dados);
      navigate('/');
    } catch (error) {
      console.error('Erro no login:', error);
      setErro('Usuário ou senha incorretos.');
    }
  };

  return (
    <div id='form-container'>
      <div id='h2-form'>
        <h2>Login</h2>
      </div>
      {erro && (
        <div style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>
          {erro}
        </div>
      )}
      <div>
        <Formulario onSubmit={handleLoginSubmit} buttonText="Login" />
      </div>
      <div>
        <p>Não possui cadastro? <Link to="/cadastro">Registre-se aqui</Link></p>
      </div>
    </div>
  );
}
