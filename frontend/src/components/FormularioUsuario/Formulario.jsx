import React, { useState } from 'react';

export function Formulario({ onSubmit, buttonText, loading }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const isCadastro = buttonText === 'Cadastrar';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome.trim() || !senha.trim() || (isCadastro && !email.trim())) {
      return;
    }

    await onSubmit({ nome, email, senha });
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-field">
        <label htmlFor="auth-nome">Nome de usuário</label>
        <input
          id="auth-nome"
          type="text"
          placeholder="Digite seu nome de usuário"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          autoComplete="username"
        />
      </div>

      {isCadastro && (
        <div className="auth-field">
          <label htmlFor="auth-email">E-mail</label>
          <input
            id="auth-email"
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
      )}

      <div className="auth-field">
        <label htmlFor="auth-senha">Senha</label>
        <input
          id="auth-senha"
          type="password"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          autoComplete={isCadastro ? 'new-password' : 'current-password'}
        />
      </div>

      <button className="auth-submit-btn" type="submit" disabled={loading}>
        {loading ? 'Processando...' : buttonText}
      </button>
    </form>
  );
}
