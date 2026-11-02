import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PostCard } from '../../components/PostCard/PostCard';
import { useAuth } from '../../context/AuthContext';
import API from '../../axios/config';
import {
  PenTool,
  Shield,
  Info,
  ChevronLeft,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import './Home.css';

export function Home() {
  const { user, hasPermission } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { pageNumber } = useParams();
  const navigate = useNavigate();

  const currentPage = parseInt(pageNumber || 0, 10);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await API.get(`/post?page=${currentPage}&size=5`);
        setData(response.data || []);
      } catch (err) {
        setError(err.message);
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, navigate]);

  const handlePrevPage = () => {
    if (currentPage > 0) {
      const prev = currentPage - 1;
      navigate(prev === 0 ? '/' : `/page/${prev}`);
    }
  };

  const handleNextPage = () => {
    navigate(`/page/${currentPage + 1}`);
  };

  return (
    <div className="home-container">
      <div className="home-layout">
        {/* Feed de Notícias */}
        <main className="home-feed">
          {loading ? (
            <div className="home-loading">Carregando postagens...</div>
          ) : error ? (
            <div className="home-empty">Erro ao carregar notícias: {error}</div>
          ) : data.length === 0 ? (
            <div className="home-empty">
              <BookOpen size={36} color="#94a3b8" style={{ marginBottom: 12 }} />
              <p>Nenhuma postagem encontrada nesta página.</p>
              {currentPage > 0 && (
                <button
                  className="pagination-btn"
                  onClick={() => navigate('/')}
                  style={{ marginTop: 12 }}
                >
                  Voltar para o início
                </button>
              )}
            </div>
          ) : (
            data.map((item) => (
              <PostCard
                key={item.id}
                id={item.id}
                titulo={item.titulo}
                conteudo={item.conteudo}
                autor={item.autor?.nome}
                imagem={item.linkImagem}
              />
            ))
          )}

          {/* Paginação */}
          {!loading && (currentPage > 0 || data.length >= 5) && (
            <div className="pagination-container">
              <button
                className="pagination-btn"
                onClick={handlePrevPage}
                disabled={currentPage === 0}
              >
                <ChevronLeft size={16} />
                <span>Anterior</span>
              </button>

              <span className="pagination-indicator">Página {currentPage + 1}</span>

              <button
                className="pagination-btn"
                onClick={handleNextPage}
                disabled={data.length < 5}
              >
                <span>Próxima</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </main>

        {/* Sidebar com utilitários da plataforma */}
        <aside className="home-sidebar">
          <div className="sidebar-card">
            <div className="sidebar-card-header">
              <h3>Sobre a Plataforma</h3>
            </div>
            <div className="sidebar-card-body">
              <p>
                Bem-vindo ao Blog de Notícias. Aqui você encontra as principais atualizações,
                artigos e novidades da nossa comunidade com controle de acesso e moderação.
              </p>
            </div>
          </div>

          <div className="sidebar-card">
            <div className="sidebar-card-header">
              <h3>Acesso Rápido</h3>
            </div>
            <div className="sidebar-card-body">
              <ul className="sidebar-links-list">
                {hasPermission('POST_CREATE') && (
                  <li>
                    <Link to="/adm/criar-post">
                      <PenTool size={16} color="rgb(94, 185, 64)" />
                      <span>Criar Nova Postagem</span>
                    </Link>
                  </li>
                )}

                {hasPermission('USER_READ') && (
                  <li>
                    <Link to="/adm/usuarios">
                      <Shield size={16} color="rgb(59, 89, 152)" />
                      <span>Gerenciar Usuários & IAM</span>
                    </Link>
                  </li>
                )}

                <li>
                  <Link to="/">
                    <BookOpen size={16} color="rgb(130, 145, 182)" />
                    <span>Todas as Postagens</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
