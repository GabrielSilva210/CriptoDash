import { useState, useEffect } from 'react'
import { getTopMarketsBrl } from '../services/coingecko'

export function useTopMarkets() {
    const [coins, setCoins] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let ignore = false

        getTopMarketsBrl()
            .then((result) => {
                if (!ignore) setCoins(result)
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
    }, [])

    return { coins, loading, error }
}