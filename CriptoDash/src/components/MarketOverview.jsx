import StatCard from './StatCard'
import { ChartIcon, CoinsIcon, CubeIcon } from './icons'
import { useGlobalData } from '../hooks/useGlobalData'
import { formatCompactCurrency, formatNumber } from '../utils/format'

function MarketOverview() {
  const { data, loading, error } = useGlobalData()

  return (
    <section>
      <h2 className="text-3xl font-bold tracking-tight text-slate-900">
        Visão geral do mercado
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Acompanhe as principais criptomoedas e fique por dentro das
        movimentações do mercado.
      </p>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {!error && (
        <div className="mt-6 flex flex-wrap gap-4">
          <StatCard
            label="Capitalização de Mercado"
            value={data && formatCompactCurrency(data.total_market_cap.brl)}
            change={data?.market_cap_change_percentage_24h_usd}
            icon={<ChartIcon />}
            loading={loading}
          />

          <StatCard
            label="Volume em 24h"
            value={data && formatCompactCurrency(data.total_volume.brl)}
            icon={<CoinsIcon />}
            loading={loading}
          />

          <StatCard
            label="Total de Criptomoedas"
            value={data && formatNumber(data.active_cryptocurrencies)}
            icon={<CubeIcon />}
            loading={loading}
          />
        </div>
      )}
    </section>
  )
}

export default MarketOverview