const BASE_URL = 'https://api.coingecko.com/api/v3'

async function request(path) {
  const response = await fetch(`${BASE_URL}${path}`)

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