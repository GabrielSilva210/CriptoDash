const BASE_URL = 'https://api.coingecko.com/api/v3'

// Cache em memória (60s): evita chamadas repetidas (ex: StrictMode duplicando
// efeitos em dev) e protege contra o limite de requisições da API gratuita.
const CACHE_TTL = 60_000
const cache = new Map()

function request(path) {
  const cached = cache.get(path)
  if (cached && Date.now() - cached.time < CACHE_TTL) return cached.promise

  const promise = fetchJson(path).catch((err) => {
    cache.delete(path) // não guarda falhas
    throw err
  })

  cache.set(path, { time: Date.now(), promise })
  return promise
}

async function fetchJson(path) {
  let response

  try {
    response = await fetch(`${BASE_URL}${path}`)
  } catch {
    // Erro de rede/CORS. A CoinGecko responde 429 sem CORS, então o
    // navegador também cai aqui quando o limite de requisições estoura.
    throw new Error(
      'Não foi possível conectar à CoinGecko. Pode ser o limite de requisições: aguarde 1 minuto e tente de novo.',
    )
  }

  if (response.status === 429) {
    throw new Error('Muitas requisições. Aguarde um minuto e tente de novo.')
  }

  if (!response.ok) {
    throw new Error('Erro ao buscar dados da CoinGecko.')
  }

  return response.json()
}

export async function searchCoins(query) {
  const data = await request(`/search?query=${encodeURIComponent(query)}`)
  return data.coins
}

export async function getGlobalData() {
  const data = await request('/global')
  return data.data
}

export const CURRENCY = 'usd'

export async function getCoinDetails(id) {
  return request(
    `/coins/${encodeURIComponent(id)}?localization=true&tickers=false&community_data=false&developer_data=false`,
  )
}

// days: 1, 7, 14, 30, 90, 180, 365 ou 'max'
// retorna [[timestamp, open, high, low, close], ...]
export async function getCoinOhlc(id, days) {
  return request(
    `/coins/${encodeURIComponent(id)}/ohlc?vs_currency=${CURRENCY}&days=${days}`,
  )
}

// retorna { prices, market_caps, total_volumes } (cada um [[timestamp, valor], ...])
export async function getCoinMarketChart(id, days) {
  return request(
    `/coins/${encodeURIComponent(id)}/market_chart?vs_currency=${CURRENCY}&days=${days}`,
  )
}