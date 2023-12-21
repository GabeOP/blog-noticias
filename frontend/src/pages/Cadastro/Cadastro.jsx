import React from 'react';
import axios from 'axios';
import { Formulario } from '../../components/FormularioUsuario/Formulario';
import { Link } from 'react-router-dom';
import "./Cadastro.css"
import API from '../../axios/config';

export function PaginaCadastro() {
  const handleCadastroSubmit = async (dados) => {
    try {
      const response = await API.post('/usuario', dados);
      console.log('Resposta do cadastro:', response.data);

      alert(response.data)
    } catch (error) {
      alert('Erro no cadastro: nome de usuário já cadastrado no sistema.');
    }
  };

  return (
    <div id='form-container'>
      <div id='h2-form'>
        <h2>Cadastro</h2>
      </div>
      <div>
        <Formulario onSubmit={handleCadastroSubmit} buttonText="Cadastrar" />
      </div>
      <div>
        <p>Já está cadastrado? <Link to="/login">Faça o login aqui</Link></p>
      </div>
    </div>
  );
};
