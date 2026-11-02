import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Image, ArrowRight } from 'lucide-react';
import './PostCard.css';

export function PostCard({ id, titulo, imagem, conteudo, autor }) {
  const [imageError, setImageError] = useState(false);

  return (
    <article className="post-card">
      <div className="post-card-thumb">
        {imagem && !imageError ? (
          <img
            src={imagem}
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
          <span className="post-card-author">
            Por <strong>{autor || 'Autor desconhecido'}</strong>
          </span>

          <Link to={`/post?id=${id}`} className="post-card-readmore">
            Ler mais <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
