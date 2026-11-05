import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Image, ArrowRight, Calendar, ChevronsUp, Edit3, Trash2 } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUrl';
import { useAuth } from '../../context/AuthContext';
import { ConfirmPopover } from '../ConfirmPopover/ConfirmPopover';
import API from '../../axios/config';
import './PostCard.css';

export function PostCard({
  id,
  titulo,
  imagem,
  conteudo,
  autor,
  dataPostagem,
  upCount = 0,
  upvotes = [],
  onDelete,
}) {
  const { user, hasPermission, hasRole } = useAuth();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [count, setCount] = useState(upCount || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [loadingUpvote, setLoadingUpvote] = useState(false);

  // Confirmação de exclusão sem alert nativo
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setCount(upCount || 0);
  }, [upCount]);

  useEffect(() => {
    if (user && upvotes && Array.isArray(upvotes)) {
      setHasUpvoted(upvotes.includes(user.id));
    } else {
      setHasUpvoted(false);
    }
  }, [user, upvotes]);

  const handleUpvote = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    if (loadingUpvote) return;

    const previousHasUpvoted = hasUpvoted;
    const previousCount = count;

    // Atualização otimista imediata
    setHasUpvoted(!previousHasUpvoted);
    setCount((prev) => (previousHasUpvoted ? Math.max(0, prev - 1) : prev + 1));
    setLoadingUpvote(true);

    try {
      const response = await API.post(`/post/${id}/up`);
      if (response.data) {
        setCount(response.data.upCount);
        setHasUpvoted(response.data.upvoted);
      }
    } catch (err) {
      console.error('Erro ao avaliar publicação:', err);
      // Reverte em caso de erro
      setHasUpvoted(previousHasUpvoted);
      setCount(previousCount);
    } finally {
      setLoadingUpvote(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await API.delete(`/post/${id}`);
      setShowConfirmDelete(false);
      if (onDelete) {
        onDelete(id);
      }
    } catch (err) {
      console.error('Erro ao excluir postagem:', err);
      alert('Você não tem permissão para excluir esta postagem.');
      setShowConfirmDelete(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatarData = (dataVal) => {
    if (!dataVal) return null;
    try {
      let date;
      if (Array.isArray(dataVal)) {
        date = new Date(
          dataVal[0],
          dataVal[1] - 1,
          dataVal[2],
          dataVal[3] || 0,
          dataVal[4] || 0
        );
      } else {
        date = new Date(dataVal);
      }
      if (isNaN(date.getTime())) return String(dataVal);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (e) {
      return String(dataVal);
    }
  };

  const dataFormatada = formatarData(dataPostagem);

  const autorObj = typeof autor === 'object' && autor !== null ? autor : null;
  const autorNome = autorObj ? autorObj.nome : (typeof autor === 'string' ? autor : null);

  const isAutor = Boolean(
    user &&
    ((autorObj?.id && user.id === autorObj.id) ||
     (autorNome && user.nome?.toLowerCase() === autorNome.toLowerCase()))
  );
  const podeEditar = isAutor || hasPermission('POST_UPDATE') || (hasRole && hasRole('ROLE_ADMIN'));
  const podeExcluir = isAutor || hasPermission('POST_DELETE') || (hasRole && hasRole('ROLE_ADMIN'));

  return (
    <article className="post-card">
      <div className="post-card-thumb">
        {imagem && !imageError ? (
          <img
            src={getImageUrl(imagem)}
            alt={titulo}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="post-card-thumb-placeholder">
            <Image size={32} />
            <span>Notícia</span>
          </div>
        )}
      </div>

      <div className="post-card-content">
        <div className="post-card-header">
          <h2 className="post-card-title">
            <Link to={`/post?id=${id}`}>{titulo}</Link>
          </h2>
          <p className="post-card-snippet">{conteudo}</p>
        </div>

        <div className="post-card-footer">
          <div className="post-card-meta">
            <button
              type="button"
              className={`btn-card-upvote ${hasUpvoted ? 'active' : ''}`}
              onClick={handleUpvote}
              title={hasUpvoted ? 'Remover up' : 'Dar up nesta publicação'}
            >
              <ChevronsUp size={15} />
              <span>{count}</span>
            </button>

            <span className="post-card-author">
              Por <strong>{autorNome || 'Autor desconhecido'}</strong>
            </span>

            {dataFormatada && (
              <span className="post-card-date">
                <Calendar size={13} />
                {dataFormatada}
              </span>
            )}
          </div>

          <div className="post-card-right">
            {(podeEditar || podeExcluir) && (
              <div className="post-card-author-actions">
                {podeEditar && (
                  <Link
                    to={`/post/editar?id=${id}`}
                    className="btn-card-action edit"
                    title="Editar postagem"
                  >
                    <Edit3 size={13} />
                  </Link>
                )}
                {podeExcluir && (
                  <div style={{ position: 'relative', display: 'inline-flex' }}>
                    <button
                      type="button"
                      className="btn-card-action delete"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowConfirmDelete(!showConfirmDelete);
                      }}
                      title="Excluir postagem"
                    >
                      <Trash2 size={13} />
                    </button>

                    <ConfirmPopover
                      isOpen={showConfirmDelete}
                      onClose={() => setShowConfirmDelete(false)}
                      onConfirm={handleDeleteConfirm}
                      loading={isDeleting}
                      title="Excluir postagem?"
                      description="A publicação será excluída permanentemente."
                      confirmText="Sim, excluir"
                      cancelText="Cancelar"
                      align="top-right"
                    />
                  </div>
                )}
              </div>
            )}

            <Link to={`/post?id=${id}`} className="post-card-readmore">
              Ler mais <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
