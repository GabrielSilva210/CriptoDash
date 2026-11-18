import { formatCurrency } from '../utils/format'

const W = 800
const H = 340
const PAD = { top: 12, right: 84, bottom: 26, left: 8 }
const UP = '#22c55e'
const DOWN = '#ef4444'

function niceTicks(min, max, count = 5) {
  const step = (max - min) / (count - 1)
  return Array.from({ length: count }, (_, i) => min + step * i)
}

function formatTime(ts, days) {
  const d = new Date(ts)
  if (days === 1) {
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }
  if (days === 'max' || days >= 365) {
    return d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
  }
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

function PriceChart({ data, metric, days }) {
  if (!data || data.length === 0) {
    return <p className="py-20 text-center text-slate-400">Sem dados.</p>
  }

  const isCandle = metric === 'price'
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom

  const lows = isCandle ? data.map((d) => d[3]) : data.map((d) => d[1])
  const highs = isCandle ? data.map((d) => d[2]) : data.map((d) => d[1])
  let min = Math.min(...lows)
  let max = Math.max(...highs)
  const margin = (max - min || max * 0.01) * 0.08
  min -= margin
  max += margin

  const x = (i) => PAD.left + (i + 0.5) * (innerW / data.length)
  const y = (v) => PAD.top + (1 - (v - min) / (max - min)) * innerH
  const fmt =
    metric === 'price'
      ? (v) =>
          v >= 1000
            ? formatCurrency(Math.round(v)).replace(/\.00$/, '')
            : formatCurrency(v)
      : (v) =>
          new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
            maximumFractionDigits: 3,
          }).format(v)
  const yTicks = niceTicks(min, max)
  const xTickIdx = Array.from({ length: 6 }, (_, i) =>
    Math.round((i * (data.length - 1)) / 5),
  )
  const candleW = Math.max(1, Math.min(10, (innerW / data.length) * 0.65))

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="img"
      aria-label="Gráfico da moeda"
    >
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
          <text
            x={W - PAD.right + 6}
            y={y(t) + 4}
            fill="#94a3b8"
            fontSize="11"
          >
            {fmt(t)}
          </text>
        </g>
      ))}

      {xTickIdx.map((i) => (
        <text
          key={i}
          x={x(i)}
          y={H - 6}
          fill="#94a3b8"
          fontSize="11"
          textAnchor="middle"
        >
          {formatTime(data[i][0], days)}
        </text>
      ))}

      {isCandle ? (
        data.map(([ts, o, h, l, c], i) => {
          const color = c >= o ? UP : DOWN
          const top = y(Math.max(o, c))
          const bodyH = Math.max(1, Math.abs(y(o) - y(c)))
          return (
            <g key={ts}>
              <line x1={x(i)} x2={x(i)} y1={y(h)} y2={y(l)} stroke={color} />
              <rect
                x={x(i) - candleW / 2}
                y={top}
                width={candleW}
                height={bodyH}
                fill={color}
              />
            </g>
          )
        })
      ) : (
        <>
          <defs>
            <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`M${x(0)},${H - PAD.bottom} ${data
              .map((d, i) => `L${x(i)},${y(d[1])}`)
              .join(' ')} L${x(data.length - 1)},${H - PAD.bottom} Z`}
            fill="url(#area)"
          />
          <polyline
            points={data.map((d, i) => `${x(i)},${y(d[1])}`).join(' ')}
            fill="none"
            stroke="#f97316"
            strokeWidth="2"
          />
        </>
      )}
    </svg>
  )
}

export default PriceChart
