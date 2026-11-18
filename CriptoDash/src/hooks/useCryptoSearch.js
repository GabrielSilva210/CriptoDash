import { useState } from 'react'
import { searchCoins } from '../services/coingecko'

export function useCryptoSearch() {
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)

  async function search(query) {
    setLoading(true)
    setError(null)

    try {
      const result = await searchCoins(query)
      setCoins(result.slice(0, 50))
    } catch (err) {
      setError(err.message)
      setCoins([])
    } finally {
      setLoading(false)
      setSearched(true)
    }
  }

  return { coins, loading, error, searched, search }
}