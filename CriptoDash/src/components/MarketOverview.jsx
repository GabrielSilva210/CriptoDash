import { useMemo } from 'react'
import StatCard from './StatCard'
import { DatabaseIcon, TrendingUpIcon } from './icons'
import { useGlobalData } from '../hooks/useGlobalData'
import { useTopMarkets } from '../hooks/useTopMarkets'
import { formatCompactCurrency, formatBrl } from '../utils/format'

// O CoinGecko gratuito não tem histórico do market cap global. Então a
// tendência é aproximada somando (preço × oferta circulante) das 100 maiores
// moedas em cada ponto dos últimos 7 dias — elas somam ~90% do mercado.
function buildMarketCapTrend(coins) {
  const size = coins[0]?.sparkline_in_7d?.price?.length
  if (!size) return null

  const series = coins.filter(
    (coin) =>
      coin.circulating_supply &&
      coin.sparkline_in_7d?.price?.length === size,
  )

  return Array.from({ length: size }, (_, i) =>
    series.reduce(
      (sum, coin) => sum + coin.sparkline_in_7d.price[i] * coin.circulating_supply,
      0,
    ),
  )
}

function CoinLogo({ coin }) {
  if (!coin) return <div className="h-12 w-12 rounded-full bg-white/10" />
  return <img src={coin.image} alt="" className="h-12 w-12 rounded-full" />
}

function MarketOverview() {
  const { data, loading, error } = useGlobalData()
  const { coins, loading: loadingCoins, error: errorCoins } = useTopMarkets()

  const marketCapTrend = useMemo(() => buildMarketCapTrend(coins), [coins])
  const btc = coins.find((coin) => coin.id === 'bitcoin')
  const eth = coins.find((coin) => coin.id === 'ethereum')

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
    </section>
  )
}

export default MarketOverview