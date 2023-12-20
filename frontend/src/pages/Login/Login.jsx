import React from 'react';
import { Formulario } from '../../components/FormularioUsuario/Formulario';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function PaginaLogin() {
  const handleLoginSubmit = async (dados) => {
    try {
      const response = await axios.post('/api/login', dados);
      console.log('Resposta do login:', response.data);
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };

  return (
    <div id='form-container'>
      <div id='h2-form'>
        <h2>Login</h2>
      </div>
      <div>
        <Formulario onSubmit={handleLoginSubmit} buttonText="Login" />
      </div>
      <div>
        <p>Não possui cadastro? <Link to="/cadastro">Registre-se aqui</Link></p>
      </div>
    </div>
  );
};
