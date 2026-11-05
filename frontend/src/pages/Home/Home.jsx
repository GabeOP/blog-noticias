import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PostCard } from '../../components/PostCard/PostCard';
import { useAuth } from '../../context/AuthContext';
import API from '../../axios/config';
import {
  PenTool,
  Shield,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Search,
  ArrowUpDown,
  X
} from 'lucide-react';
import './Home.css';

export function Home() {
  const { user, hasPermission } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros: busca por título e ordenação cronológica
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDirection, setSortDirection] = useState('DESC'); // 'DESC' = mais recente | 'ASC' = mais antigo

  const { pageNumber } = useParams();
  const navigate = useNavigate();
  const currentPage = parseInt(pageNumber || 0, 10);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const searchParam = searchQuery.trim()
          ? `&search=${encodeURIComponent(searchQuery.trim())}`
          : '';

        const response = await API.get(
          `/post?page=${currentPage}&size=10&direction=${sortDirection}${searchParam}`
        );
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
  }, [currentPage, sortDirection, searchQuery, navigate]);

  const parsePostDate = (dataVal) => {
    if (!dataVal) return 0;
    if (Array.isArray(dataVal)) {
      return new Date(
        dataVal[0],
        dataVal[1] - 1,
        dataVal[2],
        dataVal[3] || 0,
        dataVal[4] || 0
      ).getTime();
    }
    const t = new Date(dataVal).getTime();
    return isNaN(t) ? 0 : t;
  };

  // Garante ordenação e filtragem reativas instantâneas
  const displayedPosts = useMemo(() => {
    let result = [...data];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.titulo?.toLowerCase().includes(q) ||
          p.conteudo?.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      const timeA = parsePostDate(a.dataPostagem);
      const timeB = parsePostDate(b.dataPostagem);

      if (timeA !== timeB) {
        return sortDirection === 'DESC' ? timeB - timeA : timeA - timeB;
      }
      return 0;
    });

    return result;
  }, [data, searchQuery, sortDirection]);

  const handleToggleSort = () => {
    setSortDirection((prev) => (prev === 'DESC' ? 'ASC' : 'DESC'));
    if (currentPage > 0) {
      navigate('/');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (currentPage > 0) {
      navigate('/');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (currentPage > 0) {
      navigate('/');
    }
  };

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
          {/* Barra de Filtros e Busca */}
          <div className="home-toolbar">
            <div className="home-search-box">
              <Search size={18} color="#94a3b8" />
              <input
                type="text"
                placeholder="Buscar postagens por título..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="btn-clear-search"
                  onClick={handleClearSearch}
                  title="Limpar busca"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <button
              type="button"
              className="btn-sort-toggle"
              onClick={handleToggleSort}
              title="Alternar ordem de exibição"
            >
              <ArrowUpDown size={16} />
              <span>
                {sortDirection === 'DESC'
                  ? 'Mais recentes primeiro'
                  : 'Mais antigos primeiro'}
              </span>
            </button>
          </div>

          {loading ? (
            <div className="home-loading">Carregando postagens...</div>
          ) : error ? (
            <div className="home-empty">Erro ao carregar notícias: {error}</div>
          ) : displayedPosts.length === 0 ? (
            <div className="home-empty">
              <BookOpen size={36} color="#94a3b8" style={{ marginBottom: 12 }} />
              {searchQuery ? (
                <>
                  <p>Nenhuma postagem encontrada para "{searchQuery}".</p>
                  <button
                    className="pagination-btn"
                    onClick={handleClearSearch}
                    style={{ marginTop: 12 }}
                  >
                    Limpar busca
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          ) : (
            displayedPosts.map((item) => (
              <PostCard
                key={item.id}
                id={item.id}
                titulo={item.titulo}
                conteudo={item.conteudo}
                autor={item.autor?.nome}
                imagem={item.linkImagem}
                dataPostagem={item.dataPostagem}
                upCount={item.upCount}
                upvotes={item.upvotes}
              />
            ))
          )}

          {/* Paginação */}
          {!loading && (currentPage > 0 || data.length >= 10) && (
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
                disabled={data.length < 10}
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
