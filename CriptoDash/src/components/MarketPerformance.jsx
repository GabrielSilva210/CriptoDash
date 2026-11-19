import { useId, useMemo, useRef, useState } from 'react'
import { TrendingUpIcon } from './icons'
import { formatCompactCurrency, formatPercent } from '../utils/format'

const RANGES = [
  { id: '24h', label: '24h', points: 24 },
  { id: '7d', label: '7d', points: 168 },
]

const W = 800
const H = 260
const PAD = { top: 14, right: 16, bottom: 28, left: 78 }

function formatTick(date, range) {
  return range === '24h'
    ? date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

// trend: valores de market cap (1 por hora, mais antigo -> mais recente)
// currentValue: market cap global atual em BRL (usado pra calibrar a série)
function MarketPerformance({ trend, currentValue, loading }) {
  const [range, setRange] = useState('24h')
  const [hover, setHover] = useState(null)
  const svgRef = useRef(null)
  const gradientId = useId().replace(/:/g, '')

  const config = RANGES.find((r) => r.id === range)

  const data = useMemo(() => {
    if (!trend) return null
    const slice = trend.slice(-config.points)
    // A soma das 100 maiores é ~90% do mercado: reescala pro total global
    const last = slice[slice.length - 1]
    const factor = currentValue && last ? currentValue / last : 1
    return slice.map((v) => v * factor)
  }, [trend, currentValue, config.points])

  if (loading || !data) {
    return (
      <div className="h-[420px] animate-pulse rounded-2xl border border-white/10 bg-white/[0.04]" />
    )
  }

  const now = Date.now()
  const timeAt = (i) => new Date(now - (data.length - 1 - i) * 3_600_000)

  const first = data[0]
  const last = data[data.length - 1]
  const change = ((last - first) / first) * 100
  const positive = change >= 0
  const color = positive ? '#10b981' : '#ef4444'

  let min = Math.min(...data)
  let max = Math.max(...data)
  const margin = (max - min || max * 0.01) * 0.1
  min -= margin
  max += margin

  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom
  const x = (i) => PAD.left + (i / (data.length - 1)) * innerW
  const y = (v) => PAD.top + (1 - (v - min) / (max - min)) * innerH

  const line = data
    .map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`)
    .join(' ')
  const area = `${line} L${x(data.length - 1)},${H - PAD.bottom} L${x(0)},${H - PAD.bottom} Z`

  const yTicks = Array.from({ length: 4 }, (_, i) => min + ((max - min) * i) / 3)
  const xTickIdx = Array.from({ length: 5 }, (_, i) =>
    Math.round((i * (data.length - 1)) / 4),
  )

  function handleMove(event) {
    const rect = svgRef.current.getBoundingClientRect()
    const px = ((event.clientX - rect.left) / rect.width) * W
    const ratio = (px - PAD.left) / innerW
    const index = Math.round(ratio * (data.length - 1))
    setHover(Math.min(data.length - 1, Math.max(0, index)))
  }

  const shown = hover ?? data.length - 1

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
          <TrendingUpIcon className="h-5 w-5 text-emerald-400" />
          Desempenho do Mercado
        </h3>

        <div className="flex gap-1.5">
          {RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                setRange(r.id)
                setHover(null)
              }}
              className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                r.id === range
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-3">
        <span className="text-4xl font-bold text-white">
          {formatCompactCurrency(data[shown])}
        </span>
        <span className={`text-sm font-semibold ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
          {positive ? '▲' : '▼'} {formatPercent(change)}
        </span>
        {hover !== null && (
          <span className="text-sm text-slate-400">
            {timeAt(hover).toLocaleString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        )}
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="mt-4 w-full"
        role="img"
        aria-label="Gráfico do market cap total"
        onMouseMove={handleMove}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {yTicks.map((t) => (
          <g key={t}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(t)}
              y2={y(t)}
              stroke="#ffffff"
              strokeOpacity="0.06"
            />
            <text x={PAD.left - 8} y={y(t) + 4} fill="#94a3b8" fontSize="11" textAnchor="end">
              {formatCompactCurrency(t)}
            </text>
          </g>
        ))}

        {xTickIdx.map((i, n) => (
          <text
            key={i}
            x={x(i)}
            y={H - 8}
            fill="#94a3b8"
            fontSize="11"
            textAnchor={n === 0 ? 'start' : n === xTickIdx.length - 1 ? 'end' : 'middle'}
          >
            {formatTick(timeAt(i), range)}
          </text>
        ))}

        <path d={area} fill={`url(#${gradientId})`} />
        <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />

        <circle cx={x(shown)} cy={y(data[shown])} r="4" fill={color} />
        {hover !== null && (
          <line
            x1={x(hover)}
            x2={x(hover)}
            y1={PAD.top}
            y2={H - PAD.bottom}
            stroke="#ffffff"
            strokeOpacity="0.25"
            strokeDasharray="3 3"
          />
        )}
      </svg>

      <p className="mt-2 text-xs text-slate-500">
        Estimativa baseada nas 100 maiores moedas, calibrada pelo market cap global.
      </p>
    </div>
  )
}

export default MarketPerformance
