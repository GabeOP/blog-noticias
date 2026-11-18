import React from 'react';
import { getImageUrl } from '../../utils/imageUrl';
import './MarkdownContent.css';

function sanitizeUrl(url) {
  if (!url) return '#';
  const trimmed = url.trim();
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('#')
  ) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * Faz o parse de marcações inline (negrito, itálico, tachado, destaque, código, links e imagens)
 * retornando elementos React seguros (sem dangerouslySetInnerHTML).
 */
function parseInline(text, keyPrefix = 'inline') {
  if (!text) return null;

  const tokenRegex =
    /(`[^`]+`)|(!\[[^\]]*\]\([^)]+\))|(\[[^\]]+\]\([^)]+\))|(\*\*\*[\s\S]+?\*\*\*)|(\*\*[\s\S]+?\*\*)|(__[\s\S]+?__)|(~~[\s\S]+?~~)|(==[\s\S]+?==)|(\*[^*\n]+\*)|(_[^_\n]+_)/g;

  const elements = [];
  let lastIndex = 0;
  let match;
  let tokenIndex = 0;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.slice(lastIndex, match.index));
    }

    const fullMatch = match[0];
    const currentKey = `${keyPrefix}-${tokenIndex++}`;

    if (match[1]) {
      // Código inline `code`
      const codeContent = fullMatch.slice(1, -1);
      elements.push(
        <code key={currentKey} className="md-inline-code">
          {codeContent}
        </code>
      );
    } else if (match[2]) {
      // Imagem ![alt](url)
      const imgMatch = /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(fullMatch);
      if (imgMatch) {
        const alt = imgMatch[1] || 'Imagem da postagem';
        const rawUrl = imgMatch[2].trim();
        const resolvedUrl = getImageUrl(rawUrl) || sanitizeUrl(rawUrl);
        elements.push(
          <span key={currentKey} className="md-figure">
            <img
              src={resolvedUrl}
              alt={alt}
              className="md-image"
              loading="lazy"
            />
            {alt && alt !== 'Imagem da postagem' && (
              <span className="md-figcaption">{alt}</span>
            )}
          </span>
        );
      } else {
        elements.push(fullMatch);
      }
    } else if (match[3]) {
      // Link [texto](url)
      const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(fullMatch);
      if (linkMatch) {
        const label = linkMatch[1];
        const href = sanitizeUrl(linkMatch[2]);
        elements.push(
          <a
            key={currentKey}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="md-link"
          >
            {parseInline(label, `${currentKey}-lbl`)}
          </a>
        );
      } else {
        elements.push(fullMatch);
      }
    } else if (match[4]) {
      // Negrito + Itálico ***texto***
      const inner = fullMatch.slice(3, -3);
      elements.push(
        <strong key={currentKey}>
          <em>{parseInline(inner, currentKey)}</em>
        </strong>
      );
    } else if (match[5] || match[6]) {
      // Negrito **texto** ou __texto__
      const inner = fullMatch.slice(2, -2);
      elements.push(
        <strong key={currentKey}>{parseInline(inner, currentKey)}</strong>
      );
    } else if (match[7]) {
      // Tachado ~~texto~~
      const inner = fullMatch.slice(2, -2);
      elements.push(
        <del key={currentKey}>{parseInline(inner, currentKey)}</del>
      );
    } else if (match[8]) {
      // Destaque ==texto==
      const inner = fullMatch.slice(2, -2);
      elements.push(
        <mark key={currentKey} className="md-highlight">
          {parseInline(inner, currentKey)}
        </mark>
      );
    } else if (match[9] || match[10]) {
      // Itálico *texto* ou _texto_
      const inner = fullMatch.slice(1, -1);
      elements.push(
        <em key={currentKey}>{parseInline(inner, currentKey)}</em>
      );
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return elements;
}

function renderLinesWithBreaks(lines, keyPrefix) {
  return lines.map((line, idx) => (
    <React.Fragment key={`${keyPrefix}-line-${idx}`}>
      {parseInline(line, `${keyPrefix}-l-${idx}`)}
      {idx < lines.length - 1 && <br />}
    </React.Fragment>
  ));
}

export function MarkdownContent({ content, className = '' }) {
  if (!content || typeof content !== 'string') {
    return null;
  }

  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let i = 0;
  let blockKey = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Linha em branco
    if (!trimmed) {
      i++;
      continue;
    }

    // 1. Bloco de código cercado ```
    if (trimmed.startsWith('```')) {
      const lang = trimmed.slice(3).trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // Consome o ``` de fechamento

      blocks.push(
        <div key={`block-${blockKey++}`} className="md-code-block-wrapper">
          {lang && <div className="md-code-lang">{lang}</div>}
          <pre className="md-code-block">
            <code>{codeLines.join('\n')}</code>
          </pre>
        </div>
      );
      continue;
    }

    // 2. Linha divisória horizontal (---, ***, ___)
    if (/^(?:[-*_]\s*){3,}$/.test(trimmed)) {
      blocks.push(<hr key={`block-${blockKey++}`} className="md-hr" />);
      i++;
      continue;
    }

    // 3. Cabeçalhos (# até ######)
    const headingMatch = /^(#{1,6})\s+(.+)$/.exec(trimmed);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const Tag = `h${level}`;
      blocks.push(
        <Tag key={`block-${blockKey++}`} className={`md-heading md-h${level}`}>
          {parseInline(text, `h-${blockKey}`)}
        </Tag>
      );
      i++;
      continue;
    }

    // 4. Citação (> texto)
    if (/^>\s?/.test(trimmed)) {
      const quoteLines = [];
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      blocks.push(
        <blockquote key={`block-${blockKey++}`} className="md-blockquote">
          {renderLinesWithBreaks(quoteLines, `quote-${blockKey}`)}
        </blockquote>
      );
      continue;
    }

    // 5. Tabela Markdown (| Col 1 | Col 2 |)
    if (
      trimmed.startsWith('|') &&
      trimmed.endsWith('|') &&
      i + 1 < lines.length &&
      /^\|\s*[-:]+/.test(lines[i + 1].trim())
    ) {
      const parseRow = (rowStr) =>
        rowStr
          .trim()
          .replace(/^\|/, '')
          .replace(/\|$/, '')
          .split('|')
          .map((cell) => cell.trim());

      const headers = parseRow(lines[i]);
      i += 2; // Pula cabeçalho e linha separadora
      const rows = [];
      while (
        i < lines.length &&
        lines[i].trim().startsWith('|') &&
        lines[i].trim().endsWith('|')
      ) {
        rows.push(parseRow(lines[i]));
        i++;
      }

      const currentKey = blockKey++;
      blocks.push(
        <div key={`block-${currentKey}`} className="md-table-wrapper">
          <table className="md-table">
            <thead>
              <tr>
                {headers.map((header, hIdx) => (
                  <th key={`th-${currentKey}-${hIdx}`}>
                    {parseInline(header, `th-${currentKey}-${hIdx}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rIdx) => (
                <tr key={`tr-${currentKey}-${rIdx}`}>
                  {row.map((cell, cIdx) => (
                    <td key={`td-${currentKey}-${rIdx}-${cIdx}`}>
                      {parseInline(cell, `td-${currentKey}-${rIdx}-${cIdx}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // 6. Lista não ordenada (-, *, +) incluindo checklists (- [ ], - [x])
    if (/^[-*+]\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^[-*+]\s+/.test(lines[i].trim())) {
        const itemText = lines[i].trim().replace(/^[-*+]\s+/, '');
        const taskMatch = /^\[([ xX])\]\s+(.*)$/.exec(itemText);
        if (taskMatch) {
          items.push({
            isTask: true,
            checked: taskMatch[1].toLowerCase() === 'x',
            text: taskMatch[2],
          });
        } else {
          items.push({
            isTask: false,
            text: itemText,
          });
        }
        i++;
      }

      const currentKey = blockKey++;
      const hasTasks = items.some((it) => it.isTask);
      blocks.push(
        <ul
          key={`block-${currentKey}`}
          className={`md-ul ${hasTasks ? 'md-task-list' : ''}`}
        >
          {items.map((item, idx) => (
            <li
              key={`ul-${currentKey}-${idx}`}
              className={item.isTask ? 'md-task-item' : ''}
            >
              {item.isTask && (
                <input
                  type="checkbox"
                  checked={item.checked}
                  readOnly
                  className="md-task-checkbox"
                />
              )}
              <span className={item.isTask && item.checked ? 'md-task-done' : ''}>
                {parseInline(item.text, `ul-${currentKey}-${idx}`)}
              </span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // 7. Lista numerada (1. , 2. )
    if (/^\d+\.\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      const currentKey = blockKey++;
      blocks.push(
        <ol key={`block-${currentKey}`} className="md-ol">
          {items.map((item, idx) => (
            <li key={`ol-${currentKey}-${idx}`}>
              {parseInline(item, `ol-${currentKey}-${idx}`)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // 8. Parágrafo padrão (agrupa linhas consecutivas que não iniciam outro bloco)
    const paraLines = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trim().startsWith('```') &&
      !/^(?:[-*_]\s*){3,}$/.test(lines[i].trim()) &&
      !/^(#{1,6})\s+/.test(lines[i].trim()) &&
      !/^>\s?/.test(lines[i].trim()) &&
      !/^[-*+]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i]);
      i++;
    }

    const currentKey = blockKey++;
    blocks.push(
      <p key={`block-${currentKey}`} className="md-paragraph">
        {renderLinesWithBreaks(paraLines, `p-${currentKey}`)}
      </p>
    );
  }

  return <div className={`markdown-content ${className}`.trim()}>{blocks}</div>;
}
