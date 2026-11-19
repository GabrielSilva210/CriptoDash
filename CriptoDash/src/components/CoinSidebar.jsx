import { useCoinsMarkets } from '../hooks/useCoinsMarkets'
import { useGlobalData } from '../hooks/useGlobalData'
import { formatCurrency, formatCompactUsd } from '../utils/format'

export default function CoinSidebar({ coins, selectedId, onSelect }) {
    const markets = useCoinsMarkets(coins)
    const { data: globalData } = useGlobalData()

    return (
        <>
            {/* Lista de moedas */}
            <ul className="-mr-2 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-2">
                {coins.length === 0 && (
                    <li className="px-3 py-4 text-sm text-slate-400">
                        Nenhuma criptomoeda encontrada.
                    </li>
                )}

                {coins.map((coin) => {
                    const market = markets[coin.id]
                    const change = market?.price_change_percentage_24h
                    const isActive = coin.id === selectedId

                    return (
                        <li key={coin.id}>
                            <button
                                type="button"
                                onClick={() => onSelect(coin.id)}
                                className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-colors ${isActive
                                        ? 'border-emerald-500 bg-gradient-to-r from-emerald-500/20 to-emerald-500/5 shadow-[0_0_14px_rgba(16,185,129,0.25)]'
                                        : 'border-transparent hover:bg-white/5'
                                    }`}
                            >
                                <img
                                    src={market?.image ?? coin.thumb}
                                    alt=""
                                    className="h-10 w-10 flex-shrink-0 rounded-full"
                                />

                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-semibold text-white">
                                        {coin.name}
                                    </p>
                                    <p className="text-sm uppercase text-slate-400">
                                        {coin.symbol}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="font-semibold text-white">
                                        {formatCurrency(market?.current_price)}
                                    </p>
                                    {change !== undefined && change !== null && (
                                        <p
                                            className={`text-sm ${change >= 0 ? 'text-emerald-400' : 'text-red-400'
                                                }`}
                                        >
                                            {change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
                                        </p>
                                    )}
                                </div>
                            </button>
                        </li>
                    )
                })}
            </ul>

            {/* Card Mercado Global */}
            <div className="mt-4 flex-shrink-0 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">Mercado Global</p>

                <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-3xl font-bold text-white">
                        {globalData ? formatCompactUsd(globalData.total_market_cap.usd) : '—'}
                    </span>
                    {globalData && (
                        <span
                            className={`text-sm ${globalData.market_cap_change_percentage_24h_usd >= 0
                                    ? 'text-emerald-400'
                                    : 'text-red-400'
                                }`}
                        >
                            {globalData.market_cap_change_percentage_24h_usd >= 0 ? '▲' : '▼'}{' '}
                            {Math.abs(globalData.market_cap_change_percentage_24h_usd).toFixed(2)}%
                        </span>
                    )}
                </div>

                <div className="mt-4 flex justify-between text-xs text-slate-400">
                    <div>
                        <p>BTC Dominância</p>
                        <p className="mt-0.5 text-sm font-semibold text-white">
                            {globalData ? `${globalData.market_cap_percentage.btc.toFixed(1)}%` : '—'}
                        </p>
                    </div>
                    <div className="text-right">
                        <p>Volume (24h)</p>
                        <p className="mt-0.5 text-sm font-semibold text-white">
                            {globalData ? formatCompactUsd(globalData.total_volume.usd) : '—'}
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}