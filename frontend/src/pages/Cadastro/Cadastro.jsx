import React from 'react';
import axios from 'axios';
import { Formulario } from '../../components/FormularioUsuario/Formulario';
import { Link } from 'react-router-dom';
import "./Cadastro.css"

export function PaginaCadastro() {
  const handleCadastroSubmit = async (dados) => {
    try {
      const response = await axios.post('/api/cadastro', dados);
      console.log('Resposta do cadastro:', response.data);
    } catch (error) {
      console.error('Erro no cadastro:', error);
    }
  };

  return (
    <div id='form-container'>
      <div>
        <h2>Cadastro</h2>
        <Formulario onSubmit={handleCadastroSubmit} buttonText="Cadastrar" />
      </div>
      <p>Já está cadastrado? <Link to="/login">Faça o login aqui</Link></p>
    </div>
  );
};
