import React, { useState } from 'react';

export function Formulario({ onSubmit, buttonText }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await onSubmit({ nome, email, senha });
      setNome('');
      setEmail('');
      setSenha('');
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
    }
  };

  return (
    <form id="form-usuario" onSubmit={handleSubmit}>
      <label>
        Nome do usuário
        <input placeholder='Digite o nome de usuário' type="nome" value={nome} onChange={(e) => setNome(e.target.value)} />
      </label>
      
      {buttonText === "Cadastrar" ? (
        <>
          <label>
          E-mail
          <input placeholder='Digite o seu e-mail' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
        </>
      ) : null}
      
      <label>
        Senha
        <input placeholder='Digite a sua senha' type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
      </label>
      <button id='btnForm' type="submit">{buttonText}</button>
    </form>
  );
};
