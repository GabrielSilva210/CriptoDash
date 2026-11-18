import { useState, useEffect } from 'react'
import { getCoinDetails } from '../services/coingecko'

export function useCoinDetails(id) {
  const [coin, setCoin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false
    setLoading(true)
    setError(null)
    setCoin(null)

    getCoinDetails(id)
      .then((result) => {
        if (!ignore) setCoin(result)
      })
      .catch((err) => {
        if (!ignore) setError(err.message)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [id])

  return { coin, loading, error }
}
