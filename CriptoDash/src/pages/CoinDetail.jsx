import { useState } from 'react'
import PriceChart from '../components/PriceChart'
import { useCoinDetails } from '../hooks/useCoinDetails'
import { useCoinChart } from '../hooks/useCoinChart'
import { useGlobalData } from '../hooks/useGlobalData'
import {
  formatCurrency,
  formatCompactUsd,
  formatCompactNumber,
  formatPercent,
  stripHtml,
} from '../utils/format'

const METRICS = [
  { key: 'price', label: 'Preço' },
  { key: 'market_cap', label: 'Market Cap' },
  { key: 'volume', label: 'Volume' },
]

const RANGES = [
  { label: '1D', days: 1 },
  { label: '1S', days: 7 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '1A', days: 365 },
  { label: 'TODOS', days: 'max' },
]

function Card({ className = '', children }) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.03] p-5 ${className}`}
    >
      {children}
    </div>
  )
}

function Row({ label, value, valueClass = '' }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 py-2 text-sm last:border-0">
      <span className="text-slate-400">{label}</span>
      <span className={`font-semibold ${valueClass}`}>{value}</span>
    </div>
  )
}

function pctClass(v) {
  return v >= 0 ? 'text-emerald-400' : 'text-red-400'
}

function Pill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${active
          ? 'bg-orange-500 text-white'
          : 'text-slate-300 hover:bg-white/10'
        }`}
    >
      {children}
    </button>
  )
}

function Dominance({ data }) {
  const pct = data?.market_cap_percentage
  if (!pct) return null

  const btc = pct.btc ?? 0
  const eth = pct.eth ?? 0
  const others = Math.max(0, 100 - btc - eth)
  const slices = [
    { label: 'Bitcoin', value: btc, color: '#f97316' },
    { label: 'Ethereum', value: eth, color: '#3b82f6' },
    { label: 'Outros', value: others, color: '#8b5cf6' },
  ]

  let acc = 0
  const stops = slices
    .map((s) => {
      const from = acc
      acc += s.value
      return `${s.color} ${from}% ${acc}%`
    })
    .join(', ')

  return (
    <Card>
      <h3 className="font-semibold">Tendência do Mercado</h3>
      <p className="text-xs text-slate-500">
        Dominância no mercado global
      </p>
      <div className="mt-4 flex items-center gap-6">
        <div
          className="h-28 w-28 shrink-0 rounded-full"
          style={{
            background: `conic-gradient(${stops})`,
            mask: 'radial-gradient(circle, transparent 38%, #000 39%)',
            WebkitMask: 'radial-gradient(circle, transparent 38%, #000 39%)',
          }}
        />
        <ul className="flex-1 space-y-2 text-sm">
          {slices.map((s) => (
            <li key={s.label} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: s.color }}
                />
                {s.label}
              </span>
              <span className="font-semibold">{s.value.toFixed(1)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}

function CoinDetail({ coinId, onBack }) {
  const [metric, setMetric] = useState('price')
  const [days, setDays] = useState(1)

  const { coin, loading, error } = useCoinDetails(coinId)
  const chart = useCoinChart(coinId, metric, days)
  const { data: globalData } = useGlobalData()

  const md = coin?.market_data
  const description = coin
    ? stripHtml(coin.description?.pt || coin.description?.en || '')
    : ''

  return (
    <div className="min-h-screen bg-[#0f1c2e] text-white">
      <main className="mx-auto max-w-6xl px-6 py-6">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 rounded-lg px-3 py-1.5 text-sm text-slate-300 hover:bg-white/10"
        >
          ← Voltar
        </button>

        {loading && <p className="text-slate-400">Carregando...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {coin && md && (
          <>
            {/* Cabeçalho */}
            <header className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <img
                  src={coin.image?.large}
                  alt=""
                  className="h-16 w-16 rounded-full"
                />
                <div>
                  <h1 className="text-3xl font-bold">{coin.name}</h1>
                  <p className="mt-1 flex items-center gap-2 text-slate-400">
                    <span className="uppercase">{coin.symbol}</span>
                    {coin.market_cap_rank && (
                      <span className="rounded-md bg-orange-500/20 px-2 py-0.5 text-xs font-semibold text-orange-400">
                        #{coin.market_cap_rank}
                      </span>
                    )}
                  </p>
                </div>
                <div className="ml-4">
                  <p className="text-3xl font-bold">
                    {formatCurrency(md.current_price?.usd)}
                  </p>
                  <p
                    className={`text-sm font-semibold ${pctClass(
                      md.price_change_percentage_24h,
                    )}`}
                  >
                    {md.price_change_percentage_24h >= 0 ? '▲' : '▼'}{' '}
                    {formatPercent(md.price_change_percentage_24h)} (24h)
                  </p>
                </div>
              </div>

              <div className="flex gap-8 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-4">
                <div>
                  <p className="text-sm text-slate-400">Market Cap</p>
                  <p className="text-lg font-semibold">
                    {formatCompactUsd(md.market_cap?.usd)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Volume (24h)</p>
                  <p className="text-lg font-semibold">
                    {formatCompactUsd(md.total_volume?.usd)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Circulação</p>
                  <p className="text-lg font-semibold">
                    {formatCompactNumber(md.circulating_supply)}{' '}
                    <span className="text-xs uppercase text-slate-400">
                      {coin.symbol}
                    </span>
                  </p>
                </div>
              </div>
            </header>

            {/* Gráfico + lateral */}
            <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
              <Card>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex gap-1">
                    {METRICS.map((m) => (
                      <Pill
                        key={m.key}
                        active={metric === m.key}
                        onClick={() => setMetric(m.key)}
                      >
                        {m.label}
                      </Pill>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    {RANGES.map((r) => (
                      <Pill
                        key={r.label}
                        active={days === r.days}
                        onClick={() => setDays(r.days)}
                      >
                        {r.label}
                      </Pill>
                    ))}
                  </div>
                </div>

                {chart.loading && (
                  <p className="py-20 text-center text-slate-400">
                    Carregando gráfico...
                  </p>
                )}
                {chart.error && (
                  <p className="py-20 text-center text-red-400">
                    {chart.error}
                  </p>
                )}
                {!chart.loading && !chart.error && (
                  <PriceChart data={chart.data} metric={metric} days={days} />
                )}
              </Card>

              <div className="flex flex-col gap-4">
                <Card>
                  <h3 className="mb-2 font-semibold text-orange-400">
                    Sobre {coin.name}
                  </h3>
                  <p className="line-clamp-6 text-sm leading-relaxed text-slate-300">
                    {description || 'Sem descrição disponível.'}
                  </p>
                  {coin.links?.homepage?.[0] && (
                    <a
                      href={coin.links.homepage[0]}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-block rounded-lg border border-orange-500 px-4 py-1.5 text-sm text-orange-400 hover:bg-orange-500/10"
                    >
                      Saiba mais →
                    </a>
                  )}
                </Card>

                <Card>
                  <h3 className="mb-2 font-semibold">Histórico de Preço</h3>
                  <Row
                    label="Máxima (ATH)"
                    value={formatCurrency(md.ath?.usd)}
                  />
                  <Row label="Mínima" value={formatCurrency(md.atl?.usd)} />
                  <Row
                    label="Variação 1 ano"
                    value={formatPercent(md.price_change_percentage_1y)}
                    valueClass={pctClass(md.price_change_percentage_1y)}
                  />
                </Card>
              </div>
            </div>

            {/* Rodapé */}
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Card>
                <h3 className="mb-2 font-semibold">Informações de Mercado</h3>
                <Row
                  label="Preço Atual"
                  value={formatCurrency(md.current_price?.usd)}
                />
                <Row
                  label="Variação 24h"
                  value={formatPercent(md.price_change_percentage_24h)}
                  valueClass={pctClass(md.price_change_percentage_24h)}
                />
                <Row
                  label="Máxima 24h"
                  value={formatCurrency(md.high_24h?.usd)}
                />
                <Row
                  label="Mínima 24h"
                  value={formatCurrency(md.low_24h?.usd)}
                />
                <Row
                  label="Volume 24h"
                  value={formatCompactUsd(md.total_volume?.usd)}
                />
              </Card>

              <Dominance data={globalData} />
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default CoinDetail