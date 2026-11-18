// api/news.js  (Vercel Serverless Function)
// Lê feeds RSS de sites de cripto, junta, ordena por data e devolve JSON.
// Roda no servidor porque o navegador bloqueia RSS de outros domínios (CORS).

// Só estas URLs podem ser buscadas (evita que alguém use a função como proxy aberto).
const SOURCES = [
  { name: 'Webitcoin', url: 'https://www.webitcoin.com.br/feed/rss/' },
  // Feed confirmado, mas em inglês. Descomente se quiser misturar:
  // { name: 'Cointelegraph', url: 'https://cointelegraph.com/rss/tag/bitcoin' },
]

const MAX_PER_SOURCE = 10
const MAX_TOTAL = 12

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }

const decode = (s = '') =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&(amp|lt|gt|quot|apos|nbsp);/g, (_, e) => ENTITIES[e])

const stripHtml = (s) => decode(s).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

const tag = (xml, name) => {
  const m = xml.match(new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)</${name}>`, 'i'))
  return m ? m[1] : ''
}

const attr = (xml, tagName, a) => {
  const m = xml.match(new RegExp(`<${tagName}\\b[^>]*\\b${a}="([^"]+)"`, 'i'))
  return m ? decode(m[1]) : ''
}

const toHttps = (u) => (/^https?:\/\//i.test(u) ? u.replace(/^http:\/\//i, 'https://') : '')

function findImage(item) {
  const enclosure = (item.match(/<enclosure\b[^>]*>/i) || [''])[0]
  const html = decode(tag(item, 'content:encoded') + tag(item, 'description'))
  const fromHtml = (html.match(/<img[^>]+src=["']([^"']+)["']/i) || [])[1]
  return toHttps(
    attr(item, 'media:content', 'url') ||
      attr(item, 'media:thumbnail', 'url') ||
      (/image/i.test(enclosure) ? attr(enclosure, 'enclosure', 'url') : '') ||
      fromHtml ||
      ''
  )
}

function parseFeed(xml, sourceName) {
  const blocks = xml.match(/<item\b[\s\S]*?<\/item>/gi) || []
  return blocks.slice(0, MAX_PER_SOURCE).flatMap((item) => {
    const title = stripHtml(tag(item, 'title'))
    const url = toHttps(stripHtml(tag(item, 'link')))
    const time = Date.parse(stripHtml(tag(item, 'pubDate')))
    if (!title || !url || Number.isNaN(time)) return []
    return [
      {
        id: url,
        title,
        url,
        image: findImage(item),
        source: sourceName,
        publishedAt: new Date(time).toISOString(),
      },
    ]
  })
}

async function loadSource({ name, url }) {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(8000),
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; CriptoDash/1.0)',
      Accept: 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.5',
    },
  })
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`)
  return parseFeed(await res.text(), name)
}

export default async function handler(req, res) {
  const results = await Promise.allSettled(SOURCES.map(loadSource))

  results.forEach((r, i) => {
    if (r.status === 'rejected') console.error(`[news] ${SOURCES[i].name} falhou:`, r.reason?.message)
  })

  const seen = new Set()
  const items = results
    .flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
    .filter((n) => (seen.has(n.url) ? false : seen.add(n.url)))
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, MAX_TOTAL)

  if (!items.length) {
    return res.status(502).json({ error: 'Nenhuma fonte respondeu', items: [] })
  }

  // Cache na CDN por 10 min: 1 busca serve todos os visitantes.
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=3600')
  res.status(200).json({ updatedAt: new Date().toISOString(), items })
}