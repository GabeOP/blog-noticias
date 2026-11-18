/**
 * Remove marcações Markdown de uma string para exibição limpa em resumos/cards.
 */
export function stripMarkdown(markdown) {
  if (!markdown || typeof markdown !== 'string') return '';

  return markdown
    // Remove blocos de código cercados
    .replace(/```[\s\S]*?```/g, ' ')
    // Remove imagens ![alt](url)
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Converte links [texto](url) para apenas o texto
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove cabeçalhos (#, ##, ###...)
    .replace(/^#{1,6}\s+/gm, '')
    // Remove marcadores de citação (>)
    .replace(/^>\s+/gm, '')
    // Remove linhas horizontais (---, ***, ___)
    .replace(/^(?:[-*_]\s*){3,}$/gm, '')
    // Remove checklists (- [ ] ou - [x])
    .replace(/^[\s]*[-*+]\s+\[[ xX]\]\s+/gm, '')
    // Remove marcadores de lista não ordenada e ordenada
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Remove negrito, itálico, tachado e destaque
    .replace(/(\*\*\*|___)(.*?)\1/g, '$2')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/==(.*?)==/g, '$1')
    // Remove código inline
    .replace(/`([^`]+)`/g, '$1')
    // Normaliza quebras de linha e espaços múltiplos
    .replace(/\r?\n+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
