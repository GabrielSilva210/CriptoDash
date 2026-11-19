import Sparkline from './Sparkline'
import { formatPercent } from '../utils/format'

function StatCard({ label, value, change, icon, sparkline, color, loading }) {
  const hasChange = change !== undefined && change !== null
  const positive = change >= 0

  return (
    <div className="flex min-w-0 items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-6">
      <div className="flex-shrink-0 text-emerald-500">{icon}</div>

      <div className="min-w-0 flex-1">
        <p className="text-base text-slate-400">{label}</p>

        {loading ? (
          <div className="mt-2 h-8 w-36 animate-pulse rounded bg-white/10" />
        ) : (
          <>
            <p className="mt-1 whitespace-nowrap text-2xl font-bold text-white">
              {value}
            </p>

            {hasChange && (
              <p
                className={`mt-1.5 text-sm font-semibold ${positive ? 'text-emerald-400' : 'text-red-400'
                  }`}
              >
                {positive ? '▲' : '▼'} {formatPercent(change)}
              </p>
            )}
          </>
        )}
      </div>

      {!loading && sparkline && (
        <Sparkline
          data={sparkline}
          color={color}
          className="h-16 w-32 flex-shrink-0"
        />
      )}
    </div>
  )
}

export default StatCard