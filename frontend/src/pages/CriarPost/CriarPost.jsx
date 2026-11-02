import React, { useState } from 'react';
import API from '../../axios/config';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import "./CriarPost.css";

export function CriarPost() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState('');
  const [imagem, setImagem] = useState('');
  const [conteudo, setConteudo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dados = {
      autor: {
        id: user?.id,
      },
      titulo: titulo,
      linkImagem: imagem,
      conteudo: conteudo,
    };

    try {
      const response = await API.post("/post", dados);
      alert(response.data);
      navigate('/');
    } catch (error) {
      if (error.response?.status === 403) {
        alert("Você não possui permissão para criar postagens.");
      } else {
        alert("Erro ao criar postagem.");
      }
    }
  };

  return (
    <form id='form-criar-post' onSubmit={handleSubmit}>
      <h1>Criar nova postagem</h1>
      <div id='titulo-criar-post'>
        <label htmlFor="titulo">Título:</label>
        <input
          type="text"
          name="titulo"
          placeholder='Digite o título'
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
      </div>
      <div id='imagem-criar-post'>
        <label htmlFor="imagem">Imagem:</label>
        <input
          type="text"
          name="linkImagem"
          placeholder='Cole a URL da imagem'
          value={imagem}
          onChange={(e) => setImagem(e.target.value)}
        />
      </div>
      <div id='conteudo-criar-post'>
        <label htmlFor="conteudo">Conteúdo:</label>
        <textarea
          name="conteudo"
          placeholder='Digite o conteúdo da postagem'
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          required
        />
      </div>
      <button type="submit">Criar post</button>
    </form>
  );
}
