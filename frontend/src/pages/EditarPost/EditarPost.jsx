import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import API from '../../axios/config';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl } from '../../utils/imageUrl';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  Link as LinkIcon,
  AlertCircle
} from 'lucide-react';
import '../CriarPost/CriarPost.css';

export function EditarPost() {
  const { user, hasPermission, hasRole } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const postId = searchParams.get('id');

  const fileInputRef = useRef(null);

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [autorizado, setAutorizado] = useState(false);

  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [existingImage, setExistingImage] = useState('');

  // Modo de inserção da imagem: 'file' (upload) ou 'url' (manual)
  const [useUrlMode, setUseUrlMode] = useState(false);
  const [manualUrl, setManualUrl] = useState('');

  // Novo arquivo selecionado pelo computador
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) {
        setErro('ID da postagem não informado.');
        setLoadingInitial(false);
        return;
      }

      try {
        const response = await API.get(`/post/${postId}`);
        const post = response.data;

        if (!post) {
          setErro('Postagem não encontrada.');
          setLoadingInitial(false);
          return;
        }

        // Validação de permissões: Autor OU POST_UPDATE OU ROLE_ADMIN
        const isAutor = Boolean(
          user &&
          post.autor &&
          (user.id === post.autor.id || user.nome?.toLowerCase() === post.autor.nome?.toLowerCase())
        );
        const canEditByPermission = Boolean(
          hasPermission('POST_UPDATE') || (hasRole && hasRole('ROLE_ADMIN'))
        );

        if (!isAutor && !canEditByPermission) {
          setErro('Você não tem permissão para editar esta postagem.');
          setAutorizado(false);
          setLoadingInitial(false);
          return;
        }

        setAutorizado(true);
        setTitulo(post.titulo || '');
        setConteudo(post.conteudo || '');
        setExistingImage(post.linkImagem || '');
        if (post.linkImagem && post.linkImagem.startsWith('http')) {
          setManualUrl(post.linkImagem);
        }
      } catch (err) {
        console.error('Erro ao buscar post para edição:', err);
        setErro(err.response?.data?.message || 'Erro ao carregar os dados da postagem.');
      } finally {
        setLoadingInitial(false);
      }
    };

    fetchPost();
  }, [postId, user]);

  const handleFileSelection = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErro('Por favor, selecione um arquivo de imagem válido (PNG, JPG, JPEG, WEBP, GIF).');
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setErro('O arquivo selecionado é muito grande. O limite máximo é de 10MB.');
      return;
    }

    setErro(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    handleFileSelection(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFileSelection(file);
  };

  const handleRemoveNewFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setSucesso(null);

    if (!titulo.trim() || !conteudo.trim()) {
      setErro('Por favor, preencha o título e o conteúdo da postagem.');
      return;
    }

    setLoading(true);

    try {
      let finalImageUrl = existingImage;

      // 1. Se o usuário escolheu um novo arquivo pelo computador
      if (!useUrlMode && selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const uploadResponse = await API.post('/post/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        finalImageUrl = uploadResponse.data?.url || uploadResponse.data;
        if (!finalImageUrl) {
          throw new Error('Falha ao processar o upload da nova imagem.');
        }
      } else if (useUrlMode) {
        if (!manualUrl.trim()) {
          setErro('Por favor, informe a URL da imagem.');
          setLoading(false);
          return;
        }
        finalImageUrl = manualUrl.trim();
      }

      if (!finalImageUrl) {
        setErro('A postagem precisa ter uma imagem de capa.');
        setLoading(false);
        return;
      }

      // 2. Atualiza os dados via PUT
      const dadosPost = {
        titulo: titulo.trim(),
        conteudo: conteudo.trim(),
        linkImagem: finalImageUrl,
      };

      const response = await API.put(`/post/${postId}`, dadosPost);
      setSucesso(response.data || 'Postagem atualizada com sucesso! Redirecionando...');

      setTimeout(() => {
        navigate(`/post?id=${postId}`);
      }, 1200);
    } catch (error) {
      console.error('Erro ao atualizar postagem:', error);
      if (error.response?.status === 403) {
        setErro('Você não possui permissão para editar esta postagem.');
      } else {
        setErro(
          error.response?.data?.message ||
          error.response?.data ||
          'Erro ao atualizar postagem. Verifique os dados e tente novamente.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="criar-post-container">
        <p style={{ textAlign: 'center', color: '#64748b', padding: '40px 0' }}>
          Carregando dados da postagem...
        </p>
      </div>
    );
  }

  if (erro && !autorizado) {
    return (
      <div className="criar-post-container">
        <div className="criar-post-card">
          <div className="criar-post-header">
            <h2>Acesso Não Autorizado</h2>
            <p>Você não possui as permissões necessárias para acessar esta página</p>
          </div>
          <div className="criar-post-body" style={{ textAlign: 'center', padding: '36px 20px' }}>
            <AlertCircle size={40} color="#dc2626" style={{ marginBottom: 14 }} />
            <p style={{ color: '#991b1b', marginBottom: 24, fontSize: '0.95rem' }}>{erro}</p>
            <Link to={postId ? `/post?id=${postId}` : '/'} className="btn-cancelar">
              Voltar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="criar-post-container">
      <div className="criar-post-card">
        <div className="criar-post-header">
          <h2>Editar Postagem</h2>
          <p>Atualize as informações e a capa da publicação</p>
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

            {/* Campo de Upload / Imagem de Capa */}
            <div className="form-field">
              <label>Imagem de Capa *</label>

              {!useUrlMode ? (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleInputChange}
                    style={{ display: 'none' }}
                  />

                  {previewUrl ? (
                    /* Preview do novo arquivo selecionado */
                    <div className="image-preview-container">
                      <div className="image-preview-header">
                        <div className="image-preview-details">
                          <ImageIcon size={16} />
                          <span>{selectedFile?.name}</span>
                          <span style={{ color: '#94a3b8' }}>
                            ({formatFileSize(selectedFile?.size)})
                          </span>
                        </div>

                        <div className="image-preview-actions">
                          <button
                            type="button"
                            className="btn-preview-action trocar"
                            onClick={() => fileInputRef.current?.click()}
                            title="Trocar por outra imagem"
                          >
                            <RefreshCw size={13} /> Trocar
                          </button>
                          <button
                            type="button"
                            className="btn-preview-action remover"
                            onClick={handleRemoveNewFile}
                            title="Cancelar nova imagem"
                          >
                            <Trash2 size={13} /> Cancelar nova
                          </button>
                        </div>
                      </div>

                      <div className="image-preview-display">
                        <img src={previewUrl} alt="Nova capa" />
                      </div>
                    </div>
                  ) : existingImage ? (
                    /* Imagem atual salva no post */
                    <div className="image-preview-container">
                      <div className="image-preview-header">
                        <div className="image-preview-details">
                          <ImageIcon size={16} />
                          <span>Imagem de capa atual</span>
                        </div>

                        <div className="image-preview-actions">
                          <button
                            type="button"
                            className="btn-preview-action trocar"
                            onClick={() => fileInputRef.current?.click()}
                            title="Selecionar nova imagem do computador"
                          >
                            <RefreshCw size={13} /> Substituir pelo computador
                          </button>
                        </div>
                      </div>

                      <div className="image-preview-display">
                        <img
                          src={getImageUrl(existingImage)}
                          alt="Capa atual da postagem"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`image-upload-zone ${isDragging ? 'dragging' : ''}`}
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="upload-icon">
                        <Upload size={24} />
                      </div>
                      <span className="upload-text-main">
                        Clique para selecionar ou arraste uma imagem aqui
                      </span>
                      <span className="upload-text-sub">
                        Formatos aceitos: PNG, JPG, JPEG, WEBP ou GIF (Máx. 10MB)
                      </span>
                    </div>
                  )}

                  <button
                    type="button"
                    className="upload-switch-link"
                    onClick={() => {
                      handleRemoveNewFile();
                      setUseUrlMode(true);
                    }}
                  >
                    <LinkIcon size={12} style={{ display: 'inline', marginRight: 4 }} />
                    Prefere colar um link de imagem (URL)? Clique aqui
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="https://exemplo.com/imagem.jpg"
                    value={manualUrl}
                    onChange={(e) => setManualUrl(e.target.value)}
                  />

                  {manualUrl.trim() && (
                    <div className="image-preview-container" style={{ marginTop: 8 }}>
                      <div className="image-preview-display">
                        <img
                          src={manualUrl}
                          alt="Pré-visualização"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                          onLoad={(e) => {
                            e.target.style.display = 'block';
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    className="upload-switch-link"
                    onClick={() => {
                      setUseUrlMode(false);
                    }}
                  >
                    <Upload size={12} style={{ display: 'inline', marginRight: 4 }} />
                    Voltar para upload do computador
                  </button>
                </>
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
                onClick={() => navigate(`/post?id=${postId}`)}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-publicar"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
