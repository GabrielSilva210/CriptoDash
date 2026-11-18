export function formatCompactCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPercent(value) {
  const number = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: 'always',
  }).format(value)

  return `${number}%`
}

export function formatNumber(value) {
  return new Intl.NumberFormat('pt-BR').format(value)
}

export function formatCurrency(value, currency = 'USD') {
  if (value === undefined || value === null) return '—'
  // moedas baratas (ex: DOGE) precisam de mais casas decimais
  const digits = Math.abs(value) >= 1 ? 2 : Math.abs(value) >= 0.01 ? 4 : 8
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: digits,
  }).format(value)
}

export function formatCompactUsd(value) {
  if (value === undefined || value === null) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatCompactNumber(value) {
  if (value === undefined || value === null) return '—'
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value)
}

export function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}
