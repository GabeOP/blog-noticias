import React, { useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  FileCode,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  Highlighter,
  Table,
  Eye,
  Edit3,
  Columns,
  HelpCircle,
  Upload,
  X
} from 'lucide-react';
import API from '../../axios/config';
import { MarkdownContent } from '../MarkdownContent/MarkdownContent';
import './MarkdownEditor.css';

export function MarkdownEditor({
  id = 'conteudo',
  value = '',
  onChange,
  placeholder = 'Escreva o conteúdo da postagem usando Markdown...',
  required = false,
}) {
  const textareaRef = useRef(null);
  const inlineImageInputRef = useRef(null);

  // Modos: 'write' | 'split' | 'preview'
  const [viewMode, setViewMode] = useState('write');
  const [showHelp, setShowHelp] = useState(false);

  // Sub-painel para inserir Link
  const [activePopover, setActivePopover] = useState(null); // 'link' | 'image' | null
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  // Sub-painel para inserir Imagem no corpo
  const [imgAlt, setImgAlt] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [uploadingInlineImg, setUploadingInlineImg] = useState(false);
  const [inlineImgError, setInlineImgError] = useState(null);

  // Salva a seleção atual do textarea antes de abrir o popover
  const selectionRef = useRef({ start: 0, end: 0 });

  const updateValue = (newValue, selectionStart, selectionEnd) => {
    onChange(newValue);
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (el) {
        el.focus();
        if (typeof selectionStart === 'number' && typeof selectionEnd === 'number') {
          el.setSelectionRange(selectionStart, selectionEnd);
        }
      }
    });
  };

  /**
   * Envolve o texto selecionado com prefixo e sufixo (ex: **texto**)
   */
  const wrapSelection = (prefix, suffix = prefix, defaultText = 'texto') => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end);

    // Se já estiver envolvido pelo marcador, remove-o (toggle)
    const before = value.slice(Math.max(0, start - prefix.length), start);
    const after = value.slice(end, end + suffix.length);
    if (before === prefix && after === suffix && selected.length > 0) {
      const nextVal =
        value.slice(0, start - prefix.length) +
        selected +
        value.slice(end + suffix.length);
      updateValue(nextVal, start - prefix.length, end - prefix.length);
      return;
    }

    const contentToWrap = selected || defaultText;
    const nextValue =
      value.slice(0, start) + prefix + contentToWrap + suffix + value.slice(end);

    const newCursorStart = start + prefix.length;
    const newCursorEnd = newCursorStart + contentToWrap.length;
    updateValue(nextValue, newCursorStart, newCursorEnd);
  };

  /**
   * Aplica prefixo de linha (ex: # , ## , - , 1. , > )
   */
  const toggleLinePrefix = (prefix, placeholderText = 'Texto') => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;

    // Encontra o início da primeira linha selecionada e o fim da última linha
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const lineEndIdx = value.indexOf('\n', end);
    const lineEnd = lineEndIdx === -1 ? value.length : lineEndIdx;

    const selectedLinesBlock = value.slice(lineStart, lineEnd);
    const lines = selectedLinesBlock.split('\n');

    const transformedLines = lines.map((line, index) => {
      if (prefix === '1. ') {
        const numberedRegex = /^\d+\.\s+/;
        if (numberedRegex.test(line)) {
          return line.replace(numberedRegex, '');
        }
        return `${index + 1}. ${line || placeholderText}`;
      }

      if (line.startsWith(prefix)) {
        return line.slice(prefix.length);
      }

      // Se for título (#, ##, ###), substitui outro nível de título existente
      if (/^#{1,6}\s$/.test(prefix)) {
        const cleanLine = line.replace(/^#{1,6}\s+/, '');
        return `${prefix}${cleanLine || placeholderText}`;
      }

      return `${prefix}${line || placeholderText}`;
    });

    const replacement = transformedLines.join('\n');
    const nextValue =
      value.slice(0, lineStart) + replacement + value.slice(lineEnd);

    updateValue(nextValue, lineStart, lineStart + replacement.length);
  };

  /**
   * Insere um bloco (como bloco de código, divisor ou tabela)
   */
  const insertBlock = (blockTemplate, selectOffsetStart = 0, selectLength = 0) => {
    const el = textareaRef.current;
    const start = el ? el.selectionStart : value.length;
    const end = el ? el.selectionEnd : value.length;

    const needsLeadingNewline = start > 0 && value[start - 1] !== '\n';
    const needsTrailingNewline = end < value.length && value[end] !== '\n';

    const prefix = needsLeadingNewline ? '\n\n' : '';
    const suffix = needsTrailingNewline ? '\n\n' : '\n';

    const fullInsert = `${prefix}${blockTemplate}${suffix}`;
    const nextValue = value.slice(0, start) + fullInsert + value.slice(end);

    const cursorStart = start + prefix.length + selectOffsetStart;
    const cursorEnd = cursorStart + selectLength;
    updateValue(nextValue, cursorStart, cursorEnd);
  };

  const handleInsertCodeBlock = () => {
    const el = textareaRef.current;
    const selected = el ? value.slice(el.selectionStart, el.selectionEnd) : '';
    const codeText = selected || '// Digite seu código aqui';
    const template = `\`\`\`javascript\n${codeText}\n\`\`\``;
    insertBlock(template, 14, codeText.length);
  };

  const handleInsertTable = () => {
    const template =
      '| Coluna 1 | Coluna 2 | Coluna 3 |\n| --- | --- | --- |\n| Item A | Item B | Item C |';
    insertBlock(template, 2, 8);
  };

  const handleOpenLinkPopover = () => {
    const el = textareaRef.current;
    if (el) {
      selectionRef.current = { start: el.selectionStart, end: el.selectionEnd };
      const selected = value.slice(el.selectionStart, el.selectionEnd);
      setLinkText(selected || '');
    } else {
      selectionRef.current = { start: value.length, end: value.length };
      setLinkText('');
    }
    setLinkUrl('https://');
    setActivePopover(activePopover === 'link' ? null : 'link');
  };

  const handleConfirmLink = () => {
    if (!linkUrl.trim()) return;
    const { start, end } = selectionRef.current;
    const label = linkText.trim() || linkUrl.trim();
    const markdownLink = `[${label}](${linkUrl.trim()})`;
    const nextValue = value.slice(0, start) + markdownLink + value.slice(end);

    setActivePopover(null);
    setLinkText('');
    setLinkUrl('');
    updateValue(nextValue, start + markdownLink.length, start + markdownLink.length);
  };

  const handleOpenImagePopover = () => {
    const el = textareaRef.current;
    if (el) {
      selectionRef.current = { start: el.selectionStart, end: el.selectionEnd };
      const selected = value.slice(el.selectionStart, el.selectionEnd);
      setImgAlt(selected || '');
    } else {
      selectionRef.current = { start: value.length, end: value.length };
      setImgAlt('');
    }
    setImgUrl('');
    setInlineImgError(null);
    setActivePopover(activePopover === 'image' ? null : 'image');
  };

  const handleConfirmImage = (customUrl) => {
    const finalUrl = (customUrl || imgUrl).trim();
    if (!finalUrl) return;
    const { start, end } = selectionRef.current;
    const alt = imgAlt.trim() || 'Imagem';
    const needsNewline = start > 0 && value[start - 1] !== '\n' ? '\n' : '';
    const markdownImg = `${needsNewline}![${alt}](${finalUrl})\n`;
    const nextValue = value.slice(0, start) + markdownImg + value.slice(end);

    setActivePopover(null);
    setImgAlt('');
    setImgUrl('');
    setInlineImgError(null);
    updateValue(nextValue, start + markdownImg.length, start + markdownImg.length);
  };

  const handleInlineImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setInlineImgError('Selecione um arquivo de imagem válido.');
      return;
    }

    setUploadingInlineImg(true);
    setInlineImgError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await API.post('/post/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const uploadedUrl = response.data?.url || response.data;
      if (uploadedUrl) {
        handleConfirmImage(uploadedUrl);
      } else {
        setInlineImgError('Não foi possível obter a URL da imagem enviada.');
      }
    } catch (err) {
      setInlineImgError('Falha ao enviar imagem. Tente novamente ou use uma URL.');
    } finally {
      setUploadingInlineImg(false);
      if (inlineImageInputRef.current) {
        inlineImageInputRef.current.value = '';
      }
    }
  };

  /**
   * Atalhos de teclado (Ctrl+B, Ctrl+I, Ctrl+K, Tab e auto-continuação de listas no Enter)
   */
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
      const key = e.key.toLowerCase();
      if (key === 'b') {
        e.preventDefault();
        wrapSelection('**', '**', 'texto em negrito');
        return;
      }
      if (key === 'i') {
        e.preventDefault();
        wrapSelection('*', '*', 'texto em itálico');
        return;
      }
      if (key === 'k') {
        e.preventDefault();
        handleOpenLinkPopover();
        return;
      }
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.target;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const nextValue = value.slice(0, start) + '  ' + value.slice(end);
      updateValue(nextValue, start + 2, start + 2);
      return;
    }

    // Continuação inteligente de listas ao pressionar Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      const el = e.target;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      if (start !== end) return;

      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const currentLine = value.slice(lineStart, start);

      const taskMatch = /^(\s*[-*+]\s+\[[ xX]\]\s+)(.*)$/.exec(currentLine);
      const bulletMatch = !taskMatch && /^(\s*[-*+]\s+)(.*)$/.exec(currentLine);
      const numberedMatch = /^(\s*)(\d+)\.\s+(.*)$/.exec(currentLine);

      if (taskMatch) {
        e.preventDefault();
        if (!taskMatch[2].trim()) {
          // Linha vazia da lista -> sai da lista
          const nextValue = value.slice(0, lineStart) + '\n' + value.slice(start);
          updateValue(nextValue, lineStart + 1, lineStart + 1);
        } else {
          const insert = '\n- [ ] ';
          const nextValue = value.slice(0, start) + insert + value.slice(end);
          updateValue(nextValue, start + insert.length, start + insert.length);
        }
      } else if (bulletMatch) {
        e.preventDefault();
        if (!bulletMatch[2].trim()) {
          const nextValue = value.slice(0, lineStart) + '\n' + value.slice(start);
          updateValue(nextValue, lineStart + 1, lineStart + 1);
        } else {
          const insert = `\n${bulletMatch[1]}`;
          const nextValue = value.slice(0, start) + insert + value.slice(end);
          updateValue(nextValue, start + insert.length, start + insert.length);
        }
      } else if (numberedMatch) {
        e.preventDefault();
        if (!numberedMatch[3].trim()) {
          const nextValue = value.slice(0, lineStart) + '\n' + value.slice(start);
          updateValue(nextValue, lineStart + 1, lineStart + 1);
        } else {
          const nextNum = parseInt(numberedMatch[2], 10) + 1;
          const insert = `\n${numberedMatch[1]}${nextNum}. `;
          const nextValue = value.slice(0, start) + insert + value.slice(end);
          updateValue(nextValue, start + insert.length, start + insert.length);
        }
      }
    }
  };

  // Contadores de palavras e caracteres
  const charCount = value.length;
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div className="md-editor-wrapper">
      {/* Barra de Ferramentas */}
      <div className="md-editor-toolbar">
        <div className="md-toolbar-groups">
          {/* Grupo: Títulos */}
          <div className="md-toolbar-group">
            <button
              type="button"
              className="md-tool-btn"
              onClick={() => toggleLinePrefix('# ', 'Título principal')}
              title="Título 1 (#)"
              disabled={viewMode === 'preview'}
            >
              <Heading1 size={16} />
            </button>
            <button
              type="button"
              className="md-tool-btn"
              onClick={() => toggleLinePrefix('## ', 'Subtítulo')}
              title="Título 2 (##)"
              disabled={viewMode === 'preview'}
            >
              <Heading2 size={16} />
            </button>
            <button
              type="button"
              className="md-tool-btn"
              onClick={() => toggleLinePrefix('### ', 'Seção')}
              title="Título 3 (###)"
              disabled={viewMode === 'preview'}
            >
              <Heading3 size={16} />
            </button>
          </div>

          <span className="md-toolbar-divider" />

          {/* Grupo: Formatação de texto */}
          <div className="md-toolbar-group">
            <button
              type="button"
              className="md-tool-btn"
              onClick={() => wrapSelection('**', '**', 'texto em negrito')}
              title="Negrito (Ctrl+B)"
              disabled={viewMode === 'preview'}
            >
              <Bold size={15} />
            </button>
            <button
              type="button"
              className="md-tool-btn"
              onClick={() => wrapSelection('*', '*', 'texto em itálico')}
              title="Itálico (Ctrl+I)"
              disabled={viewMode === 'preview'}
            >
              <Italic size={15} />
            </button>
            <button
              type="button"
              className="md-tool-btn"
              onClick={() => wrapSelection('~~', '~~', 'texto riscado')}
              title="Tachado (~~)"
              disabled={viewMode === 'preview'}
            >
              <Strikethrough size={15} />
            </button>
            <button
              type="button"
              className="md-tool-btn"
              onClick={() => wrapSelection('==', '==', 'texto destacado')}
              title="Destaque / Marca-texto (==)"
              disabled={viewMode === 'preview'}
            >
              <Highlighter size={15} />
            </button>
          </div>

          <span className="md-toolbar-divider" />

          {/* Grupo: Listas e Citação */}
          <div className="md-toolbar-group">
            <button
              type="button"
              className="md-tool-btn"
              onClick={() => toggleLinePrefix('- ', 'Item da lista')}
              title="Lista com marcadores"
              disabled={viewMode === 'preview'}
            >
              <List size={16} />
            </button>
            <button
              type="button"
              className="md-tool-btn"
              onClick={() => toggleLinePrefix('1. ', 'Item numerado')}
              title="Lista numerada"
              disabled={viewMode === 'preview'}
            >
              <ListOrdered size={16} />
            </button>
            <button
              type="button"
              className="md-tool-btn"
              onClick={() => toggleLinePrefix('- [ ] ', 'Tarefa')}
              title="Lista de tarefas"
              disabled={viewMode === 'preview'}
            >
              <CheckSquare size={15} />
            </button>
            <button
              type="button"
              className="md-tool-btn"
              onClick={() => toggleLinePrefix('> ', 'Citação em destaque')}
              title="Bloco de citação (>)"
              disabled={viewMode === 'preview'}
            >
              <Quote size={15} />
            </button>
          </div>

          <span className="md-toolbar-divider" />

          {/* Grupo: Código, Links, Imagens, Tabela e Divisor */}
          <div className="md-toolbar-group">
            <button
              type="button"
              className={`md-tool-btn ${activePopover === 'link' ? 'active' : ''}`}
              onClick={handleOpenLinkPopover}
              title="Inserir Link (Ctrl+K)"
              disabled={viewMode === 'preview'}
            >
              <LinkIcon size={15} />
            </button>
            <button
              type="button"
              className={`md-tool-btn ${activePopover === 'image' ? 'active' : ''}`}
              onClick={handleOpenImagePopover}
              title="Inserir Imagem no corpo do texto"
              disabled={viewMode === 'preview'}
            >
              <ImageIcon size={15} />
            </button>
            <button
              type="button"
              className="md-tool-btn"
              onClick={() => wrapSelection('`', '`', 'código')}
              title="Código inline (`)"
              disabled={viewMode === 'preview'}
            >
              <Code size={15} />
            </button>
            <button
              type="button"
              className="md-tool-btn"
              onClick={handleInsertCodeBlock}
              title="Bloco de código (```)"
              disabled={viewMode === 'preview'}
            >
              <FileCode size={15} />
            </button>
            <button
              type="button"
              className="md-tool-btn"
              onClick={handleInsertTable}
              title="Inserir Tabela"
              disabled={viewMode === 'preview'}
            >
              <Table size={15} />
            </button>
            <button
              type="button"
              className="md-tool-btn"
              onClick={() => insertBlock('---')}
              title="Linha divisória horizontal (---)"
              disabled={viewMode === 'preview'}
            >
              <Minus size={15} />
            </button>
          </div>
        </div>

        {/* Alternador de modo de visualização */}
        <div className="md-view-switcher">
          <button
            type="button"
            className={`md-mode-btn ${viewMode === 'write' ? 'active' : ''}`}
            onClick={() => setViewMode('write')}
            title="Apenas editor"
          >
            <Edit3 size={13} />
            <span>Escrever</span>
          </button>
          <button
            type="button"
            className={`md-mode-btn md-mode-split ${viewMode === 'split' ? 'active' : ''}`}
            onClick={() => setViewMode('split')}
            title="Editor e visualização lado a lado"
          >
            <Columns size={13} />
            <span>Dividido</span>
          </button>
          <button
            type="button"
            className={`md-mode-btn ${viewMode === 'preview' ? 'active' : ''}`}
            onClick={() => setViewMode('preview')}
            title="Pré-visualizar formatação"
          >
            <Eye size={13} />
            <span>Visualizar</span>
          </button>
        </div>
      </div>

      {/* Barra auxiliar para inserir Link */}
      {activePopover === 'link' && viewMode !== 'preview' && (
        <div className="md-inline-popover">
          <div className="md-popover-row">
            <input
              type="text"
              placeholder="Texto do link (ex: Leia o artigo)"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
            />
            <input
              type="text"
              placeholder="URL (https://...)"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleConfirmLink();
                }
              }}
            />
            <button
              type="button"
              className="md-popover-btn confirm"
              onClick={handleConfirmLink}
            >
              Inserir Link
            </button>
            <button
              type="button"
              className="md-popover-btn close"
              onClick={() => setActivePopover(null)}
              title="Fechar"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Barra auxiliar para inserir Imagem no corpo do post */}
      {activePopover === 'image' && viewMode !== 'preview' && (
        <div className="md-inline-popover">
          <div className="md-popover-row">
            <input
              type="text"
              placeholder="Legenda / descrição da imagem (opcional)"
              value={imgAlt}
              onChange={(e) => setImgAlt(e.target.value)}
            />
            <input
              type="text"
              placeholder="Cole a URL da imagem (https://...)"
              value={imgUrl}
              onChange={(e) => setImgUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleConfirmImage();
                }
              }}
            />
            <button
              type="button"
              className="md-popover-btn confirm"
              onClick={() => handleConfirmImage()}
              disabled={!imgUrl.trim()}
            >
              Inserir URL
            </button>

            <input
              type="file"
              ref={inlineImageInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleInlineImageUpload}
            />
            <button
              type="button"
              className="md-popover-btn upload"
              onClick={() => inlineImageInputRef.current?.click()}
              disabled={uploadingInlineImg}
            >
              <Upload size={13} />
              {uploadingInlineImg ? 'Enviando...' : 'Enviar do PC'}
            </button>

            <button
              type="button"
              className="md-popover-btn close"
              onClick={() => setActivePopover(null)}
              title="Fechar"
            >
              <X size={14} />
            </button>
          </div>
          {inlineImgError && (
            <div className="md-popover-error">{inlineImgError}</div>
          )}
        </div>
      )}

      {/* Área Principal (Editor / Split / Preview) */}
      <div className={`md-editor-body mode-${viewMode}`}>
        {viewMode !== 'preview' && (
          <textarea
            id={id}
            ref={textareaRef}
            className="md-editor-textarea"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            required={required}
          />
        )}

        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className="md-editor-preview">
            {value.trim() ? (
              <MarkdownContent content={value} />
            ) : (
              <p className="md-preview-empty">
                Nada para visualizar ainda. Comece a digitar no editor para ver o texto formatado aqui.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Rodapé com estatísticas e botão de ajuda */}
      <div className="md-editor-footer">
        <button
          type="button"
          className="md-help-toggle"
          onClick={() => setShowHelp(!showHelp)}
        >
          <HelpCircle size={13} />
          <span>Suporte a Markdown ativo {showHelp ? '(ocultar guia)' : '(ver atalhos)'}</span>
        </button>

        <div className="md-stats">
          <span>{wordCount} {wordCount === 1 ? 'palavra' : 'palavras'}</span>
          <span>•</span>
          <span>{charCount} {charCount === 1 ? 'caractere' : 'caracteres'}</span>
        </div>
      </div>

      {/* Guia rápido de referência Markdown */}
      {showHelp && (
        <div className="md-cheatsheet">
          <div className="md-cheat-item">
            <code># Título 1</code>
            <span>Cabeçalho principal</span>
          </div>
          <div className="md-cheat-item">
            <code>## Título 2</code>
            <span>Subtítulo de seção</span>
          </div>
          <div className="md-cheat-item">
            <code>**negrito**</code>
            <span>Texto em <strong>negrito</strong> (Ctrl+B)</span>
          </div>
          <div className="md-cheat-item">
            <code>*itálico*</code>
            <span>Texto em <em>itálico</em> (Ctrl+I)</span>
          </div>
          <div className="md-cheat-item">
            <code>~~tachado~~</code>
            <span>Texto <del>riscado</del></span>
          </div>
          <div className="md-cheat-item">
            <code>==destaque==</code>
            <span>Texto grifado</span>
          </div>
          <div className="md-cheat-item">
            <code>[Texto](https://...)</code>
            <span>Link clicável (Ctrl+K)</span>
          </div>
          <div className="md-cheat-item">
            <code>&gt; Citação</code>
            <span>Bloco de citação</span>
          </div>
          <div className="md-cheat-item">
            <code>- Item</code> ou <code>1. Item</code>
            <span>Listas com marcadores ou numeradas</span>
          </div>
          <div className="md-cheat-item">
            <code>``` código ```</code>
            <span>Bloco de código formatado</span>
          </div>
        </div>
      )}
    </div>
  );
}
