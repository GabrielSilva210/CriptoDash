import { useId } from 'react'

// Mini-gráfico de linha com área em degradê (estilo dos cards da Home).
function Sparkline({ data, color = '#10b981', className = 'h-12 w-28' }) {
    const gradientId = useId().replace(/:/g, '')

    if (!data || data.length < 2) return null

    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1

    const W = 100
    const H = 40
    const PAD = 3 // folga pra linha não ser cortada no topo/base

    const points = data.map((value, i) => {
        const x = (i / (data.length - 1)) * W
        const y = PAD + (1 - (value - min) / range) * (H - PAD * 2)
        return [x, y]
    })

    const line = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ')
    const area = `${line} L${W},${H} L0,${H} Z`

    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            aria-hidden="true"
            className={className}
        >
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.28" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={area} fill={`url(#${gradientId})`} />
            <path
                d={line}
                fill="none"
                stroke={color}
                strokeWidth="1.6"
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    )
}

export default Sparkline