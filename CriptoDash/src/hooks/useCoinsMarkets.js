import { useState, useEffect } from 'react'
import { getCoinsMarkets } from '../services/coingecko'

// Recebe a lista vinda da busca (/search, que não traz preço) e devolve
// um objeto { [id]: dadosDeMercado } com preço e variação 24h.
export function useCoinsMarkets(coins) {
    const [markets, setMarkets] = useState({})
    const key = coins.map((coin) => coin.id).join(',')

    useEffect(() => {
        if (!key) return

        let ignore = false

        getCoinsMarkets(key.split(','))
            .then((list) => {
                if (ignore) return
                setMarkets(Object.fromEntries(list.map((coin) => [coin.id, coin])))
            })
            .catch(() => {
                // Se falhar (ex: limite da API), a lista continua aparecendo,
                // só sem preço.
            })

        return () => {
            ignore = true
        }
    }, [key])

    return markets
}