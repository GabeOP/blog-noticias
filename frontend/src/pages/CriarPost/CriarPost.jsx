import React, { useState, useRef, useEffect } from 'react';
import API from '../../axios/config';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  Link as LinkIcon
} from 'lucide-react';
import './CriarPost.css';

export function CriarPost() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');

  // Modo de inserção da imagem: 'file' (upload do PC) ou 'url' (link manual)
  const [useUrlMode, setUseUrlMode] = useState(false);
  const [manualUrl, setManualUrl] = useState('');

  // Estado do arquivo local
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);

  // Limpa o ObjectURL para evitar memory leak ao trocar/desmontar
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelection = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErro('Por favor, selecione um arquivo de imagem válido (PNG, JPG, JPEG, WEBP, GIF).');
      return;
    }

    // Limite de 10MB
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

  const handleRemoveFile = () => {
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

    let finalImageUrl = '';

    if (useUrlMode) {
      if (!manualUrl.trim()) {
        setErro('Por favor, informe a URL da imagem.');
        return;
      }
      finalImageUrl = manualUrl.trim();
    } else {
      if (!selectedFile) {
        setErro('Por favor, selecione uma imagem do seu computador para a capa da postagem.');
        return;
      }
    }

    setLoading(true);

    try {
      // 1. Se for upload de arquivo, envia primeiro para o backend
      if (!useUrlMode && selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const uploadResponse = await API.post('/post/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        finalImageUrl = uploadResponse.data?.url;
        if (!finalImageUrl) {
          throw new Error('Falha ao processar o upload da imagem.');
        }
      }

      // 2. Cria a postagem com a URL retornada ou manual
      const dadosPost = {
        autor: {
          id: user?.id,
        },
        titulo: titulo.trim(),
        linkImagem: finalImageUrl,
        conteudo: conteudo.trim(),
      };

      const response = await API.post('/post', dadosPost);
      setSucesso(response.data || 'Postagem criada com sucesso! Redirecionando...');

      setTimeout(() => {
        navigate('/');
      }, 1200);
    } catch (error) {
      console.error('Erro ao criar postagem:', error);
      if (error.response?.status === 403) {
        setErro('Você não possui permissão (POST_CREATE) para criar postagens.');
      } else {
        setErro(
          error.response?.data?.message ||
          error.message ||
          'Erro ao criar postagem. Verifique a imagem e tente novamente.'
        );
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

            {/* Campo de Upload da Imagem */}
            <div className="form-field">
              <label>Imagem de Capa *</label>

              {!useUrlMode ? (
                <>
                  {/* Input de arquivo nativo oculto */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleInputChange}
                    style={{ display: 'none' }}
                  />

                  {!selectedFile ? (
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
                  ) : (
                    <div className="image-preview-container">
                      <div className="image-preview-header">
                        <div className="image-preview-details">
                          <ImageIcon size={16} />
                          <span>{selectedFile.name}</span>
                          <span style={{ color: '#94a3b8' }}>
                            ({formatFileSize(selectedFile.size)})
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
                            onClick={handleRemoveFile}
                            title="Remover imagem selecionada"
                          >
                            <Trash2 size={13} /> Remover
                          </button>
                        </div>
                      </div>

                      <div className="image-preview-display">
                        <img src={previewUrl} alt="Pré-visualização da capa" />
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    className="upload-switch-link"
                    onClick={() => {
                      handleRemoveFile();
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
                      setManualUrl('');
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
                {loading ? 'Enviando...' : 'Publicar Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
