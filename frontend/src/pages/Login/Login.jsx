import React from 'react';
import { Formulario } from '../../components/FormularioUsuario/Formulario';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API from '../../axios/config';

export default function PaginaLogin() {
  const handleLoginSubmit = async (dados) => {
    try {

      const headers = {
        'Content-Type': 'application/json',
      };

      const config = {
        headers: headers,
      };

      const response = await API.post('/usuario/login', dados, config);
      console.log('Resposta do login:', response.data);

      sessionStorage.setItem("id", response.data.id);
      sessionStorage.setItem("nome", response.data.nome);
      sessionStorage.setItem("cargo", response.data.cargo);
      sessionStorage.setItem("token", response.data.token);

      window.location.href="/";
      
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
