import { useMemo } from 'react'
import StatCard from './StatCard'
import { DatabaseIcon, TrendingUpIcon, TrendingDownIcon } from './icons'
import { useGlobalData } from '../hooks/useGlobalData'
import { useTopMarkets } from '../hooks/useTopMarkets'
import { formatCompactCurrency, formatBrl } from '../utils/format'
import { buildMarketCapTrend } from '../utils/marketTrend'
import MarketPerformance from './MarketPerformance'
import MoversCard from './MoversCard'
import TopCoinsTable from './TopCoinsTable'

function CoinLogo({ coin }) {
  if (!coin) return <div className="h-12 w-12 rounded-full bg-white/10" />
  return <img src={coin.image} alt="" className="h-12 w-12 rounded-full" />
}

function MarketOverview({ onSelectCoin }) {
  const { data, loading, error } = useGlobalData()
  const { coins, loading: loadingCoins, error: errorCoins } = useTopMarkets()

  const marketCapTrend = useMemo(() => buildMarketCapTrend(coins), [coins])
  const btc = coins.find((coin) => coin.id === 'bitcoin')
  const eth = coins.find((coin) => coin.id === 'ethereum')

  // Maiores altas/quedas entre as 100 maiores moedas (variação 24h)
  const { gainers, losers } = useMemo(() => {
    const valid = coins.filter((c) => typeof c.price_change_percentage_24h === 'number')
    const sorted = [...valid].sort(
      (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h,
    )
    return { gainers: sorted.slice(0, 3), losers: sorted.slice(-3).reverse() }
  }, [coins])

  return (
    <section>
      <h2 className="text-3xl font-bold tracking-tight text-white">
        Visão geral do mercado
      </h2>
      <p className="mt-1 text-sm text-slate-400">
        Acompanhe as principais criptomoedas e fique por dentro das
        movimentações do mercado.
      </p>

      {(error || errorCoins) && (
        <p className="mt-4 text-red-500">{error || errorCoins}</p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <StatCard
          label="Capitalização de Mercado"
          value={data && formatCompactCurrency(data.total_market_cap.brl)}
          change={data?.market_cap_change_percentage_24h_usd}
          icon={<TrendingUpIcon className="h-11 w-11" />}
          sparkline={marketCapTrend}
          color="#10b981"
          loading={loading}
        />

        <StatCard
          label="Volume em 24h"
          value={data && formatCompactCurrency(data.total_volume.brl)}
          icon={<DatabaseIcon className="h-11 w-11" />}
          loading={loading}
        />

        <StatCard
          label="Bitcoin (BTC)"
          value={btc && formatBrl(btc.current_price)}
          change={btc?.price_change_percentage_24h}
          icon={<CoinLogo coin={btc} />}
          sparkline={btc?.sparkline_in_7d?.price}
          color="#f59e0b"
          loading={loadingCoins}
        />

        <StatCard
          label="Ethereum (ETH)"
          value={eth && formatBrl(eth.current_price)}
          change={eth?.price_change_percentage_24h}
          icon={<CoinLogo coin={eth} />}
          sparkline={eth?.sparkline_in_7d?.price}
          color="#3b82f6"
          loading={loadingCoins}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-5">
          <MarketPerformance
            trend={marketCapTrend}
            currentValue={data?.total_market_cap.brl}
            loading={loading || loadingCoins}
          />
          <TopCoinsTable coins={coins} loading={loadingCoins} onSelect={onSelectCoin} />
        </div>

        <div className="flex min-w-0 flex-col gap-5">
          <MoversCard
            title="Maiores Altas"
            icon={<TrendingUpIcon className="h-4 w-4 text-emerald-400" />}
            coins={gainers}
            onSelect={onSelectCoin}
          />
          <MoversCard
            title="Maiores Quedas"
            icon={<TrendingDownIcon className="h-4 w-4 text-red-400" />}
            coins={losers}
            onSelect={onSelectCoin}
          />

          <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/15 to-transparent p-6">
            <p className="text-lg font-bold text-white">CriptoDash</p>
            <p className="mt-1 text-sm text-slate-300">
              Sua central de informações sobre criptomoedas.
            </p>
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById('principais-criptomoedas')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              className="mt-4 cursor-pointer rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400"
            >
              Explorar o mercado →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MarketOverview