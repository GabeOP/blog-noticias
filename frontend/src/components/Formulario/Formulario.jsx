import React, { useState } from 'react';
import "./Formulario.css"

export function Formulario({ onSubmit, buttonText }) {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await onSubmit({ nome, senha });
      setNome('');
      setSenha('');
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nome:
        <input type="nome" value={nome} onChange={(e) => setNome(e.target.value)} />
      </label>
      <label>
        Senha:
        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
      </label>
      <button type="submit">{buttonText}</button>
    </form>
  );
};
