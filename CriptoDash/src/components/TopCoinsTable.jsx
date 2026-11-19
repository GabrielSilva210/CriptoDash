import { useEffect, useState } from 'react'
import { ListIcon, StarIcon } from './icons'
import { formatBrl, formatCompactCurrency, formatPercent } from '../utils/format'

const STORAGE_KEY = 'criptodash:favorites'

function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

// 7d: usa o campo da API; se não vier, calcula pelo sparkline
function change7d(coin) {
  const direct = coin.price_change_percentage_7d_in_currency
  if (direct !== undefined && direct !== null) return direct
  const prices = coin.sparkline_in_7d?.price
  if (!prices?.length) return null
  return ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100
}

function Change({ value }) {
  if (value === null || value === undefined) return <span className="text-slate-500">—</span>
  const positive = value >= 0
  return (
    <span className={`font-semibold ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
      {positive ? '▲' : '▼'} {formatPercent(Math.abs(value)).replace('+', '')}
    </span>
  )
}

function TopCoinsTable({ coins, loading, onSelect }) {
  const [showAll, setShowAll] = useState(false)
  const [favorites, setFavorites] = useState(loadFavorites)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      /* sem localStorage: favoritos só valem nesta sessão */
    }
  }, [favorites])

  function toggleFavorite(id) {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    )
  }

  const rows = coins.slice(0, showAll ? 20 : 5)

  return (
    <div id="principais-criptomoedas" className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
          <ListIcon className="h-5 w-5 text-emerald-400" />
          Principais Criptomoedas
        </h3>
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="cursor-pointer text-sm font-medium text-emerald-400 hover:text-emerald-300"
        >
          {showAll ? 'Ver menos' : 'Ver todas →'}
        </button>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-400">
              <th className="px-3 py-2 font-medium">#</th>
              <th className="px-3 py-2 font-medium">Criptomoeda</th>
              <th className="px-3 py-2 text-right font-medium">Preço</th>
              <th className="px-3 py-2 text-right font-medium">24h</th>
              <th className="px-3 py-2 text-right font-medium">7d</th>
              <th className="px-3 py-2 text-right font-medium">Volume (24h)</th>
              <th className="px-3 py-2 text-right font-medium">Market Cap</th>
              <th className="px-3 py-2 text-center font-medium">Ação</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 5 }, (_, i) => (
                <tr key={i}>
                  <td colSpan={8} className="px-3 py-2">
                    <div className="h-8 animate-pulse rounded bg-white/5" />
                  </td>
                </tr>
              ))}

            {!loading &&
              rows.map((coin) => {
                const isFav = favorites.includes(coin.id)
                return (
                  <tr
                    key={coin.id}
                    onClick={() => onSelect?.(coin.id)}
                    className="cursor-pointer border-t border-white/5 text-slate-200 transition-colors hover:bg-white/5"
                  >
                    <td className="px-3 py-3 text-slate-400">{coin.market_cap_rank}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <img src={coin.image} alt="" className="h-7 w-7 rounded-full" />
                        <span className="font-semibold text-white">{coin.name}</span>
                        <span className="text-xs uppercase text-slate-400">{coin.symbol}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right font-medium text-white">
                      {formatBrl(coin.current_price)}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <Change value={coin.price_change_percentage_24h} />
                    </td>
                    <td className="px-3 py-3 text-right">
                      <Change value={change7d(coin)} />
                    </td>
                    <td className="px-3 py-3 text-right">{formatCompactCurrency(coin.total_volume)}</td>
                    <td className="px-3 py-3 text-right">{formatCompactCurrency(coin.market_cap)}</td>
                    <td className="px-3 py-3 text-center">
                      <button
                        type="button"
                        aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(coin.id)
                        }}
                        className="cursor-pointer text-slate-400 hover:text-amber-400"
                      >
                        <StarIcon
                          className={`h-5 w-5 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`}
                        />
                      </button>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TopCoinsTable
