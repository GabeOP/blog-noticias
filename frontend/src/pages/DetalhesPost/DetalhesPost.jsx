import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import API from '../../axios/config';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft,
  Calendar,
  User,
  MessageSquare,
  Trash2,
  AlertCircle
} from 'lucide-react';
import './DetalhesPost.css';

export function DetalhesPost() {
  const { user, hasPermission, hasRole } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const postagem_id = searchParams.get('id');

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comentario, setComentario] = useState('');
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const showFeedback = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 4000);
  };

  const fetchPost = async () => {
    if (!postagem_id) {
      setError('ID de postagem não informado.');
      setLoading(false);
      return;
    }

    try {
      const response = await API.get(`/post/${postagem_id}`);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar a postagem.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postagem_id]);

  const handleComentSubmit = async (e) => {
    e.preventDefault();
    if (!comentario.trim()) return;

    setEnviandoComentario(true);

    const postData = {
      postagem_id: {
        id: postagem_id,
      },
      autorComentario: {
        id: user?.id,
      },
      comentario: comentario.trim(),
    };

    try {
      await API.post('/comentario', postData);
      setComentario('');
      showFeedback('Comentário publicado com sucesso!');
      await fetchPost();
    } catch (err) {
      showFeedback('Erro ao publicar comentário ou sessão expirada.');
    } finally {
      setEnviandoComentario(false);
    }
  };

  const deletarComentario = async (comentarioId) => {
    try {
      await API.delete(`/comentario/${comentarioId}`);
      showFeedback('Comentário removido.');
      await fetchPost();
    } catch (err) {
      console.error('Erro ao deletar comentário', err);
      showFeedback('Você não tem permissão para excluir este comentário.');
    }
  };

  const formatarData = (dataStr) => {
    if (!dataStr) return '';
    try {
      const date = new Date(dataStr);
      if (isNaN(date.getTime())) return dataStr;
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (e) {
      return dataStr;
    }
  };

  if (loading) {
    return (
      <div className="detalhes-post-container">
        <p style={{ textAlign: 'center', color: '#64748b', padding: '40px 0' }}>
          Carregando postagem...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="detalhes-post-container">
        <Link to="/" className="btn-voltar-feed">
          <ArrowLeft size={16} /> Voltar para o início
        </Link>
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#991b1b' }}>
          <AlertCircle size={32} style={{ marginBottom: 10 }} />
          <p>{error || 'Postagem não encontrada.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="detalhes-post-container">
      <Link to="/" className="btn-voltar-feed">
        <ArrowLeft size={16} /> Voltar para o feed
      </Link>

      {feedback && (
        <div
          style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            color: '#1e40af',
            padding: '10px 16px',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '0.9rem',
          }}
        >
          {feedback}
        </div>
      )}

      {/* Artigo Principal */}
      <article className="artigo-card">
        <h1 className="artigo-titulo">{data.titulo}</h1>

        <div className="artigo-meta">
          <span className="artigo-meta-item">
            <User size={15} color="rgb(59, 89, 152)" />
            Por <span className="artigo-autor-destaque">{data.autor?.nome || 'Autor'}</span>
          </span>

          {data.dataPostagem && (
            <span className="artigo-meta-item">
              <Calendar size={15} />
              {formatarData(data.dataPostagem)}
            </span>
          )}
        </div>

        {data.linkImagem && (
          <img
            className="artigo-capa"
            src={data.linkImagem}
            alt={data.titulo}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}

        <div className="artigo-corpo">{data.conteudo}</div>
      </article>

      {/* Seção de Comentários */}
      <section className="comentarios-secao">
        <h3>
          <MessageSquare size={18} color="rgb(59, 89, 152)" />
          Comentários ({data.comentarioList?.length || 0})
        </h3>

        {/* Formulário para novo comentário */}
        <form className="comentario-form" onSubmit={handleComentSubmit}>
          <textarea
            className="comentario-textarea"
            placeholder="Deixe um comentário sobre esta publicação..."
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            required
          />
          <div className="comentario-form-footer">
            <button
              type="submit"
              className="btn-enviar-comentario"
              disabled={enviandoComentario || !comentario.trim()}
            >
              {enviandoComentario ? 'Publicando...' : 'Comentar'}
            </button>
          </div>
        </form>

        {/* Lista de Comentários */}
        <div className="comentarios-lista">
          {!data.comentarioList || data.comentarioList.length === 0 ? (
            <p className="comentarios-vazio">
              Nenhum comentário ainda. Compartilhe sua opinião acima!
            </p>
          ) : (
            data.comentarioList.map((item, index) => {
              const isAutor =
                user &&
                item.autorComentario &&
                (item.autorComentario.id === user.id || item.autorComentario.nome === user.nome);

              const isModerador = Boolean(hasPermission('COMMENT_DELETE') || (hasRole && hasRole('ROLE_ADMIN')));
              const podeExcluir = isAutor || isModerador;

              return (
                <div key={item.id || index} className="comentario-item">
                  <div className="comentario-header">
                    <span className="comentario-autor">
                      {item.autorComentario?.nome || 'Usuário'}
                    </span>
                    <span className="comentario-data">
                      {formatarData(item.dataComentario)}
                    </span>
                  </div>

                  <p className="comentario-texto">{item.comentario}</p>

                  {podeExcluir && (
                    <div className="comentario-acoes">
                      <button
                        className="btn-deletar-comentario"
                        onClick={() => deletarComentario(item.id)}
                      >
                        <Trash2 size={13} /> Deletar
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
