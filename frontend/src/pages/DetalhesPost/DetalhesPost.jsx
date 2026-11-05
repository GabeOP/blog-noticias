import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import API from '../../axios/config';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft,
  Calendar,
  User,
  MessageSquare,
  Trash2,
  AlertCircle,
  ChevronsUp
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
  const [upvotingPost, setUpvotingPost] = useState(false);

  const showFeedback = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 4000);
  };

  const sortComments = (comments) => {
    if (!comments || !Array.isArray(comments)) return [];
    return [...comments].sort((a, b) => {
      const upsA = a.upCount != null ? a.upCount : (a.upvotes ? a.upvotes.length : 0);
      const upsB = b.upCount != null ? b.upCount : (b.upvotes ? b.upvotes.length : 0);
      if (upsB !== upsA) {
        return upsB - upsA; // Mais "up" sempre no topo
      }
      const timeA = new Date(a.dataComentario).getTime() || 0;
      const timeB = new Date(b.dataComentario).getTime() || 0;
      return timeB - timeA;
    });
  };

  const fetchPost = async () => {
    if (!postagem_id) {
      setError('ID de postagem não informado.');
      setLoading(false);
      return;
    }

    try {
      const response = await API.get(`/post/${postagem_id}`);
      const postData = response.data;
      if (postData && postData.comentarioList) {
        postData.comentarioList = sortComments(postData.comentarioList);
      }
      setData(postData);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar a postagem.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postagem_id]);

  const handleUpvotePost = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (upvotingPost || !data) return;

    const previouslyUpvoted = Boolean(
      data.upvotes && Array.isArray(data.upvotes) && data.upvotes.includes(user.id)
    );
    const prevCount = data.upCount || 0;

    // Otimista
    const newUpvoted = !previouslyUpvoted;
    const newCount = previouslyUpvoted ? Math.max(0, prevCount - 1) : prevCount + 1;
    const newUpvotes = newUpvoted
      ? [...(data.upvotes || []), user.id]
      : (data.upvotes || []).filter((uid) => uid !== user.id);

    setData((prev) => ({
      ...prev,
      upCount: newCount,
      upvotes: newUpvotes,
    }));
    setUpvotingPost(true);

    try {
      const res = await API.post(`/post/${postagem_id}/up`);
      if (res.data) {
        setData((prev) => ({
          ...prev,
          upCount: res.data.upCount,
          upvotes: res.data.upvoted
            ? [...(prev.upvotes || []).filter((uid) => uid !== user.id), user.id]
            : (prev.upvotes || []).filter((uid) => uid !== user.id),
        }));
      }
    } catch (err) {
      console.error('Erro ao avaliar publicação:', err);
      // Reverter
      setData((prev) => ({
        ...prev,
        upCount: prevCount,
        upvotes: data.upvotes,
      }));
    } finally {
      setUpvotingPost(false);
    }
  };

  const handleUpvoteComentario = async (comentarioId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!data || !data.comentarioList) return;

    // Atualização otimista imediata na lista de comentários
    const updatedList = data.comentarioList.map((c) => {
      if (c.id === comentarioId) {
        const hasUp = Boolean(c.upvotes && c.upvotes.includes(user.id));
        const newUp = !hasUp;
        const currentCount = c.upCount || 0;
        const newCount = hasUp ? Math.max(0, currentCount - 1) : currentCount + 1;
        const newUpvotes = newUp
          ? [...(c.upvotes || []), user.id]
          : (c.upvotes || []).filter((uid) => uid !== user.id);

        return {
          ...c,
          upCount: newCount,
          upvotes: newUpvotes,
        };
      }
      return c;
    });

    // Reordena para que o comentário com mais up suba imediatamente
    setData((prev) => ({
      ...prev,
      comentarioList: sortComments(updatedList),
    }));

    try {
      const res = await API.post(`/comentario/${comentarioId}/up`);
      if (res.data) {
        setData((prev) => {
          const syncedList = (prev.comentarioList || []).map((c) => {
            if (c.id === comentarioId) {
              const newUpvotes = res.data.upvoted
                ? [...(c.upvotes || []).filter((uid) => uid !== user.id), user.id]
                : (c.upvotes || []).filter((uid) => uid !== user.id);

              return {
                ...c,
                upCount: res.data.upCount,
                upvotes: newUpvotes,
              };
            }
            return c;
          });
          return {
            ...prev,
            comentarioList: sortComments(syncedList),
          };
        });
      }
    } catch (err) {
      console.error('Erro ao avaliar comentário:', err);
      // Re-sincroniza do servidor em caso de falha
      fetchPost();
    }
  };

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

  const userHasUpvotedPost = Boolean(
    user && data?.upvotes && Array.isArray(data.upvotes) && data.upvotes.includes(user.id)
  );

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

        {/* Rodapé da Postagem com Upvote */}
        <div className="artigo-rodape">
          <button
            type="button"
            className={`btn-post-upvote ${userHasUpvotedPost ? 'active' : ''}`}
            onClick={handleUpvotePost}
            disabled={upvotingPost}
            title={userHasUpvotedPost ? 'Remover up' : 'Dar up nesta publicação'}
          >
            <ChevronsUp size={18} />
            <span>{data.upCount || 0}</span>
          </button>
        </div>
      </article>

      {/* Seção de Comentários */}
      <section className="comentarios-secao">
        <div className="comentarios-secao-header">
          <h3>
            <MessageSquare size={18} color="rgb(59, 89, 152)" />
            Comentários ({data.comentarioList?.length || 0})
          </h3>
          <span className="comentarios-ordem-aviso">
            Comentários com mais "up" ficam no topo
          </span>
        </div>

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
              const hasUpvotedComment = Boolean(
                user && item.upvotes && Array.isArray(item.upvotes) && item.upvotes.includes(user.id)
              );

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

                  <div className="comentario-footer">
                    <button
                      type="button"
                      className={`btn-comentario-upvote ${hasUpvotedComment ? 'active' : ''}`}
                      onClick={() => handleUpvoteComentario(item.id)}
                      title={hasUpvotedComment ? 'Remover up' : 'Dar up neste comentário'}
                    >
                      <ChevronsUp size={15} />
                      <span>{item.upCount || 0}</span>
                    </button>

                    {podeExcluir && (
                      <button
                        className="btn-deletar-comentario"
                        onClick={() => deletarComentario(item.id)}
                      >
                        <Trash2 size={13} /> Deletar
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
