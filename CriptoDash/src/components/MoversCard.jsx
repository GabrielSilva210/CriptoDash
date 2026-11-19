import { formatBrl, formatPercent } from '../utils/format'

// Preço de moedas muito baratas (ex: BONK) precisa de mais casas decimais
function formatPrice(value) {
  if (value >= 1) return formatBrl(value)
  const digits = value >= 0.01 ? 4 : 8
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: digits,
  }).format(value)
}

function MoversCard({ title, icon, coins, onSelect }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <h3 className="flex items-center gap-2 text-base font-semibold text-white">
        {icon}
        {title}
      </h3>

      <ul className="mt-3 flex flex-col gap-1">
        {coins.map((coin) => {
          const change = coin.price_change_percentage_24h
          const positive = change >= 0
          return (
            <li key={coin.id}>
              <button
                type="button"
                onClick={() => onSelect?.(coin.id)}
                className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-white/5"
              >
                <img src={coin.image} alt="" className="h-8 w-8 flex-shrink-0 rounded-full" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{coin.name}</p>
                  <p className="text-xs uppercase text-slate-400">{coin.symbol}</p>
                </div>
                <span className="text-sm text-slate-200">{formatPrice(coin.current_price)}</span>
                <span
                  className={`w-20 text-right text-sm font-semibold ${
                    positive ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {positive ? '▲' : '▼'} {formatPercent(Math.abs(change)).replace('+', '')}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default MoversCard
