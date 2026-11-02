import React, { useState } from 'react';
import API from '../../axios/config';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './CriarPost.css';

export function CriarPost() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState('');
  const [imagem, setImagem] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setSucesso(null);

    if (!titulo.trim() || !conteudo.trim()) {
      setErro('Por favor, preencha o título e o conteúdo da postagem.');
      return;
    }

    setLoading(true);

    const dados = {
      autor: {
        id: user?.id,
      },
      titulo: titulo.trim(),
      linkImagem: imagem.trim(),
      conteudo: conteudo.trim(),
    };

    try {
      const response = await API.post('/post', dados);
      setSucesso(response.data || 'Postagem criada com sucesso! Redirecionando...');
      setTimeout(() => {
        navigate('/');
      }, 1200);
    } catch (error) {
      if (error.response?.status === 403) {
        setErro('Você não possui permissão (POST_CREATE) para criar postagens.');
      } else {
        setErro('Erro ao criar postagem. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="criar-post-container">
      <div className="criar-post-card">
        <div className="criar-post-header">
          <h2>Nova Postagem</h2>
          <p>Compartilhe novidades e informações com os leitores</p>
        </div>

        <div className="criar-post-body">
          {erro && <div className="criar-post-alert error">{erro}</div>}
          {sucesso && <div className="criar-post-alert success">{sucesso}</div>}

          <form className="criar-post-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="titulo">Título da Postagem *</label>
              <input
                id="titulo"
                type="text"
                placeholder="Ex: Lançamento da nova versão do sistema..."
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="imagem">Link da Imagem de Capa (URL)</label>
              <input
                id="imagem"
                type="text"
                placeholder="https://exemplo.com/imagem.jpg"
                value={imagem}
                onChange={(e) => setImagem(e.target.value)}
              />
              {imagem.trim() && (
                <div className="image-preview-box">
                  <img
                    src={imagem}
                    alt="Pré-visualização"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                    onLoad={(e) => {
                      e.target.style.display = 'block';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="conteudo">Conteúdo da Postagem *</label>
              <textarea
                id="conteudo"
                placeholder="Escreva o texto completo da postagem aqui..."
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
                required
              />
            </div>

            <div className="criar-post-actions">
              <button
                type="button"
                className="btn-cancelar"
                onClick={() => navigate('/')}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-publicar"
                disabled={loading}
              >
                {loading ? 'Publicando...' : 'Publicar Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
