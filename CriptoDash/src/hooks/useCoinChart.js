import { useState, useEffect } from 'react'
import { getCoinOhlc, getCoinMarketChart } from '../services/coingecko'

// metric: 'price' (candles) | 'market_cap' | 'volume' (linhas)
export function useCoinChart(id, metric, days) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false
    setLoading(true)
    setError(null)

    const load =
      metric === 'price'
        ? getCoinOhlc(id, days)
        : getCoinMarketChart(id, days).then((r) =>
            metric === 'market_cap' ? r.market_caps : r.total_volumes,
          )

    load
      .then((result) => {
        if (!ignore) setData(result)
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.message)
          setData(null)
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [id, metric, days])

  return { data, loading, error }
}
